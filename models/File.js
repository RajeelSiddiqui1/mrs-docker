import mongoose,{Schema,model,models} from "mongoose";

const fileSchema = Schema(
    {
        name:{
            required:true,
            type:String,
        },
        fileUrl:{
            required:true,
            type:String
        },
        publicId:{
            type:String,
            required:true
        },
        folderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Folder"
        },
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    },
    {
        timestamps:true
    }
)

const File = models.Files || model("Files", fileSchema)

export default File;