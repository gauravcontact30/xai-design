"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Loader2, Download, Video, CheckCircle2 } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type Duration = "15s" | "30s" | "60s"

export function VideoGenerator() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<"input" | "generating" | "result">("input")
  const [prompt, setPrompt] = useState("")
  const [duration, setDuration] = useState<Duration>("30s")
  const [loading, setLoading] = useState(false)
  const [resultVideo, setResultVideo] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  // Simulated progress effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "generating") {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          // Slow down as it gets closer to 90%
          if (prev >= 90) return prev;
          const increment = prev < 50 ? 5 : prev < 80 ? 2 : 1;
          return prev + increment;
        });
      }, 500); // Update every 500ms
    }
    return () => clearInterval(interval);
  }, [step]);

  const checkStatus = async (id: string) => {
    try {
        const res = await fetch(`/api/video/${id}`);
        if (!res.ok) throw new Error("Failed to check status");
        
        const data = await res.json();
        
        if (data.status === "COMPLETED") {
            setProgress(100);
            setResultVideo(data.resultUrl);
            // Small delay to show 100%
            setTimeout(() => {
                setStep("result");
                setLoading(false);
            }, 500);
            return true; // Done
        } else if (data.status === "FAILED") {
            setError("Generation failed. Please try again.");
            setStep("input");
            setLoading(false);
            return true; // Done (with error)
        }
        
        return false; // Continue polling
    } catch (err) {
        console.error(err);
        return false;
    }
  }

  const handleGenerate = async () => {
    if (!prompt) return
    setStep("generating")
    setLoading(true)
    setError(null)
    
    const startTime = Date.now();
    const TIMEOUT_MS = 120000; // 2 minutes

    try {
        const response = await fetch("/api/video/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt,
                duration
            })
        });

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.error || "Failed to start generation");
        }

        const { videoId } = await response.json();
        
        // Poll every 5 seconds
        const intervalId = setInterval(async () => {
            const elapsedTime = Date.now() - startTime;
            
            if (elapsedTime > TIMEOUT_MS) {
                clearInterval(intervalId);
                setError("Generation timed out. Is your background worker running? (npx inngest-cli@latest dev)");
                setStep("input");
                setLoading(false);
                return;
            }

            const isDone = await checkStatus(videoId);
            if (isDone) {
                clearInterval(intervalId);
            }
        }, 5000);

    } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
        setStep("input");
        setLoading(false);
    }
  }

  const reset = () => {
    setStep("input")
    setPrompt("")
    setDuration("30s")
    setResultVideo(null)
    setError(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open)
      if (!open) {
        if (step === "result") reset()
      }
    }}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full px-8">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create AI Video Ad</DialogTitle>
          <DialogDescription>
            Generate high-quality video ads in seconds.
          </DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-6 py-4">
             {error && (
                <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm">
                    {error}
                </div>
             )}
            <div className="space-y-2">
              <Label htmlFor="prompt">Ad Concept / Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Describe your ad concept (e.g., 'A futuristic sneaker commercial set in neon Tokyo with upbeat music')..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Duration</Label>
              <div className="flex gap-4">
                {(["15s", "30s", "60s"] as Duration[]).map((d) => (
                  <Button
                    key={d}
                    type="button"
                    variant={duration === d ? "default" : "outline"}
                    onClick={() => setDuration(d)}
                    className="flex-1"
                  >
                    {d}
                  </Button>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button onClick={handleGenerate} disabled={!prompt.trim() || loading} size="lg" className="w-full sm:w-auto">
                <Video className="mr-2 h-4 w-4" />
                {loading ? "Starting..." : "Generate Video"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "generating" && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 w-full px-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
              <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
            </div>
            <p className="text-lg font-medium animate-pulse">Generating your masterpiece...</p>
            <p className="text-sm text-muted-foreground">Adjusting scenes, mixing audio, and rendering...</p>
            
            <div className="w-full max-w-sm space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-muted-foreground">{progress}% Complete</p>
            </div>
          </div>
        )}

        {step === "result" && resultVideo && (
          <div className="space-y-6 py-4">
            <div className="aspect-video bg-black rounded-lg border overflow-hidden relative group">
              <video 
                src={resultVideo} 
                className="w-full h-full object-cover"
                controls
                autoPlay
                loop
                muted={false} 
              />
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                Generated Ad
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2 text-center">
               <div className="flex items-center gap-2 text-green-500 mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Video Generated Successfully!</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="flex flex-col h-auto py-4 items-center gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all" onClick={() => window.open(resultVideo, '_blank')}>
                <Download className="h-5 w-5" />
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Download</span>
                  <span className="text-xs text-muted-foreground">MP4</span>
                </div>
              </Button>
              {/* XHD not really supported separately by this simple impl yet */}
              <Button variant="outline" className="flex flex-col h-auto py-4 items-center gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all" disabled>
                <Download className="h-5 w-5" />
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Download XHD</span>
                  <span className="text-xs text-muted-foreground">Coming Soon</span>
                </div>
              </Button>
            </div>
            
            <DialogFooter className="sm:justify-center pt-2">
               <Button variant="ghost" onClick={reset}>
                 Generate Another
               </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
