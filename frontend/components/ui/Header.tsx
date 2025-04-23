import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
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
        {/* Add this new div for auth buttons */}
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="outline"
              className="border-[#A37CF0] text-[#A37CF0] hover:bg-[#A37CF0]/10"
            >
              Login
            </Button>
          </Link>
          <Link href="/register" className="hidden sm:block">
            <Button className="bg-white text-[#A37CF0] hover:bg-white/90">
              Register
            </Button>
          </Link>
        </div>
        {/* <h2 className="text-xl font-medium text-black hidden sm:block">
          Basic Interactive Simulator for Quantum Information & Technology
        </h2> */}
      </div>
    </div>
  );
}
