"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlayCircle } from "lucide-react"

export function WatchDemoModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="rounded-full px-8 group">
          Watch Demo
          <PlayCircle className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden bg-black/90 border-none">
        <DialogHeader className="sr-only">
          <DialogTitle>Product Demo Video</DialogTitle>
        </DialogHeader>
        <div className="relative aspect-video w-full">
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/pwLergHG81c?autoplay=1&mute=1" 
                title="Nike - Winning Isn't for Everyone" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="w-full h-full"
            ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  )
}
