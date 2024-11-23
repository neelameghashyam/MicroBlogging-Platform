import{ model, Schema } from "mongoose";

const userSchema= new Schema({
    email:String,
    password:String,
    role:{type:String,
        default:"user"
    },
    resettoken:String,
    resetTokenExpiration: Date
},{timestamps:true})

const User=model("User",userSchema)

export default User

