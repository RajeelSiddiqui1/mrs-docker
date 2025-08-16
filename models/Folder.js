import mongoose,{Schema,model,models} from "mongoose";

const folderSchema = Schema(
    {
        name:{
            type:String,
            required:true
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

const Folder = models.Folders || model("Folders", folderSchema)

export default Folder