
import { userModel } from "../models/userModel.js"
import { signupValidate, loginValidate } from "../vaildator/userValidator.js"
import { genarateToken } from "../utils/generateToken.js"
import bcrypt from "bcryptjs"
export const getHome = (req,res) => {
    res.send("Hompage!")
}


export const getAbout = (req,res) => { 
    console.log(req.url, req.method)
    res.send("Aboutpage!")
}

export const postUser = async (req,res) => {
    const {username,email,password} = req.body/*  */

    const {error} = signupValidate.validate({
        username,
        email,
        password

    })

    if(error){
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    // if(username === "" && email === "" && password === "") {
    //     res.status(400).json ({
    //         message: "Please provide all fields"
    //     })
    // }
    const existingUser = await userModel.findOne({email})
    if (existingUser){
        return res.status(400).json({
            message: `User with ${email} already exists, login instead or create a new account.`
        })
    }
    const newUser = await userModel.create({
        username,
        email,
        password
    })
    const token = await genarateToken(newUser._id)
    res.cookie(`token`,token, {
        httponly: true,
        secure: process.env.NODE_ENV ===
        'production',
        sameSite: 'Lax',
        maxage: 1000 * 60* 60 * 24* 7
    })
        res.status(201).json({
            message: "User created successfully",
            data: newUser
        })
    }
export const loginUser = async (req,res) => {
    try{
        const {email,password} = req.body

        const {error} = loginValidate.validate({
            email,
            password
        })

        if(error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }
        const existingUser = await userModel.findOne({email})
        if(!existingUser) {
            return res.status(401).json({
                message: `User with ${email} does not exist. Signup instead.`
            })
        }

        const isPasswordValid = await bcrypt.compare(password,existingUser.password)
        
        if(!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials. Try again."
            })
        }

        const refindUser = {
            username: existingUser.username,
            email: existingUser.email,
        }
        return res.status(200).json({
            message: "Login sucessful.",
            data: refindUser
        })
    } catch(error){
        console.error(error)
        throw new Error(error)
    }
}
export const singleUser = async(req, res) => {
    try{
        const {id} = req.params
        const user = await userModel.findById(id).select("-password")

        if (!user){
            return res.status(401).json({
                message: `User with id:${id} does not exit`
            })
        }
        return res.status(200).json({
            message: "user found",
            data: user
        })

    }catch(error){
        console.error(error)
        throw new Error(error)
    }
}
export const deleteUser = async(req, res ) => {
    try {
        const {id} = req.params
        const deleteUser = await userModel.findByIdAndDelete(id)
        
        if(!deleteUser) {
            return res.status(404).json({
                message: `user with id:${id} does not exist.`
            })
        }
        return res.status(200).json({
            message:" User deleted",
        })
    } catch (error) {
        console.error(error)
        throw new Error(error)
    }
}