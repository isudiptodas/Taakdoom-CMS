'use client'

import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { FiCalendar, FiCheck, FiX } from "react-icons/fi"
import Loader from "@/components/Loader"
import { members } from "@/data/members"
import { clients } from "@/data/clients"

export interface DeliveryJobFormData {
  jobName: string;
  uuid: string;
  clientName: string;
  AssignTo: string[];
  startTime: string;
  endTime: string;
  plannedDeliveryDate: string;
  actualDeliveryDate: string;
  delay: string;
  status: string;
  phoneNumber: string[];
  remarks: string;
  billingRaised: boolean;
  paymentReceived: boolean;
}

export interface DeliveryJob extends DeliveryJobFormData {
  _id: string;
}

interface DeliveryJobsProps {
  setVisible: (visible: boolean) => void;
  selectedJob?: DeliveryJob;
  onCreated?: () => void;
  onUpdated?: () => void;
}

const statusOptions = [
  { name: "----", value: "", color: "bg-gray-300" },
  { name: "started", value: "started", color: "bg-yellow-400" },
  { name: "not completed", value: "not completed", color: "bg-red-500" },
  { name: "waiting for feedback", value: "waiting for feedback", color: "bg-blue-500" },
  { name: "hold", value: "hold", color: "bg-purple-500" },
  { name: "work in progress", value: "work in progress", color: "bg-yellow-400" },
  { name: "completed", value: "completed", color: "bg-green-500" },
  { name: "not started", value: "not started", color: "bg-amber-800" },
]

const initialForm: DeliveryJobFormData = {
  jobName: "", uuid: "", clientName: "", AssignTo: [], startTime: "", endTime: "", plannedDeliveryDate: "",
  actualDeliveryDate: "", delay: "", status: "", phoneNumber: [], remarks: "",
  billingRaised: false, paymentReceived: false,
}

