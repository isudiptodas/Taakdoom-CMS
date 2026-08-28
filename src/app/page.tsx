'use client'

import Loader from "@/components/Loader"
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner";

function page() {

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const loginAccount = async () => {
    if (loading) return;

    if (!email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await axios.post(`/api/auth?type=login`, {
        email, password
      }, { withCredentials: true });

      console.log(res.data);
      if (res.status === 200) {
        router.push('/user/dashboard');
      }
    }
    catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong"
      toast.error(message);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={`w-full bg-white min-h-screen flex flex-col justify-center items-center relative overflow-hidden`}>

        <div className={`w-full flex flex-col justify-center items-center gap-2 absolute top-0`}>
          <h1 className={`w-auto px-8 py-5 border-2 border-gray-300 text-xl text-center font-bold`}>TAAKDOOM CMS</h1>
        </div>

        <div className={`w-[90%] md:w-[70%] xl:w-[40%] flex flex-col justify-start items-center gap-3 shadow-2xl px-3 py-6`}>
          <p className={`w-full mb-5 text-center text-xl`}>Login to your Account</p>

          <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" className={`w-full px-4 py-3 bg-gray-200 outline-none`} placeholder="Enter your email" />
          <input onChange={(e) => setPassword(e.target.value)} value={password} type="text" className={`w-full px-4 py-3 bg-gray-200 outline-none`} placeholder="Enter your password" />
          <p onClick={loginAccount} className={`w-full bg-linear-to-br from-zinc-950 to-[#9e0037] text-white font-semibold cursor-pointer active:opacity-80 duration-200 ease-in-out text-center py-3`}>{loading ? <span className={`flex justify-center items-center gap-5`}>Processing <Loader /></span> : ("Enter profile")}</p>
        </div>

        <p className={`w-full flex justify-center items-center gap-2 mt-5 text-sm lg:text-lg`}>Don't have a CMS account ? <Link href='/sign-up' className={`font-bold text-pink-800 cursor-pointer`}>Create here</Link></p>
      </div>
    </>
  )
}

export default page
