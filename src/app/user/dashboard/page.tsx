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

function page() {

  const [data, setData] = useState<data>();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/auth`, {
          withCredentials: true
        });

        console.log(res.data);
        setData(res.data.found);
      } catch (error: any) {
        console.log("ERROR", error);
      }
    }

    getUser();
  }, []);

  return (
    <>
      <div className={`w-full min-h-screen overflow-hidden relative`}>
        <Navbar />

        <div className={`w-full flex justify-between items-center relative overflow-hidden`}>
          <AdminSidebar name={data?.name.split(" ")[0] as string} />

          <div className={`w-full lg:w-[80%] h-screen overflow-y-scroll flex flex-col justify-start items-center`}>
            <p className={`w-[90%] pb-5 border-b-2 border-black pt-10 font-bold text-4xl`}>Dashboard</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default page
