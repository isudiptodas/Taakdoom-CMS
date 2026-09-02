'use client'

import { useEffect, useState } from "react";
import { FiSidebar } from "react-icons/fi";
import { VscClose } from "react-icons/vsc";

function UserNavbar() {

    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        if (menuVisible) {
            document.body.style.overflow = "hidden";
            document.body.classList.add("menu-open");
        } else {
            document.body.style.overflow = "";
            document.body.classList.remove("menu-open");
        }

        return () => {
            document.body.style.overflow = "";
            document.body.classList.remove("menu-open");
        };
    }, [menuVisible]);

    const navLinks = [
        {
            name: 'Dashboard',
            link: `/user/dashboard`
        },
        {
            name: 'Jobs',
            link: '/jobs'
        },
        {
            name: 'Work Log',
            link: '/work-log'
        },
        {
            name: 'Clients',
            link: '/clients'
        },
    ];

    return (
        <>
            <div className={`w-full relative ${menuVisible ? "blur-sm" : ""} duration-300 ease-in-out fixed flex justify-between lg:justify-center items-center px-4 py-4 border-2 border-b-[#5d011e]`}>
                <p className={`w-auto px-4 py-2 font-black bg-linear-to-br from-[#ffeaf1] via-[#a40037] to-[#000000] bg-clip-text text-transparent`}>TAAKDOOM</p>
                <span onClick={() => setMenuVisible(true)} className={`w-auto lg:hidden cursor-pointer bg-linear-to-br from-[#ffeaf1] via-[#a40037] to-[#000000] p-2`}><FiSidebar className={`text-xl text-white`} /></span>
            </div>

            <div className={`w-[80%] lg:hidden flex flex-col justify-start items-center ${menuVisible ? "translate-x-0" : "translate-x-full"} duration-500 ease-in-out bg-linear-to-br from-zinc-700 to-zinc-950 fixed top-0 right-0 z-50 h-screen shadow-2xl`}>
                <span onClick={() => setMenuVisible(false)} className={`w-full px-4 py-5 text-white text-4xl`}><VscClose /></span>

                <div className={`w-full flex flex-col justify-start items-center mt-10`}>
                    {navLinks.map((item, index) => {
                        return <span key={index} className={`w-full text-start pl-6 text-white text-3xl mb-3 font-light`}>{item.name}</span>
                    })}
                </div>
            </div>
        </>
    )
}

export default UserNavbar
