import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Folder from "@/models/Folder";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions); 
  const userSessionId = session?.user?.id;

  if (!userSessionId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const { id } = params;

    const folder = await Folder.findOneAndDelete({
      _id: id,
      userId: userSessionId,
    });

    if (!folder) {
      return NextResponse.json(
        { error: "Folder not found or not owned by user" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true, message: "Folder deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
