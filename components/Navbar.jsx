"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    setIsOpen(false);
  };

  return (
    <nav className="bg-transparent backdrop-blur-md border border-white/30 text-white p-4 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left - Logo */}
        <Link href="/" className="text-2xl font-bold transition-colors">
          MRS-DOCKER
        </Link>

        {/* Right - User / Menu */}
        <div className="relative">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex items-center space-x-2 focus:outline-none group"
          >
            {status === "authenticated" && session?.user ? (
              <>
                {session.user.imageUrl ? (
                  <Image
                    src={session.user.imageUrl}
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full border border-gray-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-lg font-semibold">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="hidden sm:inline font-medium">
                  {session.user.name?.split("@")[0] || "User"}
                </span>
              </>
            ) : (
              <span className="font-medium ">Menu</span>
            )}

            {/* Dropdown Icon */}
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg py-2 z-50">
              {status === "authenticated" ? (
                <>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
