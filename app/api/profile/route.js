import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_SECRET,
});

export const config = {
  api: { bodyParser: false },
};

export async function POST(request) {
  try {
    const formData = await request.formData();
    const userId = formData.get("userId");
    const name = formData.get("name");
    const email = formData.get("email");
    const country = formData.get("country");
    const file = formData.get("image");

    if (!userId || !name || !email || !country) {
      return Response.json({ message: "Please fill all fields" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(userId);
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    // Update text fields
    user.name = name;
    user.email = email;
    user.country = country;

    // If new image is uploaded
    if (file && file.name) {
      if (user.imagePublicId) {
        await cloudinary.uploader.destroy(user.imagePublicId);
      }
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const b64 = buffer.toString("base64");
      const dataURI = `data:${file.type};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "user_profiles",
        resource_type: "auto",
      });

      user.imageUrl = result.secure_url;
      user.imagePublicId = result.public_id;
    }

    await user.save();

    return Response.json(
      { message: "Profile updated successfully", user },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}
