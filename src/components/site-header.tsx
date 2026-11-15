import Link from "next/link";
import { Logo } from "@/components/logo";
import { SiteNav } from "@/components/site-nav";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="site-header fixed left-3 right-3 top-3 z-40 mx-auto max-w-6xl sm:left-6 sm:right-6">
      <div className="flex h-14 items-center justify-between gap-4 rounded-full border border-line bg-card pl-5 pr-2 shadow-[0_12px_32px_-18px_rgba(22,33,30,0.4)]">
        <Link href="/" aria-label="TentorKeun, ke beranda">
          <Logo />
        </Link>
        <SiteNav authed={Boolean(session)} signOut={<SignOutButton />} />
      </div>
    </header>
  );
}
