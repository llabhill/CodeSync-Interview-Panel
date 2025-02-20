import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useEffect } from "react";

function EndCallButton() {
    const call = useCall(); // for getting calls
    const router = useRouter();
    const { useLocalParticipant } = useCallStateHooks();
    const localParticipant = useLocalParticipant();

    const updateInterviewStatus = useMutation(api.interviews.updateInterviewStatus);
    
    // Get current interview from db
    const interview = useQuery(api.interviews.getInterviewByStreamCallId, {
        streamCallId: call?.id || "",
    });

    if (!call || !interview) return null;

    // Check if the user is the meeting owner
    const isMeetingOwner = localParticipant?.userId === call.state.createdBy?.id;

    const endCall = async () => {
        try {
            await call?.endCall();

            await updateInterviewStatus({
                id: interview?._id,
                status: "completed",
            });

            router.push("/");
            toast.success("Meeting Ended for Everyone.");
        } catch (error) {
            console.log("Error while ending call--->", error);
            toast.error("Failed to end meeting");
        }
    };


    return <Button variant={"destructive"} onClick={()=>endCall()} >
        End Meeting
    </Button>

    if (!isMeetingOwner) return null;

    return (
        <Button variant="destructive" onClick={endCall}>
            End Meeting
        </Button>
    );
}

export default EndCallButton;
