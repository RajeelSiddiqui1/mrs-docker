
"use client";

import { useEffect, useState, useRef } from "react";
import { use } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Spotlight } from "@/components/ui/spotlight-new";
import {
  IconDownload,
  IconSortDescending,
  IconSortAscending,
  IconSearch,
  IconFile,
  IconPhoto,
  IconVideo,
  IconTrash,
  IconUpload,
  IconX,
  IconAlertTriangle,
  IconMaximize,
} from "@tabler/icons-react";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const isImage = (fileName) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName);
const isVideo = (fileName) => /\.(mp4|webm|ogg|mov)$/i.test(fileName);

export default function FolderPage({ params }) {
  const { folderId } = use(params);
  const [files, setFiles] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef(null);
  const mediaRef = useRef(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/file?folderId=${folderId}`);
      setFiles(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [folderId]);

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Only image and video files are accepted.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5 MB limit.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        setUploadProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    reader.onloadend = async () => {
      try {
        await axios.post("/api/file", {
          name: file.name,
          fileBase64: reader.result,
          folderId,
        });
        toast.success(`"${file.name}" uploaded successfully!`);
        fetchFiles();
      } catch (err) {
        toast.error(`Failed to upload "${file.name}".`);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    };
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDownload = (url, filename) => {
    toast.info(`Downloading "${filename}"`);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;

    setIsDeleting(true);
    const { _id, name } = fileToDelete;

    try {
      await axios.delete(`/api/file/${_id}`);
      setFiles((prev) => prev.filter((file) => file._id !== _id));
      toast.success(`"${name}" deleted.`);
    } catch (error) {
      toast.error(`Failed to delete "${name}".`);
    } finally {
      setFileToDelete(null);
      setIsDeleting(false);
    }
  };

  const handleFullScreen = () => {
    if (mediaRef.current) {
      if (mediaRef.current.requestFullscreen) {
        mediaRef.current.requestFullscreen();
      } else if (mediaRef.current.webkitRequestFullscreen) {
        mediaRef.current.webkitRequestFullscreen();
      } else if (mediaRef.current.msRequestFullscreen) {
        mediaRef.current.msRequestFullscreen();
      }
    }
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const FilePreviewModal = ({ file, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: -20 }}
        className="relative bg-neutral-900 border border-neutral-700 rounded-lg p-4 max-w-4xl max-h-[90vh] w-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-700">
          <h3 className="text-white font-semibold truncate pr-4">{file.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-neutral-400 hover:text-white hover:bg-neutral-700"
          >
            <IconX className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-grow overflow-auto flex items-center justify-center">
          {isImage(file.name) ? (
            <img
              ref={mediaRef}
              src={file.fileUrl}
              alt={file.name}
              className="max-w-full max-h-full object-contain rounded-md"
            />
          ) : (
            <video
              ref={mediaRef}
              controls
              className="max-w-full max-h-full object-contain rounded-md"
            >
              <source src={file.fileUrl} type={file.type} />
            </video>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            onClick={handleFullScreen}
            className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
          >
            <IconMaximize className="w-5 h-5 mr-2" />
            Full Screen
          </Button>
          <Button
            onClick={() => handleDownload(file.fileUrl, file.name)}
            className="bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
          >
            Download
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );

  const DeleteConfirmationModal = ({ file, onConfirm, onCancel, isDeleting }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: -20 }}
        className="relative bg-neutral-900 border border-red-500/50 rounded-lg p-6 max-w-md w-full shadow-xl shadow-red-500/10"
      >
        {isDeleting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mb-4"
          >
            <Progress value={100} className="w-full h-1 [&>div]:bg-red-500 animate-pulse" />
          </motion.div>
        )}
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-500/10 p-3 rounded-full mb-4">
            <IconAlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Confirm Deletion</h3>
          <p className="text-neutral-400 mb-6">
            Are you sure you want to delete{" "}
            <strong className="text-white font-medium break-all">
              "{file.name}"
            </strong>
            ? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 w-full">
            <Button
              variant="outline"
              onClick={onCancel}
              className="rounded-lg px-5 py-2 text-black border-neutral-600 hover:bg-neutral-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="rounded-lg px-5 py-2 bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <>
      <Toaster position="top-right" theme="dark" richColors />
      <Navbar />
      <div className="min-h-screen bg-black antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="cyan" />
        <div className="p-4 sm:p-6 max-w-7xl mx-auto pt-24 z-10 w-full">
          <motion.div
            className={`bg-neutral-900/50 border-2 ${isDragging ? "border-cyan-500 scale-105" : "border-dashed border-neutral-700"} rounded-xl p-6 backdrop-blur-md mb-8 transition-all duration-300 transform-gpu`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col items-center justify-center text-center py-8">
              <motion.div animate={{ scale: isDragging ? 1.2 : 1 }}>
                <IconUpload className={`w-12 h-12 ${isDragging ? "text-cyan-400" : "text-neutral-400"} mb-4 transition-colors duration-300`} />
              </motion.div>
              <p className="text-white text-lg mb-2 font-semibold">
                {isDragging ? "Drop your image or video to upload!" : "Drag & drop an image or video here"}
              </p>
              <p className="text-neutral-500 text-sm mb-2">or click to browse your files</p>
              <p className="text-red-400 text-xs font-medium">Max file size: 5 MB</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="hidden"
                disabled={isUploading}
                accept="image/*,video/*"
              />
              <Button
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
              >
                {isUploading ? "Uploading..." : "Select File"}
              </Button>
              <AnimatePresence>
                {isUploading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full max-w-md mt-6"
                  >
                    <Progress value={uploadProgress} className="w-full h-2 [&>div]:bg-cyan-400" />
                    <p className="text-sm text-neutral-400 mt-2 font-mono">{uploadProgress}%</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 sm:p-6 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full sm:w-auto">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-[300px] bg-neutral-800 border-neutral-700 text-white focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0 focus:ring-offset-black transition-all duration-300 rounded-lg"
                />
              </div>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full sm:w-[180px] bg-neutral-800 border-neutral-700 text-white focus:ring-2 focus:ring-cyan-500 rounded-lg">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 text-white border-neutral-700">
                  <SelectItem value="newest">
                    <div className="flex items-center gap-2">
                      <IconSortDescending className="w-4 h-4" />
                      <span>Newest</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="oldest">
                    <div className="flex items-center gap-2">
                      <IconSortAscending className="w-4 h-4" />
                      <span>Oldest</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {loading && files.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">Loading files...</div>
            ) : sortedFiles.length === 0 ? (
              <motion.div className="text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <IconFile className="mx-auto w-16 h-16 text-neutral-700 mb-4" />
                <p className="text-neutral-400 text-lg">
                  {searchTerm ? "No files match your search." : "This folder is empty. Try uploading a file!"}
                </p>
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AnimatePresence>
                  {sortedFiles.map((file) => (
                    <motion.div
                      layout
                      key={file._id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                      className="group relative flex flex-col justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-lg hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete file"
                        className="absolute top-2 right-2 h-8 w-8 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => setFileToDelete(file)}
                      >
                        <IconTrash className="w-5 h-5" />
                      </Button>
                      <div className="flex flex-col items-start space-y-3 flex-grow">
                        {isImage(file.name) ? (
                          <IconPhoto className="w-10 h-10 text-cyan-400" />
                        ) : isVideo(file.name) ? (
                          <IconVideo className="w-10 h-10 text-cyan-400" />
                        ) : (
                          <IconFile className="w-10 h-10 text-neutral-500" />
                        )}
                        <span className="text-white text-sm font-medium break-all w-full pr-8">{file.name}</span>
                        <span className="text-xs text-neutral-500">{new Date(file.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-start space-x-2 mt-4 pt-4 border-t border-neutral-800">
                        {(isImage(file.name) || isVideo(file.name)) ? (
                          <>
                            <Button
                              size="sm"
                              className="flex-1 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                              onClick={() => setViewingFile(file)}
                            >
                              Open
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                              onClick={() => handleDownload(file.fileUrl, file.name)}
                            >
                              Download
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            className="flex-1 bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                            onClick={() => handleDownload(file.fileUrl, file.name)}
                          >
                            Download
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {viewingFile && <FilePreviewModal file={viewingFile} onClose={() => setViewingFile(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {fileToDelete && (
          <DeleteConfirmationModal
            file={fileToDelete}
            onConfirm={handleDeleteFile}
            onCancel={() => setFileToDelete(null)}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>
    </>
  );
}
