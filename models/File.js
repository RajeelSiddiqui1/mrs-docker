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
        folder:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Folder"
        }
    },
    {
        timestamps:true
    }
)

const File = models.Files || model("Files", fileSchema)

export default File