function DeliveryJobs({ setVisible, selectedJob, onCreated, onUpdated }: DeliveryJobsProps) {
  const [form, setForm] = useState<DeliveryJobFormData>(selectedJob ? { ...selectedJob, AssignTo: Array.isArray(selectedJob.AssignTo) ? selectedJob.AssignTo : [selectedJob.AssignTo] } : initialForm)
  const [assignee, setAssignee] = useState("")
  const [phoneNumbers, setPhoneNumbers] = useState(Array.isArray(selectedJob?.phoneNumber) ? selectedJob.phoneNumber.join(", ") : selectedJob?.phoneNumber || "")
  const [memberVisible, setMemberVisible] = useState(false)
  const [clientOptions, setClientOptions] = useState<string[]>(clients)
  const [clientVisible, setClientVisible] = useState(false)
  const [newClientVisible, setNewClientVisible] = useState(false)
  const [newClient, setNewClient] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const savedClients = localStorage.getItem("deliveryClients")
    if (savedClients) {
      const savedClientTimer = window.setTimeout(() => {
        setClientOptions([...clients, ...JSON.parse(savedClients).filter((client: string) => !clients.includes(client))])
      }, 0)

      return () => window.clearTimeout(savedClientTimer)
    }
  }, [])

  const updateField = (field: keyof DeliveryJobFormData, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const addAssignee = () => {
    if (!assignee.trim() || form.AssignTo.includes(assignee.trim())) return;

    setForm((current) => ({ ...current, AssignTo: [...current.AssignTo, assignee.trim()] }))
    setAssignee("")
  }

  const selectMember = (name: string) => {
    if (form.AssignTo.includes(name)) return;

    setForm((current) => ({ ...current, AssignTo: [...current.AssignTo, name] }))
    setMemberVisible(false)
  }

  const handleAssigneeKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      addAssignee()
    }
  }

  const removeAssignee = (name: string) => {
    setForm((current) => ({ ...current, AssignTo: current.AssignTo.filter((person) => person !== name) }))
  }

  const selectClient = (name: string) => {
    updateField("clientName", name)
    setClientVisible(false)
  }

  const addClient = () => {
    const clientName = newClient.trim()
    if (!clientName || clientOptions.includes(clientName)) return

    const updatedClients = [...clientOptions, clientName]
    setClientOptions(updatedClients)
    localStorage.setItem("deliveryClients", JSON.stringify(updatedClients.filter((client) => !clients.includes(client))))
    updateField("clientName", clientName)
    setNewClient("")
    setNewClientVisible(false)
    setClientVisible(false)
  }

  const createJob = async () => {
    if (loading) return;

    const phoneNumberList = phoneNumbers.split(",").map((phone) => phone.trim()).filter(Boolean)

    if (!form.jobName.trim() || !form.clientName.trim() || form.AssignTo.length === 0 || !form.startTime || !form.endTime || phoneNumberList.length === 0) {
      toast.error("Please complete all required fields")
      return
    }

    setLoading(true)

    try {
      const jobData = { ...form, phoneNumber: phoneNumberList }
      const res = selectedJob
        ? await axios.put(`/api/jobs?type=update&id=${selectedJob._id}`, jobData, { withCredentials: true })
        : await axios.post("/api/jobs?type=create", jobData, { withCredentials: true })

      if (res.status === 200 || res.status === 201) {
        toast.success(selectedJob ? "Delivery job updated" : "Delivery job created")
        if (selectedJob) {
          onUpdated?.()
        } else {
          onCreated?.()
        }
        setVisible(false)
        setForm(initialForm)
        setPhoneNumbers("")
      }
    } catch (error: unknown) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : "Something went wrong"
      toast.error(message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition duration-200 focus:border-[#de0046] focus:ring-2 focus:ring-[#de0046]/15"
  const dateInputClass = `${inputClass} [color-scheme:light] [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70`
  const selectedStatus = statusOptions.find((status) => status.value === form.status)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-[2px]">
      <div className="w-full max-w-3xl animate-[jobFormIn_220ms_ease-out] overflow-y-auto bg-white shadow-2xl max-h-[92vh]">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 md:px-7">
          <div><p className="text-xl font-bold text-gray-900">{selectedJob ? "Edit delivery job" : "Assign new job"}</p><p className="mt-1 text-sm text-gray-500">{selectedJob ? "Update the delivery details below." : "Add the delivery details below."}</p></div>
          <div aria-label="Close form" onClick={() => setVisible(false)} className="cursor-pointer p-2 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-black"><FiX /></div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 md:p-7">
          <label className="text-sm font-semibold text-gray-700">Job name<input required value={form.jobName} onChange={(event) => updateField("jobName", event.target.value)} className={inputClass} placeholder="Website delivery" /></label>
          <label className="text-sm font-semibold text-gray-700">Job ID / UUID<input readOnly value={selectedJob ? form.uuid : "Generated automatically"} className={`${inputClass} cursor-not-allowed bg-gray-100 text-gray-500`} /></label>
          <div className="relative text-sm font-semibold text-gray-700">Client name<div onClick={() => setClientVisible(!clientVisible)} className={`${inputClass} mt-1 cursor-pointer`}>{form.clientName || "Select client"}</div>{clientVisible && <div className="absolute left-0 top-full z-20 mt-1 w-full border border-gray-200 bg-white py-1 shadow-lg">{clientOptions.map((client) => <div key={client} onClick={() => selectClient(client)} className="cursor-pointer px-3 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100">{client}</div>)}<div onClick={() => { setNewClientVisible(true); setClientVisible(false) }} className="border-t border-gray-200 px-3 py-2 text-sm font-semibold text-[#de0046] cursor-pointer hover:bg-gray-100">+ Add new client</div></div>}{newClientVisible && <div className="mt-2 flex gap-2"><input value={newClient} onChange={(event) => setNewClient(event.target.value)} className={inputClass} placeholder="New client name" /><div onClick={addClient} className="flex cursor-pointer items-center bg-black px-3 text-white">Add</div></div>}</div>
          <div className="text-sm font-semibold text-gray-700">Assign to<div className="relative mt-1 flex gap-2"><input value={assignee} onFocus={() => setMemberVisible(true)} onChange={(event) => { setAssignee(event.target.value); setMemberVisible(true) }} onKeyDown={handleAssigneeKeyDown} className={inputClass} placeholder="Select team member" /><div onClick={addAssignee} className="flex cursor-pointer items-center bg-black px-4 text-white transition hover:bg-[#de0046]">Add</div>{memberVisible && <div className="absolute left-0 top-full z-10 mt-1 w-[calc(100%-60px)] border border-gray-200 bg-white py-1 shadow-lg">{members.filter((member) => !form.AssignTo.includes(member) && member.toLowerCase().includes(assignee.toLowerCase())).map((member) => <div key={member} onClick={() => selectMember(member)} className="cursor-pointer px-3 py-2 text-sm font-normal text-gray-700 hover:bg-gray-100">{member}</div>)}</div>}</div><div className="mt-2 flex flex-wrap gap-2">{form.AssignTo.map((person) => <div key={person} className="flex items-center gap-2 bg-gray-100 px-2.5 py-1.5 text-xs font-normal text-gray-700"><span>{person}</span><FiX onClick={() => removeAssignee(person)} className="cursor-pointer text-sm hover:text-red-600" /></div>)}</div></div>
          <label className="text-sm font-semibold text-gray-700">Phone number<input required type="tel" value={phoneNumbers} onChange={(event) => setPhoneNumbers(event.target.value)} className={inputClass} placeholder="Phone numbers separated by comma" /></label>
          <label className="text-sm font-semibold text-gray-700">Delay<input value={form.delay} onChange={(event) => updateField("delay", event.target.value)} className={inputClass} placeholder="Optional delay note" /></label>
          <label className="text-sm font-semibold text-gray-700">Start date & time<div className="relative mt-1"><FiCalendar className="pointer-events-none absolute right-3 top-3 text-gray-500" /><input required type="datetime-local" value={form.startTime} onChange={(event) => updateField("startTime", event.target.value)} className={`${dateInputClass} pr-10`} /></div></label>
          <label className="text-sm font-semibold text-gray-700">End date & time<div className="relative mt-1"><FiCalendar className="pointer-events-none absolute right-3 top-3 text-gray-500" /><input required type="datetime-local" value={form.endTime} onChange={(event) => updateField("endTime", event.target.value)} className={`${dateInputClass} pr-10`} /></div></label>
          <label className="text-sm font-semibold text-gray-700">Planned delivery date<div className="relative mt-1"><FiCalendar className="pointer-events-none absolute right-3 top-3 text-gray-500" /><input type="date" value={form.plannedDeliveryDate} onChange={(event) => updateField("plannedDeliveryDate", event.target.value)} className={`${dateInputClass} pr-10`} /></div></label>
          <label className="text-sm font-semibold text-gray-700">Actual delivery date<div className="relative mt-1"><FiCalendar className="pointer-events-none absolute right-3 top-3 text-gray-500" /><input type="date" value={form.actualDeliveryDate} onChange={(event) => updateField("actualDeliveryDate", event.target.value)} className={`${dateInputClass} pr-10`} /></div></label>
          <label className="text-sm font-semibold text-gray-700">Status<select value={form.status} onChange={(event) => updateField("status", event.target.value)} className={`${inputClass} mt-1 capitalize`}>{statusOptions.map((status) => <option key={status.name} value={status.value}>{status.name}</option>)}</select><span className={`mt-2 inline-flex items-center gap-2 px-2.5 py-1 text-xs font-semibold capitalize ${selectedStatus?.color || "bg-gray-300"} bg-opacity-50`}><span className={`h-2 w-2 rounded-full ${selectedStatus?.color || "bg-gray-300"}`} />{selectedStatus?.name || "----"}</span></label>
          <label className="text-sm font-semibold text-gray-700 md:col-span-2">Remarks<textarea value={form.remarks} onChange={(event) => updateField("remarks", event.target.value)} className={`${inputClass} min-h-24 resize-y`} placeholder="Additional notes" /></label>
          <div className="flex flex-wrap gap-5 text-sm font-semibold text-gray-700 md:col-span-2"><label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={form.billingRaised} onChange={(event) => updateField("billingRaised", event.target.checked)} className="h-4 w-4 accent-[#de0046]" />Billing raised</label><label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={form.paymentReceived} onChange={(event) => updateField("paymentReceived", event.target.checked)} className="h-4 w-4 accent-[#de0046]" />Payment received</label></div>
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 md:col-span-2"><div onClick={() => setVisible(false)} className="cursor-pointer border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100">Cancel</div><div onClick={createJob} className="flex cursor-pointer items-center gap-2 bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#de0046]">{loading ? (<>Saving... <Loader /></>) : (<>{selectedJob ? "Update job" : "Create job"} <FiCheck /></>)}</div></div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryJobs
