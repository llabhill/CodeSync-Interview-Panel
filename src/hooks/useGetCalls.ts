import { useUser } from "@clerk/nextjs";
import { Call,useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect,useState } from "react";


const useGetCalls=()=>{
    const {user}=useUser();
    const [calls, setCalls] = useState<Call[]>();
    const client=useStreamVideoClient();
    const [isLoading,setIsLoading]=useState(false);

    useEffect(()=>{
        const loadCalls=async()=>{
            if(!client || !user?.id){
                return ;
            }
            setIsLoading(true);

            try {
                //follow documentation for below code
                const {calls}=await client.queryCalls({
                    filter_conditions:{
                        starts_at:{$exists:true},
                        $or:[{created_by_user_id:user.id},{members:{$in:[user.id]}}],
                    },
                })

                setCalls(calls);
                
            }
            catch (error) {
                console.log(error)
            }
            finally{
                setIsLoading(false);

            }
        };
        loadCalls();
    },[client,user?.id])

    const now=new Date();
    //now we want to get ongoing calls ,ended calls

    //ended call condition --new Date(startsAt)<now

    const endedCalls=calls?.filter(({state:{startsAt,endedAt}}:Call)=>{
        return (startsAt && new Date(startsAt)<now)|| !endedAt;
    });


    //future call condition--new Date(startsAt)>now 

    const upcomingCalls=calls?.filter(({state:{startsAt}}:Call)=>{
        return startsAt && new Date(startsAt)>now;
    })

    //liveCalls

    const liveCalls=calls?.filter(({state:{startsAt,endedAt}}:Call)=>{
        return startsAt && new Date(startsAt)<now && !endedAt;
    });

    return {calls,endedCalls,upcomingCalls,liveCalls,isLoading};




}
export default useGetCalls;