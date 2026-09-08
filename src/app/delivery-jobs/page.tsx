'use client'

import Navbar from "@/components/AdminNavbar"
import AdminSidebar from "@/components/AdminSidebar"
import axios from "axios"
import { useEffect, useState } from "react"
import { GrTask } from "react-icons/gr";
import DeliveryJobs, { DeliveryJob } from "@/components/DeliveryJobs"

interface data {
  _id: string;
  name: string;
  role: string;
  email: string
}

interface jobType {
  _id: string;
  id?: string;
  jobName: string;
  uuid: string;
  clientName: string;
  AssignTo: string[] | string;
  startTime: string;
  endTime: string;
  actualDeliveryDate: string;
  delay: string;
  status: string;
  phoneNumber: string[] | string;
  remarks: string;
  billingRaised: boolean;
  paymentReceived: boolean
}

const statusDotColors: { [key: string]: string } = {
  pending: "bg-yellow-400",
  started: "bg-yellow-400",
  "not completed": "bg-red-500",
  "waiting for feedback": "bg-blue-500",
  hold: "bg-purple-500",
  "work in progress": "bg-yellow-400",
  completed: "bg-green-500",
  "not started": "bg-amber-800",
  "": "bg-gray-300",
}

const statusDotTextColors: { [key: string]: string } = {
  pending: "text-yellow-400",
  hold: "text-purple-500",
}

const formatDate = (date: string) => {
  if (!date) return ""

  const [year, month, day] = date.split("-")
  return `${day}-${month}-${year}`
}

const getDelay = (job: jobType) => {
  if (!job.endTime) return ""

  const endDate = new Date(`${job.endTime}T00:00:00`)
  const lastDate = job.status === "completed" && job.actualDeliveryDate
    ? new Date(`${job.actualDeliveryDate}T00:00:00`)
    : new Date()

  if (lastDate <= endDate) return ""

  const totalHours = Math.floor((lastDate.getTime() - endDate.getTime()) / (1000 * 60 * 60))
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24

  if (days === 0) return `${totalHours} hours`
  if (hours === 0) return `${days} days`
  return `${days} days ${hours} hours`
}

