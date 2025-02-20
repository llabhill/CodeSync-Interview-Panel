import { mutation,query } from "./_generated/server";
import { v } from "convex/values";

//get all interviews

export const getAllInterviews=query({
    handler:async(ctx)=>{
        const identity=await ctx.auth.getUserIdentity()
        if(!identity){
            throw new Error("Unauthorized user,logged  in first")
        }
        const allinterviews=await ctx.db.query("interviews").collect();
        return allinterviews;
    }
});

//get only speciifc interview
//currently authenticated user interviews(logged in user)
export const getMyInterviews=query({
    handler:async(ctx)=>{
        const identity=await ctx.auth.getUserIdentity()
        
        if(!identity){
            return [];
        }
        const myinterviews=await ctx.db.query("interviews")
                           .withIndex("by_candidate_id",(q)=>q.eq("candidateId",identity.subject))
                           .collect();

        return myinterviews!; 
    }
})

//get interview with streamcall id
export const getInterviewByStreamCallId=query({
    args:{ streamCallId:v.string()},
    handler:async(ctx,args)=>{
        const interview=await ctx.db.query("interviews")
                              .withIndex("by_stream_call_id",(q)=>q.eq("streamCallId",args.streamCallId)).first()

        return interview;
    }
});


//create a interview
export const createInterview=mutation({
    args:{ 
        title:v.string(),
        description:v.optional(v.string()),
        startTime:v.number(),//we know it 
        status:v.string(),//failed or succeeded
        streamCallId:v.string(),//for uniquely identifying the interview panel
        candidateId:v.string(),//which candiodate are in intyerview
        interviewerIds:v.array(v.string())
    },
    handler:async(ctx,args)=>{
        const identity=await ctx.auth.getUserIdentity()
        if(!identity){
            throw new Error("Unauthorized user,logged in first")
        }
        return await ctx.db.insert("interviews",{
            ...args,
        });
    },
})

//updated interview status whether it is commpleted failed succeeded ??

export const updateInterviewStatus=mutation({
    args:{
        id:v.id("interviews"),
        status:v.string(),
    },
    handler:async(ctx,args)=>{
        return await ctx.db.patch(args.id,{
            status:args.status,
            ...(args.status==="completed"?{endTime:Date.now()}:{}),
        })
    }
})