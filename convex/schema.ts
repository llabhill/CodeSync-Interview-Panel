import {defineSchema, defineTable} from  "convex/server"
import {v} from "convex/values"
export default defineSchema({
    //user ki table h
    users:defineTable({
        name:v.string(),
        email:v.string(),
        image:v.optional(v.string()),
        role:v.union(v.literal("candidate"),v.literal("interviewer")),//candidate,or interviewer
        clerkId:v.string(),//for finding user by clerkId from database
    }).index("by_clerk_id",["clerkId"]),//this syntax will be used to find the user

    interviews:defineTable({
        title:v.string(),
        description:v.optional(v.string()),
        startTime:v.number(),//we know it 
        endTime:v.optional(v.number()),//we dont know the end time it will vary 
        status:v.string(),//failed or succeeded
        streamCallId:v.string(),//for uniquely identifying the interview panel
        candidateId:v.string(),//which candiodate are in intyerview
        interviewerIds:v.array(v.string()),//there may be multiple interviewers present in a single panel
    }).index("by_candidate_id",["candidateId"])
      .index("by_stream_call_id",["streamCallId"]),

    comments:defineTable({
        content:v.string(),
        rating:v.number(),//1-5
        //comment will be made by the interviewer
        interviewerId:v.string(),
        interviewId:v.id("interviews"),
    }).index("by_interview_id",["interviewId"])

})