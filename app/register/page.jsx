'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { cn } from "@/lib/utils"
import { Spotlight } from "../../components/ui/spotlight-new"
import { toast } from "sonner"
import { Toaster } from "../../components/ui/sonner"
import Link from 'next/link'

function Register() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [country, setCountry] = useState("")
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await axios.post('/api/auth/register', {
                name,
                email,
                country,
                password,
            })

            if (response.status === 201) {
                toast.success("Account created successfully!", {
                    style: {
                        background: "#1f1f1f",
                        color: "#fff",
                        border: "1px solid #333",
                    },
                    iconTheme: {
                        primary: "#4ade80",
                        secondary: "#1f1f1f",
                    },
                })
                setTimeout(() => {
                    router.push("/login")
                }, 2000)
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                toast.error("User with this email already exists", {
                    style: {
                        background: "#1f1f1f",
                        color: "#fff",
                        border: "1px solid #333",
                    },
                    iconTheme: {
                        primary: "#f87171",
                        secondary: "#1f1f1f",
                    },
                })
            } else {
                toast.error("Something went wrong. Please try again.", {
                    style: {
                        background: "#1f1f1f",
                        color: "#fff",
                        border: "1px solid #333",
                    },
                    iconTheme: {
                        primary: "#f87171",
                        secondary: "#1f1f1f",
                    },
                })
            }
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
                           Mrs Docker
                        </h1>
                        <p className="mt-4 font-normal text-sm md:text-base text-neutral-300 max-w-lg text-center mx-auto">
                            Create folders, organize your files, and upload images & videos securely.
                            Your personal cloud, powered by Mrs Docker 🚀
                        </p>
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
                    <div className="bg-zinc-900 text-white shadow-lg rounded-lg w-full max-w-md p-6 border border-zinc-700">
                        <h2 className="text-2xl font-bold mb-6 text-neutral-100">Register</h2>

                        <form onSubmit={handleSubmit}>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="name" className="text-neutral-200">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="bg-zinc-800 text-white border-zinc-600 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500"
                                />
                            </LabelInputContainer>

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

                            <LabelInputContainer className="mb-6">
                                <Label htmlFor="country" className="text-neutral-200">Country</Label>
                                <Input
                                    id="country"
                                    placeholder="Pakistan"
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    required
                                    className="bg-zinc-800 text-white border-zinc-600 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-500"
                                />
                            </LabelInputContainer>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-neutral-800 text-white py-2 rounded-md hover:bg-neutral-700 transition disabled:opacity-50"
                            >
                                {loading ? "Signing up..." : "Sign Up"}
                            </button>

                            <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />

                            <div className="text-center">
                                <p className="text-sm text-neutral-400">
                                    Do you have an account?{' '}
                                    <Link
                                        href="/login"
                                        className="text-neutral-200 hover:text-neutral-100 underline transition"
                                    >
                                        Login
                                    </Link>
                                </p>
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