'ese client'

import { adminSidebarLinks } from "@/data/adminSidebarLinks"
import Link from "next/link"
import { usePathname } from "next/navigation"

function AdminSidebar({ name }: { name: string }) {

    const pathname = usePathname();

    return (
        <>
            <div className={`w-[20%] hidden lg:flex flex-col justify-start items-start border-r-2 border-r-[#700027] min-h-screen px-3 py-4`}>
                <div className={`w-full pl-2 flex flex-col justify-start items-start`}>
                    <p className={`w-full font-xl text-black`}>Welcome</p>
                    <p className={`w-full font-bold text-4xl bg-linear-to-r from-black to-[#960034] bg-clip-text text-transparent`}>{name || "Unknown"}</p>
                </div>

                <div className={`w-full mt-10 flex flex-col justify-start items-start`}>
                    {adminSidebarLinks.map((item, index) => {
                        return <Link key={index} href={item.link} className={`w-full text-start pl-2 py-2 pr-10 border-2 ${item.link === pathname ? "bg-[#d6002b4e] border-[#bb0032]" : "bg-transparent border-transparent"}`}>{item.name}</Link>
                    })}
                </div>
            </div>
        </>
    )
}

export default AdminSidebar
