import { useState, useContext } from 'react' 
import AuthContext from '../context/AuthContext'

export default function ResetPassword(){
const {handleResetPassword}=useContext(AuthContext)
const [password,setPassword]=useState("")
const [newPassword,setNewPassword]=useState("")
const [confirmPassword,setConfirmPassword]=useState("")

const handleSubmit=async(e)=>{
    e.preventDefault()
    try{
        if(newPassword===confirmPassword){
            const formData={
                password:password,
                newPassword:newPassword
            }
            handleResetPassword(formData)
        }
    }catch(err){
        console.log(err)
    }
}

return(
    <div>
        <form onSubmit={handleSubmit}>
            <input type='password' value={password} onChange={e=>(setPassword(e.target.value))} placeholder='enter current password' /><br/>
            <input type='password' value={newPassword} onChange={e=>(setNewPassword(e.target.value))} placeholder='enter new password'/><br/>
            <input type='password' value={confirmPassword} onChange={e=>(setConfirmPassword(e.target.value))} placeholder='enter new password again'/><br/>
            <input type='submit' value="RESET PASSWORD"/>
        </form>
    </div>
)
}