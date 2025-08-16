import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Folder from "@/models/Folder";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  const sessionUserId = session?.user?.id;

  if (!sessionUserId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    const folders = await Folder.find({ userId: sessionUserId }).sort({ createdAt: -1 });

    return Response.json({ folders }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  const sessionUserId = session?.user?.id;

  if (!sessionUserId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await request.json();
  if (!name) {
    return Response.json({ error: "Folder name is required" }, { status: 400 });
  }

  const exisitingFolderName = await Folder.findOne({ name });
  if (exisitingFolderName) {
    return Response.json({ error: "Folder name already exists" }, { status: 409 });
  }

  try {
    await dbConnect();

    const folder = await Folder.create({
      name,
      userId: sessionUserId,
    });

    return Response.json({ folder }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Failed to create folder" }, { status: 500 });
  }
}
