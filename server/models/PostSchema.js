import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    like:{
        type:Array,
        default:[]
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    userDetails:{
        type:Array,
        default:[]
    },
    image: {
        type: String, // URL or path to the uploaded image
        default: ""
    }
},{timestamps:true});
export const Post = mongoose.model("Post", tweetSchema);