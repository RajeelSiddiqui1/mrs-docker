"use client";

import Navbar from "@/components/Navbar";
import { Spotlight } from "@/components/ui/spotlight-new";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { IconFolder, IconSearch, IconPlus, IconTrash } from "@tabler/icons-react";
import { Toaster } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [folders, setFolders] = useState([]);
  const [filteredFolders, setFilteredFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  const fetchFolders = async () => {
    setFetching(true);
    try {
      const { data } = await axios.get("/api/folder");
      if (data?.folders) {
        setFolders(data.folders);
        setFilteredFolders(data.folders);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    const filtered = folders.filter((folder) =>
      folder.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFolders(filtered);
  }, [searchQuery, folders]);

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return toast.warning("Enter folder name");
    setLoading(true);
    try {
      const { data } = await axios.post("/api/folder", { name: folderName });
      if (data?.folder) {
        toast.success("Folder created successfully");
        setFolders((prev) => [data.folder, ...prev]);
        setFolderName("");
        setIsDialogOpen(false);
      } else {
        toast.error(data.error || "Failed to create folder");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteFolder = async (folderId) => {
    setLoading(true);
    try {
      const { data } = await axios.delete(`/api/folder/${folderId}`);
      if (data?.ok) {
        toast.success("Folder deleted successfully");
        setFolders((prev) => prev.filter((folder) => folder._id !== folderId));
        setFilteredFolders((prev) => prev.filter((folder) => folder._id !== folderId));
      } else {
        toast.error(data.error || "Failed to delete folder");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight />

        <div className="p-6 max-w-7xl mx-auto pt-24">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative w-full sm:w-1/3">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-green-500 rounded-lg"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="text-white flex items-center space-x-2">
                  <IconPlus className="w-5 h-5" />
                  <span>Create Folder</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 text-white border-gray-700">
                <DialogHeader>
                  <DialogTitle>Create New Folder</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                  <Input
                    type="text"
                    placeholder="Folder name"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    className="bg-gray-800 text-white border-gray-700"
                  />
                  <Button onClick={handleCreateFolder} disabled={loading} className="text-white">
                    {loading ? "Creating..." : "Create"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {fetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 bg-gray-800 rounded-xl">
                  <Skeleton className="w-16 h-16 rounded-lg mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredFolders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <IconFolder className="w-20 h-20 text-gray-500 mb-4" />
              <p className="text-gray-400 text-lg">No folders yet</p>
              <p className="text-gray-500">Create a folder to upload your files</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredFolders.map((folder) => (
                <div
                  key={folder._id}
                  className="flex flex-col items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-700 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div
                    className="flex flex-col items-center w-full cursor-pointer"
                    onClick={() => router.push(`/folder/${folder._id}`)}
                  >
                    <IconFolder className="w-16 h-16 text-yellow-400 mb-2" />
                    <span className="text-white text-sm font-medium text-center truncate w-full">
                      {folder.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full mt-2">
                    <span className="text-gray-400 text-xs">
                      Created: {format(new Date(folder.createdAt), "MMM d, yyyy")}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(folder._id);
                      }}
                      disabled={loading}
                      className="text-red-400 hover:text-red-500 hover:bg-gray-700"
                    >
                      <IconTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
