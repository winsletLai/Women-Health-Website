import mascot from '../assets/images/mascot.png';
import { FcGoogle } from "react-icons/fc";
import { useState } from 'react';
import API from '../api/api';
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const togglePassword = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post(
                "register.php",
                { email, password }
            );

            setMsg(response.data.message);

            if (response.data.status === "success") {
                setEmail("");
                setPassword("");
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <div className="max-w-screen min-h-screen bg-bg-dark flex justify-center">
                <div className="sm:shadow-(--shadow-m) sm:px-8 w-screen sm:my-8 sm:h-fill sm:w-75 bg-linear-to-br from-bg to-rose-800/20 rounded-xl">
                    <div className="flex flex-col w-full items-center">
                        <div className='mt-8 flex'>
                            <img src={mascot} className="w-12 h-12"></img>
                            <h1 className="text-text text-4xl">Register</h1>
                        </div>
                        <p className='text-center text-text-muted mt-4'>Already have an account? <Link to="/login"><span className='text-highlight underline'>Login</span></Link> </p>
                        {msg && (
                            <div className='shadow-(--shadow-m) bg-linear-to-br from-highlight to-highlight/60 rounded-2xl mt-4 p-1'><p className='text-center text-bg text-sm'>{msg}</p></div>
                        )}
                        <div className="mt-8 flex flex-col w-full items-center">
                            <div className='w-60'>
                                <button className='shadow-(--shadow-s) rounded-2xl text-highlight p-2 w-full bg-bg-light hover:bg-bg-dark/50 border-2 border-transparent hover:hover:border-highlight flex gap-2 cursor-pointer pl-7 hover:font-bold hover:scale-110 transition-transform duration-300 ease-in-out'><FcGoogle size={25} /> Sign in with Google</button>
                            </div>

                            <div className="mt-8 flex w-full items-center justify-between">
                                <div className='bg-highlight/30 h-0.5 flex-3'></div>
                                <p className='flex-1 text-highlight/50 text-center'>OR</p>
                                <div className='bg-highlight/30 h-0.5 flex-3'></div>
                            </div>
                            <div className="w-60 mt-8">
                                <form onSubmit={handleSubmit}>
                                    <div className='shadow-(--shadow-m) bg-bg-light w-full h-10 flex justify-between items-center rounded-2xl border-2 border-highlight'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 ml-2 text-highlight">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                        </svg>
                                        <input required onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Email' className='w-52 outline-none bg-bg-light text-text placeholder:text-highlight rounded-r-2xl' />
                                    </div>
                                    <div className='mt-4 shadow-(--shadow-m) bg-bg-light w-full h-10 flex justify-between items-center rounded-2xl border-2 border-highlight'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5 ml-2 text-highlight">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                        </svg>
                                        <input required id="password" type={isPasswordVisible ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className='w-45 outline-none bg-bg-light text-text placeholder:text-highlight' />
                                        <button type="button" onClick={togglePassword} className='mr-2 hover:cursor-pointer'>
                                            {isPasswordVisible ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-icon lucide-eye text-highlight size-5">
                                                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-closed-icon lucide-eye-closed text-highlight size-5">
                                                    <path d="m15 18-.722-3.25" /><path d="M2 8a10.645 10.645 0 0 0 20 0" /><path d="m20 15-1.726-2.05" /><path d="m4 15 1.726-2.05" /><path d="m9 18 .722-3.25" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>

                                    <p className='text-xs mt-4 text-text-muted'>By continuing, you agree to accept the <a href="#" className='underline text-highlight'>Terms of Services</a> and <a href="#" className='underline text-highlight'>Privacy Policy</a></p>

                                    <button className='mt-4 mb-8 shadow-(--shadow-l) bg-highlight text-text-highlight w-full rounded-xl hover:cursor-pointer hover:bg-highlight/80 p-2 transform transition-transform duration-300 hover:scale-110 ease-in-out'>Continue</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Register