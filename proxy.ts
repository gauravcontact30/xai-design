import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export default withAuth(
  async function middleware(request: NextRequest) {
    return await updateSession(request);
  },
  {
    isReturnToCurrentPage: true,
    publicPaths: ["/", "/api/inngest"],
  }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
