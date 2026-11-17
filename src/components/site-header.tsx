import Link from "next/link";
import { Logo } from "@/components/logo";
import { SiteNav } from "@/components/site-nav";
import { HeaderFrame } from "@/components/header-frame";
import { auth } from "@/lib/auth";
import { SignOutButton } from "./sign-out-button";

export async function SiteHeader() {
  const session = await auth();

  return (
    <HeaderFrame>
      <Link href="/" aria-label="TentorKeun, ke beranda">
        <Logo />
      </Link>
      <SiteNav authed={Boolean(session)} signOut={<SignOutButton />} />
    </HeaderFrame>
  );
}
