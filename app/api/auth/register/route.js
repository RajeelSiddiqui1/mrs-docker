import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
    const {name,email,country,password} = await request.json();

    if(!name || !email || !country || !password){
       return Response.json({
        message:"Please fill all feilds"
       },{
        status:400
       })
    }

    try {
        await dbConnect();

       const existingUser = await User.findOne({ email });
        if (existingUser) {
            return Response.json(
                { message: "User with this email already exists" },
                { status: 409 } 
            );
        }
       await User.create({
                name,
                email,
                country,
                password
            })

           return Response.json(
            { message: "User created successfully" },
            { status: 201 }
        );

    } catch (error) {
        return Response.json(
            { message: `User creation error: ${error.message}` },
            { status: 500 }
        );
    }
}