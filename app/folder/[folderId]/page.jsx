"use client";

import { use } from "react";
import Navbar from "@/components/Navbar";
import { Spotlight } from "@/components/ui/spotlight-new";
import { CldUploadButton } from "next-cloudinary";
import { IconUpload, IconDownload, IconSortDescending, IconSortAscending } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function FolderPage({ params }) {
  // ✅ unwrap params
  const { folderId } = use(params);

  const [sortOrder, setSortOrder] = useState("newest");
  const folderName = decodeURIComponent(folderId) || "Folder";
  const router = useRouter();

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight />

        <div className="p-6 max-w-7xl mx-auto pt-24">
          <h1 className="text-3xl font-bold text-white mb-8 text-center truncate">
            {folderName}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-1 bg-gray-800 rounded-xl p-6 flex flex-col items-center justify-center space-y-4">
              <CldUploadButton
                uploadPreset="your-upload-preset"
                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:-translate-y-1"
              >
                <IconUpload className="w-5 h-5" />
                <span>Upload File</span>
              </CldUploadButton>
              <p className="text-gray-400 text-sm text-center">
                You can upload files up to 5 MB
              </p>
            </div>

            {/* File List Section */}
            <div className="lg:col-span-3 bg-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Files</h2>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-[180px] bg-gray-700 text-white border-gray-700 focus:ring-2 focus:ring-green-500 rounded-lg">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-white border-gray-700">
                    <SelectItem value="newest" className="hover:bg-gray-600">
                      <div className="flex items-center space-x-2">
                        <IconSortDescending className="w-4 h-4" />
                        <span>Newest</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="oldest" className="hover:bg-gray-600">
                      <div className="flex items-center space-x-2">
                        <IconSortAscending className="w-4 h-4" />
                        <span>Oldest</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Example File Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-between p-4 bg-gray-700 rounded-xl hover:bg-gray-600 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col items-center">
                      <IconDownload className="w-12 h-12 text-blue-400 mb-2" />
                      <span className="text-white text-sm font-medium text-center truncate w-full">
                        File {index + 1}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-500 hover:bg-gray-600 mt-2"
                    >
                      <IconDownload className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
