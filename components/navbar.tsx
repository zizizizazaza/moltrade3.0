"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, BarChart3, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#212525] bg-[#16191a]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5 sm:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#16c784] text-[#16191a] font-bold text-xs transition-opacity group-hover:opacity-80">
            M
          </div>
          <span className="text-[13px] font-semibold tracking-tight hidden sm:inline text-[#c0c0c0]">
            MoltTrade
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-0.5">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors duration-150",
              pathname === "/"
                ? "text-[#ededed] bg-[#212525]"
                : "text-[#566163] hover:text-[#888]"
            )}
          >
            <Zap className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Predict</span>
          </Link>
          <Link
            href="/portfolio"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors duration-150",
              pathname === "/portfolio"
                ? "text-[#ededed] bg-[#212525]"
                : "text-[#566163] hover:text-[#888]"
            )}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Portfolio</span>
          </Link>
        </nav>

        {/* Login */}
        <button className="flex items-center gap-1.5 border border-[#2e3435] text-[#888] hover:text-[#ededed] hover:border-[#383838] text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors duration-150">
          <LogIn className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Login</span>
        </button>
      </div>
    </header>
  );
}
