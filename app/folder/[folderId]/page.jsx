"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Spotlight } from "@/components/ui/spotlight-new";
import { IconDownload, IconSortDescending, IconSortAscending, IconSearch, IconFile, IconExternalLink, IconUpload, IconX } from "@tabler/icons-react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function FolderPage({ params }) {
  const { folderId } = params;
  const [files, setFiles] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`/api/file?folderId=${folderId}`);
      setFiles(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to fetch files");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [folderId]);

  const handleFileUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(progress);
      }
    };

    reader.onloadend = async () => {
      try {
        await axios.post("/api/file", {
          name: file.name,
          fileBase64: reader.result,
          folderId,
        });
        toast.success(`${file.name} uploaded successfully`);
        fetchFiles();
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Failed to upload file");
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    };
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  return (
    <>
      <Toaster position="top-right" theme="system" richColors />
      <Navbar />
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-black bg-grid-white/[0.03] relative flex flex-col items-center">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />
        <div className="p-4 sm:p-6 max-w-7xl mx-auto pt-24 z-10 w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Files in: {decodeURIComponent(folderId)}
          </h1>

          <motion.div
            className={`bg-neutral-900/70 border-2 ${isDragging ? 'border-cyan-500' : 'border-neutral-800'} rounded-xl p-6 backdrop-blur-md mb-6 transition-all duration-300`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center justify-center text-center py-8">
              <IconUpload className={`w-12 h-12 ${isDragging ? 'text-cyan-400' : 'text-neutral-400'} mb-4 transition-colors duration-300`} />
              <p className="text-white text-lg mb-2">
                {isDragging ? "Drop your file here" : "Drag & drop a file here or click to upload"}
              </p>
              <p className="text-neutral-400 text-sm mb-4">Supported formats: PDF, PNG, JPG, DOCX</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="hidden"
                disabled={isUploading}
              />
              <Button
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg"
              >
                {isUploading ? "Uploading..." : "Select File"}
              </Button>
              <AnimatePresence>
                {isUploading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full mt-4"
                  >
                    <Progress value={uploadProgress} className="w-full h-2 bg-neutral-800" />
                    <p className="text-sm text-neutral-400 mt-2">
                      Uploading: {uploadProgress}%
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full sm:w-auto">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-[300px] bg-neutral-800/70 border-neutral-700 text-white focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0 focus:ring-offset-black transition-all duration-300 rounded-lg"
                />
              </div>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full sm:w-[180px] bg-neutral-800/70 border-neutral-700 text-white focus:ring-2 focus:ring-cyan-500 rounded-lg">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 text-white border-neutral-700">
                  <SelectItem value="newest">
                    <div className="flex items-center space-x-2">
                      <IconSortDescending className="w-4 h-4" />
                      <span>Newest</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="oldest">
                    <div className="flex items-center space-x-2">
                      <IconSortAscending className="w-4 h-4" />
                      <span>Oldest</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {sortedFiles.length === 0 ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <IconFile className="mx-auto w-16 h-16 text-neutral-600 mb-4" />
                <p className="text-neutral-400 text-lg">
                  {searchTerm ? "No files match your search." : "This folder is empty."}
                </p>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {sortedFiles.map((file) => (
                  <motion.div
                    key={file._id}
                    className="group relative flex flex-col justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex flex-col items-start space-y-3 flex-grow">
                      <IconFile className="w-10 h-10 text-cyan-400" />
                      <span className="text-white text-sm font-medium break-all w-full">
                        {file.name}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-start space-x-2 mt-4 pt-4 border-t border-neutral-800">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-neutral-300 bg-neutral-800 border-neutral-700 hover:bg-neutral-700 hover:text-white"
                        onClick={() => window.open(file.fileUrl, "_blank")}
                      >
                        <IconExternalLink className="w-4 h-4 mr-2" />
                        Open
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                        onClick={() => handleDownload(file.fileUrl, file.name)}
                      >
                        <IconDownload className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}