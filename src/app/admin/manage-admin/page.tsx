'use client'

import Navbar from "@/components/AdminNavbar"
import AdminSidebar from "@/components/AdminSidebar"
import Loader from "@/components/Loader"
import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { TiUserAdd } from "react-icons/ti";
import CreateAdmin from "@/components/CreateAdmin"

interface data {
  _id: string;
  name: string;
  role: string;
  email: string
}

interface adminData {
  email: string;
  isVerified: boolean;
  name: string;
  role: string;
  _id: string;
}

function page() {

  const [data, setData] = useState<data>();
  const [allAdmin, setAllAdmin] = useState<adminData[]>([]);
  const [adminVisible, setAdminVisible] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<adminData>();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getAdmins = async () => {
    try {
      const res = await axios.get(`/api/auth?type=admins`, {
        withCredentials: true
      });

      setAllAdmin(res.data.found);
    } catch (error: any) {
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
      } catch (error: any) {
        console.log("ERROR", error);
      }
    }

    getUser();
    getAdmins();
  }, []);

  const deleteAdmin = async () => {
    if (!selectedAdmin || deleteLoading) return;

    try {
      setDeleteLoading(true);
      const res = await axios.delete(`/api/auth?type=delete-admin&id=${selectedAdmin._id}`, {
        withCredentials: true
      });

      if (res.status === 200) {
        setSelectedAdmin(undefined);
        await getAdmins();
        toast.success("Admin Deleted");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      <div className={`w-full min-h-screen overflow-hidden relative`}>
        <Navbar />

        <div className={`w-full flex justify-between items-center relative overflow-hidden`}>
          <AdminSidebar name={data?.name.split(" ")[0] as string} />

          <div className={`w-full lg:w-[80%] h-screen overflow-y-scroll flex flex-col justify-start items-center`}>
            <p className={`w-[90%] pb-5 border-b-2 border-black pt-10 font-bold text-4xl`}>Manage Admin</p>

            <div className={`w-full mt-5 pl-5 lg:pl-10 xl:pl-14 flex flex-col justify-start items-start gap-4`}>
              <p className={`w-full lg:w-auto text-start text-xl`}>Total Admin <span className={`font-bold`}>{allAdmin.length}</span></p>
              <p onClick={() => setAdminVisible(!adminVisible)} className={`w-auto px-5 py-3 bg-black text-white active:opacity-75 duration-200 ease-in-out cursor-pointer flex justify-center items-center gap-2`}>Add new admin <TiUserAdd className="text-xl" /></p>
            </div>

            <div className={`w-[90%] md:w-[95%] xl:w-[90%] mt-5 h-auto flex flex-col justify-start items-center pt-2 pb-5`}>
              {adminVisible ? (
                <CreateAdmin setVisible={setAdminVisible} />
              ) : (
                <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full min-w-[700px] text-left">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-5 py-4 text-sm font-semibold text-gray-700">ID</th>
                        <th className="px-5 py-4 text-sm font-semibold text-gray-700">Role</th>
                        <th className="px-5 py-4 text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-5 py-4 text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-5 py-4 text-sm font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {allAdmin.map((admin, index) => (
                        <tr key={admin._id} className="group border-t border-gray-200 hover:bg-gray-50">
                          <td className="px-5 py-4 text-sm text-gray-600">{index + 1}</td>
                          <td className="px-5 py-4 text-sm font-medium text-gray-900">{admin.role}</td>
                          <td className="px-5 py-4 text-sm font-medium text-gray-900">{admin.name}</td>
                          <td className="px-5 py-4 text-sm text-gray-600">{admin.email}</td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => setSelectedAdmin(admin)}
                              className="invisible cursor-pointer hover:opacity-75 translate-x-2 bg-red-600 px-3 py-2 text-sm font-medium text-white opacity-0 transition duration-200 group-hover:visible group-hover:translate-x-0 group-hover:opacity-100"
                            >
                              Delete admin
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {selectedAdmin && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
                <div className="w-full max-w-md bg-white p-6">
                  <p className="text-xl font-semibold">Delete admin?</p>
                  <p className="mt-2 text-gray-600">Are you sure you want to delete {selectedAdmin.name}?</p>
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={() => setSelectedAdmin(undefined)}
                      className="bg-gray-200 cursor-pointer px-5 py-2 text-black">
                      No
                    </button>
                    <button
                      onClick={deleteAdmin}
                      className="bg-red-600 cursor-pointer px-5 py-2 text-white"
                    >
                      {deleteLoading ? (<>Deleting... <Loader /></>) : "Yes, delete"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default page
