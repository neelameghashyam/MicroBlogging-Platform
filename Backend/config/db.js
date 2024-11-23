import mongoose from "mongoose";

const configDb= async()=>{
    const url ='mongodb://localhost:27017/Micr-Blog-App'
    try{
        const db= await mongoose.connect(url)
        console.log("Connected to db:",db.mongoose.connections[0].name)

    }catch(err){
        console.log(err)
    }
}

export default configDb