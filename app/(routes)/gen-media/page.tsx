
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import Link from "next/link";
import { ArrowRight, Calendar, Mail, Play, Video, Youtube } from "lucide-react";
import { VideoGenerator } from "./_components/video-generator";
import { WatchDemoModal } from "./_components/watch-demo-modal";

export default function GenMediaPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-background overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              AI Short Video Generator & Scheduler
            </h1>
            <p className="text-xl text-muted-foreground">
              Automate your social media presence. Create and autoschedule engaging AI videos for YouTube, Instagram, TikTok, and Email campaigns in minutes.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <VideoGenerator />
              <WatchDemoModal />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ad Section */}
      <section className="py-12 bg-black/5">
        <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Featured Campaign</h2>
                    <p className="text-muted-foreground">See what's possible with AI-generated video content.</p>
                </div>
                <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl border">
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
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to dominate short-form video content without the hassle of manual editing and posting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Video className="h-10 w-10 text-primary" />}
              title="AI Video Generator"
              description="Turn text scripts into viral short videos with AI-generated visuals, voiceovers, and captions instantly."
            />
            <FeatureCard 
              icon={<Calendar className="h-10 w-10 text-primary" />}
              title="Smart Auto-Scheduler"
              description="Schedule your content effectively. Our AI determines the best posting times for maximum engagement."
            />
            <FeatureCard 
              icon={<Youtube className="h-10 w-10 text-primary" />}
              title="Multi-Platform Support"
              description="Publish directly to YouTube Shorts, Instagram Reels, TikTok, and integrate video into your Email marketing."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl border shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 p-3 bg-primary/10 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
