import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { dbConnect } from "@/lib/db";
import File from "@/models/File";
import { getServerSession } from "next-auth";


export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get("folderId")

    if (!folderId) {
        return Response.json({ error: "folderId required" }, { status: 400 });
    }
    try {
        await dbConnect();
        const files = await File.find({ folderId });
        return Response.json(files, { status: 200 });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Failed to fetch files" }, { status: 500 });
    }
}


export async function POST(request) {

    const session = await getServerSession(authOptions)
    const userSessionId = session?.user?.id
    if (!userSessionId) {
        return Response.json({
            error: "Unauthorized"
        }, {
            status: 401
        })
    }

    const { name, fileBase64, folderId } = await request.json();

    if (!name || !fileBase64 || !folderId) {
        return Response.json({ error: "Fill all required fields" }, { status: 400 });
    }

    try {
        await dbConnect();

        const fileNameExists = await File.findOne({ name, folderId })
        if (fileNameExists) {
            return Response.json({
                error: "File name is already exists"
            }, {
                status: 400
            })
        }

        const uploadRes = await cloudinary.uploader.upload(fileBase64, {
            folder: `user_${userSessionId}/${folderId}`,
            resource_type: "auto"
        })

        const file = await File.create({
            name,
            fileUrl: uploadRes.secure_url,
            folderId,
            userId: userSessionId
        })

        return Response.json({ success: true, file }, { status: 201 });
    } catch (error) {
        console.error("Upload error:", error);
        return Response.json({ error: "Something went wrong" }, { status: 500 });
    }
}