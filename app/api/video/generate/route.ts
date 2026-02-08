import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";

export async function POST(req: Request) {
  try {
    const { prompt, duration } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Create DB record
    const video = await prisma.video.create({
      data: {
        prompt,
        status: "PENDING",
      },
    });

    // Trigger Inngest event
    console.log(`[API] Triggering video/generate for videoId: ${video.id}`);
    await inngest.send({
      name: "video/generate",
      data: {
        prompt,
        duration,
        videoId: video.id,
      },
    });
    console.log(`[API] Event sent for videoId: ${video.id}`);

    return NextResponse.json({ 
        videoId: video.id,
        status: "PENDING" 
    });
  } catch (error) {
    console.error("Error triggering video generation:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
