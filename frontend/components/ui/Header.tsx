"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, HelpCircle } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
    // You might want to redirect after logout
    // window.location.href = "/";
  };

  return (
    <div
      className="w-full py-4 border-b"
      style={{ backgroundColor: "#A37CF0" }}
    >
      <div className="w-[95vw] mx-auto px-1 sm:px-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Adjusted SVG icon container and size */}
          <div className="w-10 h-10 flex items-center justify-center">
            <Image
              src="/BQfit.svg"
              alt="BisQit Logo"
              width={40}
              height={40}
              className="object-contain"
              style={{ marginTop: 0 }}
            />
          </div>
          <h1 className="text-3xl font-bold text-black">BisQit</h1>
        </div>
        <h2 className="text-2xl font-bold text-black hidden sm:block">
          Basic Interactive Simulator for Quantum Information & Technology
        </h2>

        {/* Authentication UI */}
        <div className="flex items-center gap-3">
          {/* Help Button */}
          <Link href="/help">
            <Button
              variant="ghost"
              className="flex items-center justify-center text-white hover:bg-[#A37CF0]/60 w-10 h-10 rounded-full"
              title="Help"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </Link>

          {isAuthenticated ? (
            <>
              {/* Show user menu when logged in */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 text-white hover:bg-[#A37CF0]/60"
                  >
                    <User className="h-4 w-4" />
                    <span>{user?.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {/* Show login/register when logged out */}
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white text-[#A37CF0]"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button className="bg-white text-[#A37CF0] hover:bg-white/90">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
