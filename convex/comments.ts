import { mutation,query } from "./_generated/server";
import { v } from "convex/values";

//add a new comment 
export const addComment=mutation({
    args:{
        interviewId:v.id("interviews"),
        content:v.string(),
        rating:v.number(),
    },
    handler:async(ctx,args)=>{
        const identity=await ctx.auth.getUserIdentity();
        if(!identity){
            throw new Error("You must be logged in to add a comment");
        }
        const newcomment=await ctx.db.insert("comments",{
            interviewId:args.interviewId,
            content:args.content,
            rating:args.rating,
            interviewerId:identity.subject,
        });
        return newcomment;
    },
});

//get all comments for a specific interview
export const getComments=query({
    args:{interviewId:v.id("interviews")},
    handler:async(ctx,args)=>{
        const allcomments=await ctx.db.query("comments")
                          .withIndex("by_interview_id",(q)=>q.eq("interviewId",args.interviewId))
                          .collect();
        return allcomments;
    }
})



