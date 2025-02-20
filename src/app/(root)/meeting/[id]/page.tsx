//this page will have two states i.e set up meeting and actual meeting
"use client"

import LoaderUI from "@/components/LoaderUI";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import useGetCallById from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation"
import { useState } from "react";

function MeetingPage() {
   const {id}=useParams();
   const {isLoaded}=useUser()
   const [isSetUpComplete,setIsSetUpComplete]=useState(false);
   const {call,isCallLoading}=useGetCallById(id)

  if(!isLoaded || isCallLoading){
    return <LoaderUI/>
  }
  if(!call){
    return (
      <div>
        <p>Meeting not found..</p>
      </div>
    )
  }
  return (
    <StreamCall call={call}>
      <StreamTheme>
        {
          !isSetUpComplete?(
            <MeetingSetup onSetUpComplete={()=>setIsSetUpComplete(true)}/>
          )
          :(
            <MeetingRoom/>
          )
        }
      </StreamTheme>
    </StreamCall>
  )
}

export default MeetingPage
