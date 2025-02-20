
import { useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"


function useMeetingActions() {
    const router=useRouter();
    const client =useStreamVideoClient();

    const createInstantMeeting=async()=>{
        if(!client) return;
        try {
            //generate random user id
            const id=crypto.randomUUID();
            //create a call (call type ,call id)
            const call=client.call("default",id);
            await call.getOrCreate({
                data:{
                    starts_at:new Date().toISOString(),
                    custom:{
                        description:"Instant Meeting"
                    },
                }
            });
            router.push(`/meeting/${call.id}`)
            toast.success("Meeting created")

        } 
        catch (error) {
            toast.error("Failed to create Meeting")
        }

    };

    
    const joinMeeting=async(callId:string)=>{
        if(!client) return toast.error("Failed to join meeting.Please try again..")
        router.push(`/meeting/${callId}`);
    };
    return {createInstantMeeting,joinMeeting};
}

export default useMeetingActions
