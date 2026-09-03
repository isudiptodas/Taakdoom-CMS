'use client'

import Navbar from "@/components/AdminNavbar"
import AdminSidebar from "@/components/AdminSidebar"
import axios from "axios"
import { useEffect, useState } from "react"
import { GrTask } from "react-icons/gr";
import DeliveryJobs from "@/components/DeliveryJobs"

interface data {
  _id: string;
  name: string;
  role: string;
  email: string
}

interface jobType {
  id: string;
  jobName: string;
  uuid: string;
  clientName: string;
  AssignTo: string;
  startTime: string;
  endTime: string;
  actualDeliveryDate: string;
  delay: string;
  status: string;
  phoneNumber: string;
  remarks: string;
  billingRaised: boolean;
  paymentReceived: boolean
}

function Page() {

  const [data, setData] = useState<data>();
  const [allJobs, setAllJobs] = useState<jobType[]>([]);
  const [jobVisible, setJobVisible] = useState(false);

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

            {jobVisible && <DeliveryJobs setVisible={setJobVisible} onCreated={getJobs} />}

            <div className={`w-[90%] flex flex-col justify-start items-center h-auto`}>
              {allJobs.length === 0 ? (
                <p className="py-10 text-sm text-gray-500">No delivery jobs yet.</p>
              ) : (
                <div className="w-full overflow-x-auto border border-gray-200">
                  <table className="w-full min-w-[760px] text-left">
                    <thead className="bg-gray-100"><tr><th className="px-4 py-3 text-sm">Job</th><th className="px-4 py-3 text-sm">Client</th><th className="px-4 py-3 text-sm">Assigned to</th><th className="px-4 py-3 text-sm">Dates</th><th className="px-4 py-3 text-sm">Status</th></tr></thead>
                    <tbody>{allJobs.map((job) => <tr key={job.id || job.uuid} className="border-t border-gray-200 text-sm"><td className="px-4 py-3 font-semibold">{job.jobName}</td><td className="px-4 py-3">{job.clientName}</td><td className="px-4 py-3">{job.AssignTo}</td><td className="px-4 py-3">{job.startTime} - {job.endTime}</td><td className="px-4 py-3 capitalize">{job.status}</td></tr>)}</tbody>
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
