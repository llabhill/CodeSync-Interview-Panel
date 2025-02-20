import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"


function useGetCallById(id:string | string[]) {
    const [call,setCall]=useState<Call>();
    const [isCallLoading,setIsCallLoading]=useState(true);
    const client=useStreamVideoClient();

    useEffect(() => {
        if(!client) return 
        const getCall=async()=>{
            try {
                //this give current call
                const {calls}=await client.queryCalls({filter_conditions:{id}})//stream documentatiopn se dekho
                
                if(calls.length>0){
                    setCall(calls[0])
                }


            } 
            catch (error) {
                console.log("Error while fetching call-->",error)
                setCall(undefined)
            } 
            finally{
                setIsCallLoading(false)
            }
        };
        getCall();

    },[client,id])


  return {call,isCallLoading};
}

export default useGetCallById
