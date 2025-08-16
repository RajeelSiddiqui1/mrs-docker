"use client";

import Navbar from "@/components/Navbar";
import { Spotlight } from "@/components/ui/spotlight-new";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { IconFolder, IconSearch, IconPlus } from "@tabler/icons-react";
import { Toaster } from "@/components/ui/sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";

export default function Home() {
    const [folders, setFolders] = useState([]);
    const [filteredFolders, setFilteredFolders] = useState([]);
    const [folderName, setFolderName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const router = useRouter();

    const fetchFolders = async () => {
        try {
            const { data } = await axios.get("/api/folder");
            if (data?.folders) {
                setFolders(data.folders);
                setFilteredFolders(data.folders);
            }
        } catch (error) {
            toast.error("Something went wrong");
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
        } catch (error) {
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
                                <Button className=" text-white transition flex items-center space-x-2">
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
                                    <Button
                                        onClick={handleCreateFolder}
                                        disabled={loading}
                                        className="text-white"
                                    >
                                        {loading ? "Creating..." : "Create"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredFolders.map((folder) => (
                            <div
                                key={folder._id}
                                onClick={() => router.push(`/folders/${folder._id}`)}
                                className="flex flex-col items-center justify-between p-4 bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-700 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                            >
                                <div className="flex flex-col items-center">
                                    <IconFolder className="w-16 h-16 text-yellow-400 mb-2" />
                                    <span className="text-white text-sm font-medium text-center truncate w-full">
                                        {folder.name}
                                    </span>
                                </div>
                                <span className="text-gray-400 text-xs mt-2">
                                    Created: {format(new Date(folder.createdAt), "MMM d, yyyy")}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}