import Link from "next/link";
import Logo from "@/components/logo";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-background py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              AI-powered tools for the next generation of creators.
              Automate your content creation workflow.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Product</h3>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/gen-media" className="text-sm text-muted-foreground hover:text-foreground">
              Gen Media
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Company</h3>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Blog
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold">Legal</h3>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Xai Design. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
