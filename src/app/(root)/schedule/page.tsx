"use client"

import InteriewSchedulerUI from "@/app/(root)/schedule/InteriewSchedulerUI";
import LoaderUI from "@/components/LoaderUI";
import { useUserRole } from "@/hooks/useUserRole"
import { useRouter } from "next/navigation"

function SchedulePage() {
  const router=useRouter()

  const {isInterviewer,isLoading}=useUserRole();

  if(isLoading) return <LoaderUI/>
  if(!isInterviewer) return router.push("/")

  return (
    <InteriewSchedulerUI/>
  )
}

export default SchedulePage
