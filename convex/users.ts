import { v } from "convex/values";
import { mutation,query } from "./_generated/server";
//mutation function is for creating user into db
export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const existinguser=await ctx.db.query("users")
    .filter((q)=>q.eq(q.field("clerkId"),args.clerkId)).first();

    if(existinguser) return;

    return await ctx.db.insert("users",{
        ...args,
        role:"candidate"
    })
  },
});

export const getUsers=query({
    handler: async(ctx)=>{
        const identity=await ctx.auth.getUserIdentity();

        if(!identity) throw new Error("Unauthorized user");

        const users=await ctx.db.query("users").collect()
        return users;
    }
});

export const getUserByclerkId=query({
    args:{clerkId:v.string()},
    handler: async(ctx,args)=>{
        const user=await ctx.db.query("users")
                   .withIndex("by_clerk_id",(q)=>q.eq("clerkId",args.clerkId))
                   .first();
        console.log("user in getuser by clerk id --->",user)
        
        if(!user){
            throw new Error(`user with clerkId ${args.clerkId} not found`);
        }
        return user;
    }
})


