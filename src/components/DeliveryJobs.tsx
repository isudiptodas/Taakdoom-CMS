'use client'

import axios from "axios"
import { useState } from "react"
import { toast } from "sonner"
import { FiCalendar, FiCheck, FiX } from "react-icons/fi"
import Loader from "@/components/Loader"

export interface DeliveryJobFormData {
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
  paymentReceived: boolean;
}

interface DeliveryJobsProps {
  setVisible: (visible: boolean) => void;
  onCreated?: () => void;
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
  jobName: "", uuid: "", clientName: "", AssignTo: "", startTime: "", endTime: "",
  actualDeliveryDate: "", delay: "", status: "", phoneNumber: "", remarks: "",
  billingRaised: false, paymentReceived: false,
}

function DeliveryJobs({ setVisible, onCreated }: DeliveryJobsProps) {
  const [form, setForm] = useState<DeliveryJobFormData>(initialForm)
  const [loading, setLoading] = useState(false)

  const updateField = (field: keyof DeliveryJobFormData, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const createJob = async () => {
    if (loading) return;

    if (!form.jobName.trim() || !form.uuid.trim() || !form.clientName.trim() || !form.AssignTo.trim() || !form.startTime || !form.endTime || !form.phoneNumber.trim()) {
      toast.error("Please complete all required fields")
      return
    }

    setLoading(true)

    try {
      const res = await axios.post("/api/jobs?type=create", form, { withCredentials: true })

      if (res.status === 201) {
        toast.success("Delivery job created")
        onCreated?.()
        setVisible(false)
        setForm(initialForm)
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-[2px]">
      <div className="w-full max-w-3xl animate-[jobFormIn_220ms_ease-out] overflow-y-auto bg-white shadow-2xl max-h-[92vh]">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 md:px-7">
          <div><p className="text-xl font-bold text-gray-900">Assign new job</p><p className="mt-1 text-sm text-gray-500">Add the delivery details below.</p></div>
          <div aria-label="Close form" onClick={() => setVisible(false)} className="cursor-pointer p-2 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-black"><FiX /></div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2 md:p-7">
          <label className="text-sm font-semibold text-gray-700">Job name<input required value={form.jobName} onChange={(event) => updateField("jobName", event.target.value)} className={inputClass} placeholder="Website delivery" /></label>
          <label className="text-sm font-semibold text-gray-700">Job ID / UUID<input required value={form.uuid} onChange={(event) => updateField("uuid", event.target.value)} className={inputClass} placeholder="JOB-001" /></label>
          <label className="text-sm font-semibold text-gray-700">Client name<input required value={form.clientName} onChange={(event) => updateField("clientName", event.target.value)} className={inputClass} placeholder="Client name" /></label>
          <label className="text-sm font-semibold text-gray-700">Assign to<input required value={form.AssignTo} onChange={(event) => updateField("AssignTo", event.target.value)} className={inputClass} placeholder="Team member" /></label>
          <label className="text-sm font-semibold text-gray-700">Phone number<input required type="tel" value={form.phoneNumber} onChange={(event) => updateField("phoneNumber", event.target.value)} className={inputClass} placeholder="Phone number" /></label>
          <label className="text-sm font-semibold text-gray-700">Delay<input value={form.delay} onChange={(event) => updateField("delay", event.target.value)} className={inputClass} placeholder="Optional delay note" /></label>
          <label className="text-sm font-semibold text-gray-700">Start date<div className="relative mt-1"><FiCalendar className="pointer-events-none absolute right-3 top-3 text-gray-500" /><input required type="date" value={form.startTime} onChange={(event) => updateField("startTime", event.target.value)} className={`${dateInputClass} pr-10`} /></div></label>
          <label className="text-sm font-semibold text-gray-700">End date<div className="relative mt-1"><FiCalendar className="pointer-events-none absolute right-3 top-3 text-gray-500" /><input required type="date" value={form.endTime} onChange={(event) => updateField("endTime", event.target.value)} className={`${dateInputClass} pr-10`} /></div></label>
          <label className="text-sm font-semibold text-gray-700">Actual delivery date<div className="relative mt-1"><FiCalendar className="pointer-events-none absolute right-3 top-3 text-gray-500" /><input type="date" value={form.actualDeliveryDate} onChange={(event) => updateField("actualDeliveryDate", event.target.value)} className={`${dateInputClass} pr-10`} /></div></label>
          <label className="text-sm font-semibold text-gray-700">Status<select value={form.status} onChange={(event) => updateField("status", event.target.value)} className={`${inputClass} mt-1 capitalize`}>{statusOptions.map((status) => <option key={status.name} value={status.value}>{status.name}</option>)}</select><span className="mt-1 flex items-center gap-2 text-xs font-normal text-gray-500"><span className={`h-2.5 w-2.5 rounded-full ${statusOptions.find((status) => status.value === form.status)?.color}`} />Selected status</span></label>
          <label className="text-sm font-semibold text-gray-700 md:col-span-2">Remarks<textarea value={form.remarks} onChange={(event) => updateField("remarks", event.target.value)} className={`${inputClass} min-h-24 resize-y`} placeholder="Additional notes" /></label>
          <div className="flex flex-wrap gap-5 text-sm font-semibold text-gray-700 md:col-span-2"><label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={form.billingRaised} onChange={(event) => updateField("billingRaised", event.target.checked)} className="h-4 w-4 accent-[#de0046]" />Billing raised</label><label className="flex cursor-pointer items-center gap-2"><input type="checkbox" checked={form.paymentReceived} onChange={(event) => updateField("paymentReceived", event.target.checked)} className="h-4 w-4 accent-[#de0046]" />Payment received</label></div>
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-5 md:col-span-2"><div onClick={() => setVisible(false)} className="cursor-pointer border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100">Cancel</div><p onClick={createJob} className="flex cursor-pointer items-center gap-2 bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#de0046]">{loading ? (<>Creating... <Loader /></>) : (<>Create job <FiCheck /></>)}</p></div>
        </div>
      </div>
    </div>
  )
}

export default DeliveryJobs
