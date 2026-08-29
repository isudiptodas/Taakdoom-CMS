'use client'

import Loader from "@/components/Loader"
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner";

function page() {

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const router = useRouter();

  const createAccount = async () => {
    if(loading) return;

    if(!email.trim() || !name.trim() || !password.trim() || !confirm.trim()){
        toast.error("All fields are required");
        return;
    }

    if(confirm.trim() !== password.trim()){
        toast.error("Passwords do not match");
        return;
    }

    setLoading(true);

    try{
        const res = await axios.post(`/api/auth?type=register`, {
            name, email, password
        });

        console.log(res.data);
        if(res.status === 201){
            router.push('/');
        }
    }
    catch(err: any){
        const message = err?.response?.data?.message || "Something went wrong"
        toast.error(message);
    }
    finally{
        setLoading(false);
    }
  }

  return (
    <>
      <div className={`w-full bg-white min-h-screen flex flex-col justify-center items-center relative overflow-hidden`}>

        <div className={`w-full flex flex-col justify-center items-center gap-2 absolute top-0`}>
          <h1 className={`w-auto px-8 py-5 border-2 border-gray-300 text-xl text-center font-bold`}>TAAKDOOM CMS</h1>
        </div>

        <div className={`w-[90%] md:w-[70%] xl:w-[40%] border flex flex-col justify-start items-center gap-3 shadow-2xl px-3 xl:px-10 py-6`}>
          <p className={`w-full mb-5 text-center text-xl`}>Create a new CMS account</p>

          <input onChange={(e) => setName(e.target.value)} value={name} type="text" className={`w-full px-4 py-3 bg-gray-200 outline-none`} placeholder="Enter your name" />
          <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" className={`w-full px-4 py-3 bg-gray-200 outline-none`} placeholder="Enter your email" />
          <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className={`w-full px-4 py-3 bg-gray-200 outline-none`} placeholder="Enter your password" />
          <input onChange={(e) => setConfirm(e.target.value)} value={confirm} type="password" className={`w-full px-4 py-3 bg-gray-200 outline-none`} placeholder="Confirm your password" />
          <div onClick={createAccount} className={`w-full bg-linear-to-br from-zinc-950 to-[#9e0037] text-white font-semibold cursor-pointer active:opacity-80 duration-200 ease-in-out text-center py-3`}>{loading ? <div className={`flex justify-center items-center gap-5`}>Creating Account <Loader/></div> : ("Create Account")}</div>
        </div>

        <Link href='/' className={`font-bold text-pink-800 cursor-pointer mt-5`}>Go Back</Link>
      </div>
    </>
  )
}

export default page
