import cloudinary from "@/lib/cloudinary";
import { dbConnect } from "@/lib/db";
import File from "@/models/File"


export async function DELETE(request, { params }) {
    try {
        await dbConnect();

        const { id } =  await params;

        const file = await File.findById(id)

        if (!file) {
            return Response.json({ error: "File not found" }, { status: 404 });
        }

        if (file.publicId) {
            await cloudinary.uploader.destroy(file.publicId)
        }

        await File.findByIdAndDelete(id)
        return Response.json({ success: true, message: "File deleted" });
    } catch (error) {
        console.error("Delete error:", error);
        return Response.json({ error: "Failed to delete file" }, { status: 500 });
    }
}