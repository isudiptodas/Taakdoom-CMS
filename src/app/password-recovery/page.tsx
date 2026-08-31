'use client'

import Loader from "@/components/Loader";
import axios from "axios";
import { useState } from "react"
import { toast } from "sonner";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import Link from "next/link";

function page() {

    const [emailSent, setEmailSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [otp, setOtp] = useState('');
    const [enteredOTP, setEnteredOTP] = useState<string[]>(["", "", "", "", "", ""]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const passwordValidation = {
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>_\-\\[\]/]/.test(password),
    };

    const handleChange = (value: string, index: number) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...enteredOTP];
        newOtp[index] = value;
        setEnteredOTP(newOtp);

        // Move to next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const findAccount = async () => {
        if (loading) return;

        if (!email.trim()) {
            toast.error("Please enter email");
            return;
        }

        const temp = Math.floor(100000 + Math.random() * 900000).toString();
        setOtp(temp.toString());

        setLoading(true);

        try {
            const res = await axios.post(`/api/password-recovery`, {
                email: email.trim(), otp: temp
            });

            if (res.status === 200) {
                setEmailSent(true);
            }
        } catch (error: any) {
            const message = error?.response?.data?.message || "Something went wrong";
            toast.error(message);
        }
        finally {
            setLoading(false);
        }
    }

    const verifyOTP = () => {
        if (enteredOTP.some((item) => item === "")) {
            toast.error("Please enter OTP");
            return;
        }

        const temp = enteredOTP.join("");

        if (temp === otp) {
            setVerified(true);
            toast.success("OTP verified");
        }
    }

    const changePassword = async () => {
        if (loading) return;

        try {
            const res = await axios.put(`/api/password-reset`, {
                email, password
            });

            if (res.status === 200) {
                router.push('/')
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
            <div className={`w-full flex flex-col justify-center items-center min-h-screen relative overflow-hidden`}>
                <div className={`w-full flex flex-col justify-center items-center gap-2 absolute top-0`}>
                    <h1 className={`w-auto px-8 py-5 border-2 border-gray-300 text-xl text-center font-bold`}>TAAKDOOM CMS</h1>
                </div>

                <h1 className={`w-full text-center font-bold text-3xl`}>Password Recovery</h1>

                {/* email enter field */}
                <div className={`w-[95%] md:w-[60%] xl:w-[40%] flex flex-col justify-center items-center mt-4 border-2 border-gray-400 px-3 py-4`}>
                    <input onChange={(e) => setEmail(e.target.value)} readOnly={emailSent} type="text" className={`w-full px-3 py-3 bg-gray-200 outline-none`} placeholder="Enter your email" />
                    <div onClick={findAccount} className={`w-full ${emailSent ? "pointer-events-none opacity-50" : ""} text-white py-3 font-semibold cursor-pointer active:opacity-75 duration-150 ease-in-out mt-3 bg-linear-to-br from-black to-[#960046] flex justify-center items-center gap-2`}>{loading ? (<>Finding... <Loader /></>) : ("Find Account")}</div>
                </div>

                {/* otp enter field */}
                <div className={`w-[95%] ${verified ? "pointer-events-none opacity-50" : ""} ${emailSent ? "block" : "hidden"} md:w-[60%] xl:w-[40%] flex flex-col justify-center items-center mt-8 gap-3`}>
                    <p className={`w-full text-center text-black text-lg`}>An OTP has send on email</p>
                    <span className={`w-full font-bold text-center`}>{email}</span>
                    <div className={`w-full flex justify-center items-center gap-3 mt-2`}>
                        {enteredOTP.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, index)}
                                className="h-12 w-12 rounded-lg border border-gray-600 text-center text-xl font-semibold outline-none focus:border-black"
                            />
                        ))}
                    </div>
                    <div onClick={verifyOTP} className={`w-full ${verified ? "pointer-events-none opacity-50" : ""} text-white py-3 font-semibold cursor-pointer active:opacity-75 duration-150 ease-in-out mt-3 bg-linear-to-br from-black to-[#960046] flex justify-center items-center gap-2`}>{loading ? (<>Verifying... <Loader /></>) : ("Verify OTP")}</div>
                </div>

                {/* new password field */}
                <div className={`w-[95%] ${verified ? "block" : "hidden"} md:w-[60%] xl:w-[40%] flex flex-col justify-center items-center gap-4 mt-4 border-2 border-gray-400 px-3 py-4 relative`}>
                    <span onClick={() => setPasswordVisible(!passwordVisible)} className={`absolute bottom-[63%] right-7 opacity-70 cursor-pointer`}>{passwordVisible ? <FaEye /> : <FaEyeSlash />}</span>
                    <span onClick={() => setPasswordVisible(!passwordVisible)} className={`absolute top-[10%] right-7 opacity-70 cursor-pointer`}>{passwordVisible ? <FaEye /> : <FaEyeSlash />}</span>

                    <input onChange={(e) => setPassword(e.target.value)} type={passwordVisible ? "text" : "password"} className={`w-full px-3 py-3 bg-gray-200 outline-none`} placeholder="Enter your password" />
                    <input onChange={(e) => setConfirm(e.target.value)} type={passwordVisible ? "text" : "password"} className={`w-full px-3 py-3 bg-gray-200 outline-none`} placeholder="Re enter your password" />
                    <div onClick={changePassword} className={`w-full ${verified ? "block" : "hidden"} text-white py-3 font-semibold cursor-pointer active:opacity-75 duration-150 ease-in-out mt-3 bg-linear-to-br from-black to-[#960046] flex justify-center items-center gap-2`}>{loading ? (<>Changing... <Loader /></>) : ("Change Password")}</div>

                    <div className="w-full text-sm space-y-1">
                        <p className={passwordValidation.uppercase ? "text-green-600" : "text-gray-500"}>
                            {passwordValidation.uppercase ? "✓" : "○"} At least one uppercase letter
                        </p>

                        <p className={passwordValidation.number ? "text-green-600" : "text-gray-500"}>
                            {passwordValidation.number ? "✓" : "○"} At least one number
                        </p>

                        <p className={passwordValidation.special ? "text-green-600" : "text-gray-500"}>
                            {passwordValidation.special ? "✓" : "○"} At least one special character
                        </p>
                    </div>
                </div>

                <div className={`w-full text-center cursor-pointer flex justify-center items-center gap-2 text-sm py-3 text-black`}>Go back to login page<Link href='/' className={`font-semibold`}>Login</Link></div>
            </div>
        </>
    )
}

export default page
