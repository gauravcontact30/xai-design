import { inngest } from "@/inngest/client";
import Replicate from "replicate";
import prisma from "@/lib/prisma";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const generateVideo = inngest.createFunction(
  { id: "generate-video" },
  { event: "video/generate" },
  async ({ event, step }) => {
    const { prompt, videoId, duration } = event.data;
    console.log(`[Inngest] Starting generation for videoId: ${videoId}`);

    try {
        const video = await step.run("get-video", async () => {
            return prisma.video.findUnique({
                where: { id: videoId }
            })
        })

        if (!video) {
            throw new Error("Video not found");
        }

        await step.run("update-status-processing", async () => {
            await prisma.video.update({
                where: { id: videoId },
                data: { status: "PROCESSING" }
            })
        })

        const output = await step.run("generate-video-replicate", async () => {
          // Using AnimateDiff Lightning for instant generation (< 1 min)
          // lucataco/animate-diff-lightning-4-step
          
          const output = await replicate.run(
            "lucataco/animatediff-lightning-4-step:7ea986513772d24249a60e03e5c709cb8d97519a8607aa5264b38743bc5943a4",
            {
              input: {
                prompt: prompt,
                // AnimateDiff Lightning is specific about these params
                // It generates ~2-4s videos usually
              }
            }
          );
          
          // Replicate returns an array of output URLs mostly
          return output;
        });

        await step.run("update-status-completed", async () => {
            const resultUrl = Array.isArray(output) ? output[0] : output;
            await prisma.video.update({
                where: { id: videoId },
                data: { 
                    status: "COMPLETED",
                    resultUrl: resultUrl
                }
            })
        })

        return { success: true, videoId };
    } catch (error) {
        console.error("Video generation failed:", error);
        await step.run("update-status-failed", async () => {
            await prisma.video.update({
                where: { id: videoId },
                data: { status: "FAILED" }
            })
        });
        throw error;
    }
  }
);
