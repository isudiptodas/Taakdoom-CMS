'use client'

import Navbar from "@/components/AdminNavbar"
import AdminSidebar from "@/components/AdminSidebar"
import Loader from "@/components/Loader"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface data {
  _id: string;
  name: string;
  role: string;
  email: string
}

interface pendingData {
  email: string;
  isVerified: boolean;
  name: string;
  role: string;
  _id: string

}

function page() {

  const [data, setData] = useState<data>();
  const [allUsers, setAllUsers] = useState<pendingData[] | []>([]);
  const [filteredUsers, setFilteredUsers] = useState<pendingData[] | []>([]);
  const [selected, setSelected] = useState('users');
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const options = [
    'users',
    'pending'
  ]

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`/api/auth?type=verify`, {
          withCredentials: true
        });

        //console.log(res.data);
        setData(res.data.found);
      } catch (error: any) {
        console.log("ERROR", error);
      }
    }

    const getPendingRequest = async () => {
      try {
        const res = await axios.get(`/api/auth?type=fetch`, {
          withCredentials: true
        });

        setAllUsers(res.data.found);
      } catch (error: any) {
        console.log("ERROR", error);
      }
    }

    getPendingRequest();
    getUser();
  }, []);

  useEffect(() => {
    const filterUsers = () => {

      if (selected === "users") {
        setFilteredUsers(allUsers.filter((user) => user.isVerified === true));
      } else {
        setFilteredUsers(allUsers.filter((user) => user.isVerified === false));
      }
    }

    filterUsers();
  }, [selected, allUsers]);

  const handleApprove = async (email: string) => {
    if (approveLoading) return;

    try {
      setApproveLoading(true);
      const res = await axios.put(`/api/auth`, {
        email
      }, { withCredentials: true });

      if (res.status === 300) {
        toast.success("User Approved");
        setAllUsers((prev) => prev.map((user) => user.email === email ? { ...user, isVerified: true } : user))
      }
    } catch (error: any) {
      const message = error?.response?.data?.text || "Something went wrong";
      toast.error(message);
    }
    finally {
      setApproveLoading(false);
    }
  };

  const handleReject = async (email: string) => {
    if (rejectLoading) return;

    try {
      setRejectLoading(true);
      const res = await axios.delete(`/api/auth?email=${encodeURIComponent(email)}`, { withCredentials: true });

      if (res.status === 200) {
        toast.success("User Removed");
        setAllUsers((prev) => prev.filter((user) => user.email !== email));
      }
    } catch (error: any) {
      const message = error?.response?.data?.text || "Something went wrong";
      toast.error(message);
    }
    finally {
      setRejectLoading(false);
    }
  };

  return (
    <>
      <div className={`w-full min-h-screen overflow-hidden relative`}>
        <Navbar />

        <div className={`w-full flex justify-between items-center relative overflow-hidden`}>
          <AdminSidebar name={data?.name.split(" ")[0] as string} />

          <div className={`w-full lg:w-[80%] h-screen overflow-y-scroll flex flex-col justify-start items-center`}>
            <p className={`w-[90%] pb-5 border-b-2 border-black pt-10 font-bold text-4xl`}>Pending Requests</p>

            <div className={`w-[90%] mt-6 flex justify-start items-center gap-2`}>
              {options.map((item, index) => {
                return <span onClick={() => setSelected(item)} key={index} className={`w-auto px-4 py-2 capitalize ${item === selected ? "bg-gray-200 font-semibold" : "bg-transparent font-normal"} duration-200 ease-in-out cursor-pointer`}>{item}</span>
              })}
            </div>

            <div className="w-[90%] mt-5 overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full min-w-[700px] text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      ID
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Role
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Name
                    </th>

                    <th className="px-5 py-4 text-sm font-semibold text-gray-700">
                      Email
                    </th>

                    <th className={`px-5 py-4 text-sm font-semibold text-gray-700 ${selected === 'users' ? "hidden" : "block"}`}>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers?.map((user, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-gray-900">
                        {user.role}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-gray-900">
                        {user.name}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {user.email}
                      </td>

                      <td className={`${selected === 'users' ? "hidden" : "block"} px-5 py-4`}>
                        <div className="flex gap-2">
                          <div
                            onClick={() => handleApprove(user.email)}
                            className={`rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 active:scale-95 cursor-pointer flex justify-center items-center gap-2`}>
                            {approveLoading ? (<>Approving... <Loader /></>) : ("Approve")}
                          </div>

                          <div
                            onClick={() => handleReject(user.email)}
                            className={`rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 active:scale-95 cursor-pointer flex justify-center items-center gap-2`}>
                            {rejectLoading ? (<>Removing... <Loader /></>) : ("Remove")}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default page
