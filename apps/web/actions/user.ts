"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "db";


export async function onAuthenticateUser(){
    const user = await currentUser();           // returns user if they are logged in else returns null
    
    if (!user){
        console.log("signed in nhi hoo bsdk")
        
        return Response.json({
            message: "unauthorized user"
        }, {status: 403})
    }
    try {
        
        const userExistsInDB = await prisma.user.findUnique({
            where:{
                clerkId: user.id
            }
        })
        
        if(userExistsInDB){
            console.log("user milgaya utsav ki taiyaari karo")
            
            return Response.json({
                message: "user exists in db"
            }, {status: 200})
        }
        
        
        const newUserInDB = await prisma.user.create({
            data:{
                username: user.firstName!,
                clerkId: user.id,
                email: user.emailAddresses[0]?.emailAddress!,
                profilePicture: user.imageUrl
                
            }
        })  
        console.log("user created successfully", newUserInDB)
        return Response.json({
            message: "user created successfully",
        }, {status: 201})
        
    } catch (error) {
        console.log("error something went wrong")
        return Response.json({
            message: "error while performing db operation "
        },{status: 200})
    }
}