function Page() {

  const [data, setData] = useState<data>();
  const [allJobs, setAllJobs] = useState<jobType[]>([]);
  const [jobVisible, setJobVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState<DeliveryJob>();

  const getJobs = async () => {
    try {
      const res = await axios.get(`/api/jobs?type=fetch`, {
        withCredentials: true
      });

      setAllJobs(res.data.found);
    } catch (error: unknown) {
      console.log("ERROR", error);
    }
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/auth?type=verify`, {
          withCredentials: true
        });

        //console.log(res.data);
        setData(res.data.found);
      } catch (error: unknown) {
        console.log("ERROR", error);
      }
    }

    const getJobs = async () => {
      try {
        const res = await axios.get(`/api/jobs?type=fetch`, {
          withCredentials: true
        });

        setAllJobs(res.data.found);
      } catch (error: unknown) {
        console.log("ERROR", error);
      }
    }

    getUser();
    getJobs();
  }, []);

  return (
    <>
      <div className={`w-full min-h-screen overflow-hidden relative`}>
        <Navbar />

        <div className={`w-full flex justify-between items-center relative overflow-hidden`}>
          <AdminSidebar name={data?.name.split(" ")[0] as string} />

          <div className={`w-full lg:w-[80%] h-screen overflow-y-scroll flex flex-col justify-start items-center`}>
            <p className={`w-[90%] pb-5 border-b-2 border-black pt-10 font-bold text-4xl`}>Delivery Jobs</p>

            <div className={`w-[90%] py-5 flex justify-start items-center gap-2`}>
              <button type="button" onClick={() => setJobVisible(true)} className={`w-auto active:opacity-80 duration-150 ease-in-out cursor-pointer flex justify-center items-center gap-4 bg-linear-to-br from-black to-[#de0046] py-2 px-5 text-white font-semibold`}>Assign new job <GrTask className={`text-lg`} /></button>
            </div>

            {jobVisible && <DeliveryJobs setVisible={(visible) => { setJobVisible(visible); if (!visible) setSelectedJob(undefined); }} selectedJob={selectedJob} onCreated={getJobs} onUpdated={getJobs} />}

            <div className={`w-[90%] flex flex-col justify-start items-center h-auto`}>
              {allJobs.length === 0 ? (
                <p className="py-10 text-sm text-gray-500">No delivery jobs yet.</p>
              ) : (
                <div className="w-full overflow-x-auto border border-gray-200">
                  <table className="w-full min-w-[1800px] text-left">
                    <thead className="bg-gray-100"><tr><th className="px-8 py-3 text-sm">Job ID</th><th className="px-4 py-3 text-sm">Job Name</th><th className="px-4 py-3 text-sm">Client Name</th><th className="px-4 py-3 text-sm">Assigned To</th><th className="px-4 py-3 text-sm">Phone Number</th><th className="px-4 py-3 text-sm">Start Date</th><th className="px-4 py-3 text-sm">End Date</th><th className="px-4 py-3 text-sm">Actual Delivery Date</th><th className="px-4 py-3 text-sm">Delay</th><th className="px-4 py-3 text-sm">Status</th><th className="px-4 py-3 text-sm">Remarks</th><th className="px-4 py-3 text-sm">Billing Raised</th><th className="px-4 py-3 text-sm">Payment Received</th><th className="px-4 py-3 text-sm">Action</th></tr></thead>
                    <tbody>{allJobs.map((job) => <tr key={job._id || job.uuid} className="border-t border-gray-200 text-sm"><td className="pl-7 py-3 font-semibold">{job.uuid}</td><td className="px-4 py-3">{job.jobName}</td><td className="px-4 py-3">{job.clientName}</td><td className="px-4 py-3">{Array.isArray(job.AssignTo) ? job.AssignTo.join(", ") : job.AssignTo}</td><td className="px-4 py-3">{Array.isArray(job.phoneNumber) ? job.phoneNumber.join(", ") : job.phoneNumber}</td><td className="px-4 py-3">{formatDate(job.startTime)}</td><td className="px-4 py-3">{formatDate(job.endTime)}</td><td className="px-4 py-3">{formatDate(job.actualDeliveryDate)}</td><td className={`px-4 py-3 ${getDelay(job) ? "font-semibold text-red-600" : ""}`}>{getDelay(job)}</td><td className="px-4 py-3"><div className="flex items-center gap-2 capitalize"><span className={`relative flex h-3.5 w-3.5 items-center justify-center ${statusDotTextColors[job.status] || "text-gray-300"}`}><span className={`absolute h-2 w-2 rounded-full ${statusDotColors[job.status] || "bg-gray-300"} ${(job.status === "pending" || job.status === "hold") ? "animate-[statusCenter_1.4s_ease-in-out_infinite]" : ""}`} />{(job.status === "pending" || job.status === "hold") && <span className="absolute h-2 w-2 rounded-full border border-current animate-[statusRipple_1.4s_ease-out_infinite]" />}</span>{job.status}</div></td><td className="px-4 py-3">{job.remarks}</td><td className="px-4 py-3">{job.billingRaised ? "Yes" : "No"}</td><td className="px-4 py-3">{job.paymentReceived ? "Yes" : "No"}</td><td className="px-4 py-3"><div onClick={() => { setSelectedJob({ ...job, _id: job._id, AssignTo: Array.isArray(job.AssignTo) ? job.AssignTo : [job.AssignTo], phoneNumber: Array.isArray(job.phoneNumber) ? job.phoneNumber : [job.phoneNumber] }); setJobVisible(true); }} className="cursor-pointer font-semibold text-[#de0046] hover:underline">Edit</div></td></tr>)}</tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
