'use client'

import Navbar from "@/components/AdminNavbar"
import AdminSidebar from "@/components/AdminSidebar"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface data {
  _id: string;
  name: string;
  role: string;
  email: string
}

interface jobType {
  _id: string;
  jobName: string;
  uuid: string;
  clientName: string;
  AssignTo: string[] | string;
  startTime: string;
  endTime: string;
  plannedDeliveryDate: string;
  actualDeliveryDate: string;
  status: string;
  remarks: string;
  latestUpdate?: string;
  billingRaised: boolean;
  paymentReceived: boolean;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}

interface clientSummary {
  clientName: string;
  jobs: jobType[];
  completedJobs: jobType[];
  activeJobs: jobType[];
  latestUpdate: string;
}

const formatDate = (date: string) => {
  if (!date) return "";
  const [year, month, day] = date.split("T")[0].split("-");
  return `${day}-${month}-${year}`;
}

const formatDateTime = (date: string) => date ? new Date(date).toLocaleString("en-GB") : "";

function Page() {

  const [data, setData] = useState<data>();
  const [allJobs, setAllJobs] = useState<jobType[]>([]);
  const [selectedClient, setSelectedClient] = useState<clientSummary>();
  const [detailSection, setDetailSection] = useState<"completed" | "active">("completed");
  const [latestUpdate, setLatestUpdate] = useState("");
  const [loading, setLoading] = useState(false);

  const getJobs = async () => {
    try {
      const res = await axios.get(`/api/jobs?type=fetch`, { withCredentials: true });
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

        setData(res.data.found);
      } catch (error: unknown) {
        console.log("ERROR", error);
      }
    }

    const jobsTimer = window.setTimeout(() => getJobs(), 0);

    getUser();
    return () => window.clearTimeout(jobsTimer);
  }, []);

  const clientSummaries: clientSummary[] = [];
  allJobs.forEach((job) => {
    let client = clientSummaries.find((item) => item.clientName === job.clientName);
    if (!client) {
      client = { clientName: job.clientName, jobs: [], completedJobs: [], activeJobs: [], latestUpdate: job.latestUpdate || "" };
      clientSummaries.push(client);
    }
    client.jobs.push(job);
    if (job.status === "completed") client.completedJobs.push(job);
    else client.activeJobs.push(job);
    if (job.latestUpdate) client.latestUpdate = job.latestUpdate;
  });

  const saveLatestUpdate = async () => {
    if (!selectedClient || loading) return;
    setLoading(true);
    try {
      const res = await axios.put(`/api/jobs?type=client-update&clientName=${encodeURIComponent(selectedClient.clientName)}`, { latestUpdate }, { withCredentials: true });
      if (res.status === 200) {
        toast.success("Latest update saved");
        await getJobs();
        setSelectedClient({ ...selectedClient, latestUpdate });
      }
    } catch (error: unknown) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : "Something went wrong";
      toast.error(message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const openClient = (client: clientSummary) => {
    setSelectedClient(client);
    setLatestUpdate(client.latestUpdate);
    setDetailSection("completed");
  }

  return (
    <>
      <div className={`w-full min-h-screen overflow-hidden relative`}>
        <Navbar />

        <div className={`w-full flex justify-between items-center relative overflow-hidden`}>
          <AdminSidebar name={data?.name.split(" ")[0] as string} />

          <div className={`w-full lg:w-[80%] h-screen overflow-y-scroll flex flex-col justify-start items-center`}>
            <p className={`w-[90%] pb-5 border-b-2 border-black pt-10 font-bold text-4xl`}>Clients</p>

            <div className="mt-6 w-[90%] overflow-x-auto border border-gray-200">
              <table className="w-full min-w-[1400px] text-left">
                <thead className="bg-gray-100"><tr><th className="px-4 py-3 text-sm">Client Name</th><th className="px-4 py-3 text-sm">Total Job</th><th className="px-4 py-3 text-sm">Completed</th><th className="px-4 py-3 text-sm">Active/Pending</th><th className="px-4 py-3 text-sm">Status</th><th className="px-4 py-3 text-sm">Billing Raised</th><th className="px-4 py-3 text-sm">Payment Received</th><th className="px-4 py-3 text-sm">Last Completion</th><th className="px-4 py-3 text-sm">Latest Update</th></tr></thead>
                <tbody>{clientSummaries.map((client) => { const lastCompleted = [...client.completedJobs].sort((first, second) => new Date(second.completedAt || second.createdAt).getTime() - new Date(first.completedAt || first.createdAt).getTime())[0]; const billingRaised = client.jobs.some((job) => job.billingRaised); const paymentReceived = client.jobs.some((job) => job.paymentReceived); return <tr key={client.clientName} onClick={() => openClient(client)} className="cursor-pointer border-t border-gray-200 text-sm hover:bg-gray-50"><td className="px-4 py-3 font-semibold">{client.clientName}</td><td className="px-4 py-3">{client.jobs.length}</td><td className="px-4 py-3">{client.completedJobs.length}</td><td className="px-4 py-3">{client.activeJobs.length}</td><td className="px-4 py-3">{client.activeJobs.length ? "WIP" : "completed"}</td><td className="px-4 py-3">{billingRaised ? "Yes" : "No"}</td><td className="px-4 py-3">{paymentReceived ? "Yes" : "No"}</td><td className="px-4 py-3">{lastCompleted ? `${formatDate(lastCompleted.actualDeliveryDate)} ${formatDateTime(lastCompleted.completedAt || lastCompleted.createdAt)}` : ""}</td><td className="px-4 py-3">{client.latestUpdate}</td></tr> })}</tbody>
              </table>
            </div>

            {selectedClient && <div className="mt-6 mb-10 w-[90%] bg-white p-6 shadow-lg"><div className="flex items-center justify-between"><p className="text-2xl font-bold">{selectedClient.clientName}</p><div onClick={() => setSelectedClient(undefined)} className="cursor-pointer text-sm font-semibold text-gray-500 hover:text-black">Close</div></div><div className="mt-5 flex gap-2 border-b border-gray-200 pb-3"><p onClick={() => setDetailSection("completed")} className={`cursor-pointer px-4 py-2 text-sm font-semibold ${detailSection === "completed" ? "bg-black text-white" : "bg-gray-100"}`}>Completed ({selectedClient.completedJobs.length})</p><p onClick={() => setDetailSection("active")} className={`cursor-pointer px-4 py-2 text-sm font-semibold ${detailSection === "active" ? "bg-black text-white" : "bg-gray-100"}`}>Active/Pending ({selectedClient.activeJobs.length})</p></div><div className="mt-5 grid gap-3 md:grid-cols-2">{detailSection === "completed" ? selectedClient.completedJobs.map((job) => <div key={job._id} className="border border-gray-200 p-4"><p className="font-semibold">{job.jobName}</p><p className="mt-2 text-sm">Completed by: {Array.isArray(job.AssignTo) ? job.AssignTo.join(", ") : job.AssignTo}</p><p className="text-sm">Started: {formatDateTime(job.startTime)}</p><p className="text-sm">Planned delivery: {formatDate(job.plannedDeliveryDate)}</p><p className="text-sm">Completed: {formatDate(job.actualDeliveryDate)} {formatDateTime(job.completedAt || job.createdAt)}</p><p className="text-sm">Status: {job.status}</p></div>) : selectedClient.activeJobs.map((job) => <div key={job._id} className="border border-gray-200 p-4"><p className="font-semibold">{job.jobName}</p><p className="mt-2 text-sm">Assigned to: {Array.isArray(job.AssignTo) ? job.AssignTo.join(", ") : job.AssignTo}</p><p className="text-sm">Start date & time: {formatDateTime(job.startTime)}</p><p className="text-sm">End date & time: {formatDateTime(job.endTime)}</p><p className="text-sm">Planned delivery: {formatDate(job.plannedDeliveryDate)}</p><p className="text-sm">Status: {job.status || "----"}</p></div>)}</div><div className="mt-6 border-t border-gray-200 pt-5"><p className="text-sm font-semibold">Latest update</p><div className="mt-2 flex gap-2"><input value={latestUpdate} onChange={(event) => setLatestUpdate(event.target.value)} className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-[#de0046]" placeholder="Add latest update" /><div onClick={saveLatestUpdate} className="flex cursor-pointer items-center bg-black px-5 py-2 text-sm font-semibold text-white">{loading ? "Saving..." : "Save"}</div></div></div></div>}
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
