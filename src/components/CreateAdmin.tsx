'use client'

import axios from "axios"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import Loader from "./Loader"

function CreateAdmin({ setVisible }: { setVisible: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const createAdmin = async () => {
        if (loading) return;

        if (!name.trim() || !email.trim() || !password.trim()) {
            toast.error("All fields required");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(`/api/auth?type=admin`, {
                name: name.trim(), email: email.trim(), password: password.trim()
            }, { withCredentials: true });

            if(res.status === 201){
                setLoading(false);
                toast.success("New Admin Created");
                setVisible(false);
                setEmail('');
                setName('');
                setPassword('');
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || "Something went wrong";
            toast.error(message);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className={`w-full px-4 py-5 h-auto bg-black flex flex-col justify-start items-center gap-3`}>
                <input onChange={(e) => setName(e.target.value)} type="text" className={`w-full px-3 py-3 bg-zinc-800 outline-none placeholder-gray-300 text-white`} placeholder="Enter admin name*" />
                <input onChange={(e) => setEmail(e.target.value)} type="email" className={`w-full px-3 py-3 bg-zinc-800 outline-none placeholder-gray-300 text-white`} placeholder="Enter admin email*" />
                <input onChange={(e) => setPassword(e.target.value)} type="password" className={`w-full px-3 py-3 bg-zinc-800 outline-none placeholder-gray-300 text-white`} placeholder="Create admin password*" />

                <div className={`w-full mt-5 flex justify-between items-center md:justify-start gap-2 md:gap-5`}>
                    <p onClick={createAdmin} className={`w-full flex justify-center items-center gap-2 md:w-auto px-3 md:px-6 py-3 active:opacity-75 duration-200 ease-in-out cursor-pointer text-center text-white font-semibold bg-linear-to-br from-black to-[#5d002a]`}>{loading ? (<>Creating... <Loader /></>) : ("Create Admin")}</p>
                    <div onClick={() => setVisible(false)} className={`w-full md:w-auto px-3 md:px-6 py-3 active:opacity-75 duration-200 ease-in-out cursor-pointer text-center text-black font-semibold bg-white`}>Cancel</div>
                </div>
            </div>
        </>
    )
}

export default CreateAdmin
