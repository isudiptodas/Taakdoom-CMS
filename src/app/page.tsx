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
  const [option, setOption] = useState('user');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const loginAccount = async () => {
    if (loading) return;

    if (!email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`/api/auth?type=login`, {
        email, password, option
      }, { withCredentials: true });

      if (res.status === 200) {
        router.push(`/${res.data.role}/dashboard`);
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

  const options = [
    'user',
    'admin'
  ]

  return (
    <>
      <div className={`w-full bg-white min-h-screen flex flex-col justify-center items-center relative overflow-hidden`}>

        <div className={`w-full flex flex-col justify-center items-center gap-2 absolute top-0`}>
          <h1 className={`w-auto px-8 py-5 border-2 border-gray-300 text-xl text-center font-bold`}>TAAKDOOM CMS</h1>
        </div>

        <div className={`w-[90%] md:w-[70%] xl:w-[40%] flex flex-col justify-start items-center gap-3 shadow-2xl px-3 py-6`}>
          <p className={`w-full mb-5 text-center text-xl`}>Login to your Account</p>

          <div className={`w-full flex flex-col gap-5 relative`}>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" className={`w-full px-4 py-3 bg-gray-200 outline-none`} placeholder="Enter your email" />
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="text" className={`w-full px-4 py-3 bg-gray-200 outline-none`} placeholder="Enter your password" />
          </div>

          <div className={`w-full py-2 flex justify-start items-center gap-2`}>
            {options.map((item, index) => {
              return <span onClick={() => setOption(item)} key={index} className={`w-auto px-3 py-3 ${option === item ? "bg-black text-white" : "bg-transparent text-black"} duration-150 ease-in-out `}>{item}</span>
            })}
          </div>
          <div onClick={loginAccount} className={`w-full bg-linear-to-br from-zinc-950 to-[#9e0037] text-white font-semibold cursor-pointer active:opacity-80 duration-200 ease-in-out text-center py-3`}>{loading ? <div className={`flex justify-center items-center gap-5`}>Processing <Loader /></div> : ("Enter profile")}</div>
        </div>

        <p className={`w-full flex justify-center items-center gap-2 mt-5 text-sm lg:text-lg`}>Don't have a CMS account ? <Link href='/sign-up' className={`font-bold text-pink-800 cursor-pointer`}>Create here</Link></p>
        <p className={`w-full flex justify-center items-center gap-2 mt-2 text-sm lg:text-lg`}>Don't remember your password ?<Link href='/password-recovery' className={`font-bold text-pink-800 cursor-pointer`}>Recover Here</Link></p>
      </div>
    </>
  )
}

export default page
