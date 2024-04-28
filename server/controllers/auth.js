import passport from 'passport'

export const authenticateUser = async (req,res) => {
    passport.authenticate("google",{
        successRedirect: process.env.CLIENT_URL,
        failureRedirect: '/login/failed'
    })
}

export const authFailed = async (req,res) => {
    return res.status(401).json({success:false,message:"User Authentication Failed"})
}

export const authSuccess = async (req,res) => {
    if(req.user){
        res.status(200).json({
            success:true,
            message:"User Authenticated",
            user:req.user
        })
    }else{
        res.status(403).json({success:false,message:"User not authenticated"})
    }
    return res.status(200).json({message:"User Authentication Success"})
}

export const logoutUser = async(req,res) => {
    req.logout();
    res.redirect(process.env.CLIENT_URL);
}




// export const signupGoogle = async (req,res) => {
    
// }

// export const LoginGoogle = async (req,res) => {

// }



// export const signupController = async(req,res) => {
//     return res.status(200).json({message:"Signup Successfull"})
// }



// export const loginController = async(req,res) => {
//     return res.status(200).json({message:"Login Successfull"})
// }