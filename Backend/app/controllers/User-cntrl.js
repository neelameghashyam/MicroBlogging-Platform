import User from "../models/user-model.js"
import { validationResult } from 'express-validator'
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'

const userCtrl={}

userCtrl.register= async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    const {email,password} = req.body
    try{
        const useresCounter= await User.countDocuments()
        const user=new User({email,password})
        const salt= await bcryptjs.genSalt()
        const hash=await bcryptjs.hash(user.password,salt)
        user.password=hash
        if(useresCounter===0){
            user.role="admin"
        }
        await user.save()
        res.status(201).json(user)
    }catch(err){
        console.log(err)
        res.status(500).json({error:"somthing went worng"})
    }

}

userCtrl.login= async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    const {email,password}=req.body
    try{
        const user= await User.findOne({email:email})
        if(!user){
            return res.status(404).json({ error: 'invalid email / password '})
        }
        const valid= await bcryptjs.compare(password,user.password)
        if(!valid){
            return res.status(404).json({ error: 'invalid email / password '})
        }
        const tokenData={userID:user._id,role:user.role}
        const token=jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:"3d"})
        return res.json({token})
    }catch(err){
        console.log(err) 
        res.status(500).json({ error: "something went wrong"})
    }
}

userCtrl.resetPassword= async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {password,newPassword } = req.body
    try{
        const user= await User.findById(req.userId)
        if(user){
            const valid= await bcryptjs.compare(password,user.password)
            if(valid){
                const salt=await bcryptjs.genSalt()
                const hash=await bcryptjs.hash(newPassword,salt)
                user.password=hash
                await user.save()
                res.status(200).json({message:"password reset sucessfully"})
            }
            else{
                res.status(400).json({ error: "Current password is incorrect." })
                }
             }
        else{
            res.status(400).json({ error: "something went wrong" })
             }
    }catch(err){
        console.log(err) 
        res.status(500).json({ error: "something went wrong"})
    }
}

userCtrl.account = async (req, res) => {
    try  {
        const user = await User.findById(req.userID) 
        res.json(user)
    } catch(err) {
        console.log(err) 
        res.status(500).json({ error: "something went wrong"})
    }
}

userCtrl.allUsers=async(req,res)=>{
    try{
      const allUsers= await User.find()
      res.status(200).json(allUsers)
    }catch(err){
        console.log(err)
        res.status(500).json({error:"somthing went worng"})
    }
}

userCtrl.destroy=async(req,res)=>{
    try{
        const { id } = req.params;

        if (id === req.userID) {
          return res.status(400).json({ error: "You can't delete your own account" });
        }
    
        const user = await User.findByIdAndDelete(id);
    
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    /*
    const profile = await Profile.findOneAndDelete({user:user_id})
    const posts=await Post.deleteMany({user:user:_id})
    const comments=await Post.updateMany({"comments.user":id},{$pull:{comments:{user:id}}})(same a for likes,followers also)
    */
    res.status(200).json(user)
    }catch(err){
        res.status(500).json({errors:"Something went wrong"})
    }
}

userCtrl.changeRole=async(req,res)=>{
try{
const id=req.params.id
const body = req.body
if(id==req.userID){
    return res.status(400).json({error:"you cant change your role"})
}
const user= await User.findByIdAndUpdate(id,body,{new:true})
res.json(user)
}catch(err){
    res.status(500).json({errors:"Something went wrong"})
}
}


export default userCtrl