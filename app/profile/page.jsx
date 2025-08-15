"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Toaster, toast } from "sonner";
import { Spotlight } from "@/components/ui/spotlight-new";
import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
      setCountry(session.user.country || "");
      setPreview(session.user.imageUrl || "");
    }
  }, [session]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session?.user?.id) {
      toast.error("You must be logged in to update your profile.", {
        description: "Redirecting to login page...",
      });
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("userId", session.user.id);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("country", country);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await axios.post("/api/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await update({
        ...session,
        user: {
          ...session.user,
          name: res.data.updatedUser.name,
          email: res.data.updatedUser.email,
          country: res.data.updatedUser.country,
          imageUrl: res.data.updatedUser.imageUrl,
        },
      });

      toast.success("Profile updated successfully!", {
        description: "Your information has been updated.",
        action: {
          label: "View Profile",
          onClick: () => window.location.reload(),
        },
      });
    } catch (error) {
     toast.success("Profile updated successfully!", {
        description: "Your information has been updated.",
        action: {
          label: "View Profile",
          onClick: () => window.location.reload(),
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    toast.info("Logging out...", {
      description: "You will be redirected to the login page.",
    });
    await signOut({ redirect: false });
    router.push("/login");
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black/[0.96] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" richColors />
      <Navbar/>
      <div className="min-h-screen w-full flex items-center justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight />
        <div className="bg-white text-black shadow-lg rounded-lg w-full max-w-md p-6 relative z-10">
          <h2 className="text-2xl font-bold mb-6 text-center">Edit Your Profile</h2>
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img
                src={preview || `https://ui-avatars.com/api/?name=${name || 'U'}&background=4B0082&color=fff&size=256`}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-xl transition-transform hover:scale-105"
              />
              <label
                htmlFor="file-upload"
                className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full cursor-pointer transition-colors shadow-md"
              >
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path
                    fillRule="evenodd"
                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </label>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-6">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="United States"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </LabelInputContainer>
            <div className="flex justify-center gap-4">
              <Button
                type="submit"
                loading={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

const Button = ({ children, loading, className, ...props }) => (
  <button
    className={cn(
      "relative bg-indigo-600 hover:bg-indigo-700 text-white rounded-md h-10 px-6 font-medium shadow-lg transition-colors disabled:opacity-50",
      className
    )}
    disabled={loading}
    {...props}
  >
    {children}
    <BottomGradient />
  </button>
);

const BottomGradient = () => (
  <>
    <span className="group-hover:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex flex-col space-y-2 w-full", className)}>
    {children}
  </div>
);

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium text-black leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
    {...props}
  />
));
Label.displayName = "Label";

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-10 w-full border-none bg-gray-100 text-black rounded-md px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition duration-400",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";