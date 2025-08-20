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
import Link from 'next/link'

function Login() {
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
      <div className="min-h-screen w-full flex flex-col md:flex-row bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight />
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="max-w-7xl mx-auto relative z-10 w-full pt-10 md:pt-0 text-center">
            <h1 className="text-3xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
              Mrs Docker
            </h1>
            <p className="mt-4 font-normal text-sm md:text-base text-neutral-300 max-w-lg mx-auto">
              Create folders, organize your files, and upload images & videos securely.
              Your personal cloud, powered by Mrs Docker 🚀
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="bg-zinc-900 text-white shadow-lg rounded-lg w-full max-w-md p-6 border border-zinc-700">
            <h2 className="text-2xl font-bold mb-6 text-neutral-100">Login</h2>
            <form onSubmit={handleSubmit}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="email" className="text-neutral-200">Email Address</Label>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-800 text-white border-zinc-600 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500"
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="password" className="text-neutral-200">Password</Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-zinc-800 text-white border-zinc-600 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500"
                />
              </LabelInputContainer>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-neutral-800 text-white py-2 rounded-md hover:bg-neutral-700 transition disabled:opacity-50"
              >
                {loading ? "Logging..." : "Login"}
              </button>
            </form>
            <div className="text-center mt-3">
              <p className="text-sm text-neutral-400">
                Don't have an account?{' '}
                <Link
                  href="/register"
                  className="text-neutral-200 hover:text-neutral-100 underline transition"
                >
                  Register
                </Link>
              </p>
            </div>
            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
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

export default Login