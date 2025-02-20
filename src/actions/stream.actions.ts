//server actions

"use server"

import { currentUser } from "@clerk/nextjs/server"

import {StreamClient} from "@stream-io/node-sdk"

export const streamTokenProvider =async()=>{
    const user = await currentUser()
    if(!user) {
        throw new Error("User is not Authenticated")
    }
    const streamClient= new StreamClient(
        process.env.NEXT_PUBLIC_STREAM_API_KEY!, 
        process.env.STREAM_SECRET_KEY!
    )
    const token = await streamClient.generateUserToken({user_id:user.id}) //by default expires in 45 mins
    return token
}
