'use client'

import React, { useState } from 'react'
import { signIn } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { cn } from "@/lib/utils"
import { Spotlight } from "../../components/ui/spotlight-new"
import { toast } from "sonner"
import { Toaster } from "../../components/ui/sonner"
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandFacebook,
} from "@tabler/icons-react"

function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!email || !password) {
      toast.warning("Please enter both email and password", { duration: 3000 })
      setLoading(false)
      return
    }

    try {
      const response = await signIn('credentials', {
        redirect: false,
        email,
        password
      })

      if (response?.error) {
        toast.error(response.error || "Invalid email or password", {
          style: { background: "#1f1f1f", color: "#fff", border: "1px solid #333" },
          iconTheme: { primary: "#f87171", secondary: "#1f1f1f" },
        })
      } else {
        toast.success("Login successfully completed", {
          style: { background: "#1f1f1f", color: "#fff", border: "1px solid #333" },
          iconTheme: { primary: "#4ade80", secondary: "#1f1f1f" },
        })
        setTimeout(() => router.push("/"), 2000)
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.", {
        style: { background: "#1f1f1f", color: "#fff", border: "1px solid #333" },
        iconTheme: { primary: "#f87171", secondary: "#1f1f1f" },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Toaster position="top-right" />

      <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight />

        {/* Left Section with Spotlight */}
        <div className="w-full md:w-1/2 h-auto md:h-screen flex items-center justify-center relative">
          <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-10 md:pt-0">
            <h1 className="text-3xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
              Spotlight <br /> which is not overused.
            </h1>
            <p className="mt-4 font-normal text-sm md:text-base text-neutral-300 max-w-lg text-center mx-auto">
              A subtle yet effective spotlight effect, because the previous version is used a bit too much these days.
            </p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="bg-white text-black shadow-lg rounded-lg w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-6">Register</h2>

            <form onSubmit={handleSubmit}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </LabelInputContainer>

              <LabelInputContainer className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </LabelInputContainer>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>

              <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

              {/* GitHub Login */}
              <div className="flex flex-col space-y-3 mt-6">
                <button
                  type="button"
                  onClick={() => signIn("github", { callbackUrl: "/" })}
                  className="w-full flex items-center justify-center space-x-2 rounded-md bg-gray-50 py-2 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] hover:bg-gray-200 transition"
                >
                  <IconBrandGithub className="h-5 w-5 text-neutral-800 dark:text-neutral-300" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">GitHub</span>
                </button>

                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  className="w-full flex items-center justify-center space-x-2 rounded-md bg-gray-50 py-2 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] hover:bg-gray-200 transition"
                >
                  <IconBrandGoogle className="h-5 w-5 text-neutral-800 dark:text-neutral-300" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => signIn("facebook", { callbackUrl: "/" })}
                  className="w-full flex items-center justify-center space-x-2 rounded-md bg-gray-50 py-2 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626] hover:bg-gray-200 transition"
                >
                  <IconBrandFacebook className="h-5 w-5 text-neutral-800 dark:text-neutral-300" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">Facebook</span>
                </button>
              </div>



            </form>
          </div>
        </div>
      </div>
    </>
  )
}

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  )
}

export default Register
