"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="btn-press flex items-center gap-1.5 rounded-md bg-koreksi px-3 py-2 text-sm font-semibold text-koreksi-ink hover:opacity-90"
    >
      <LogOut size={14} aria-hidden />
      Keluar
    </button>
  );
}
