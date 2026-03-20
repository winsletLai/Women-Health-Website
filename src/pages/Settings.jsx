import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import API from "../api/api";
import { LoggedinContext } from "../App";

function Settings() {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const togglePassword = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const [profile, setProfile] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [image, setImage] = useState("");
    const [user, setUser] = useState("");
    const [file, setFile] = useState(null);
    const [specialty, setSpecialty] = useState("");

    useEffect(() => {
        getUser();
    }, [name, email]);

    function getUser() {
        API.get("getUser.php").then(function (response) {
            setUser(response.data);
            setImage(
                `http://localhost/lunaria-backend/profile/${response.data.img}`
            );

        });
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("profile", profile);

        try {
            const response = await API.post(
                "settings.php", formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            setMsg(response.data.message);
            if (response.data.status === "success") {
                setEmail("");
                setPassword("");
                setName("");
                setProfile(null);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmitMedical = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("specialty", specialty);

        try {
            const response = await API.post(
                "settings.php", formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            setMsg(response.data.message);
            if (response.data.status === "success") {
                setSpecialty("");
                setFile(null);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const navigate = useNavigate();
    const { isLoggedin, setIsLoggedin } = useContext(LoggedinContext);

    const handleLogout = async () => {
        try {
            const response = await API.post("logout.php");

            if (response.data.status === "success") {
                setIsLoggedin(false);
                setMsg(response.data.message)
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (<>
        <div className="bg-bg-dark min-h-screen pb-25 md:pb-0">

            <h1 className="pt-2 text-5xl font-bold text-text-muted text-center">Settings</h1>
            <div className="m-4 pt-4 flex flex-col items-center md:flex-row justify-center gap-5 md:gap-10 bg-bg shadow-(--shadow-l) h-fit rounded-2xl">
                <div className="flex flex-col items-center">
                    <img
                        src={image}
                        alt="Profile"
                        className="w-30 h-30 rounded-full border-2 border-highlight"
                    />
                    <h1 className="text-2xl text-center text-text">{user.name}</h1>
                    <h1 className="text-center text-text-muted">{user.email}</h1>
                </div>

                <div className="flex flex-col">
                    {msg && (
                        <div className='mb-2 shadow-(--shadow-m) bg-linear-to-br from-highlight to-highlight/60 rounded-2xl p-1'><p className='text-center text-bg text-sm'>{msg}</p></div>
                    )}
                    <form onSubmit={handleSubmit} className="w-60">
                        <div className='overflow-hidden shadow-(--shadow-m) pl-2 bg-bg-light w-full h-fit flex-col rounded-2xl border-2 border-highlight'>
                            <div className="flex text-highlight">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                </svg>
                                <label htmlFor="profile" className="pl-0.5">Change Profile</label>
                            </div>
                            <input id="profile" onChange={(e) => setProfile(e.target.files[0])} type="file" className="file:hidden text-sm text-text-muted" accept=".jpg, .jpeg, .png, image/jpeg, image/png" />
                        </div>
                        <p className="text-xs text-text-muted">profile must be files: .jpg, .png, .jpeg</p>

                        <div className='mt-4 shadow-(--shadow-m) bg-bg-light w-full h-10 flex justify-between items-center rounded-2xl border-2 border-highlight'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 ml-2 text-highlight">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <input onChange={(e) => setName(e.target.value)} type="text" placeholder='Change username' className='w-52 outline-none bg-bg-light text-text placeholder:text-highlight rounded-r-2xl' />
                        </div>
                        <p className="text-xs text-text-muted">name has to be less than 20 chars</p>
                        <div className='mt-4 shadow-(--shadow-m) bg-bg-light w-full h-10 flex justify-between items-center rounded-2xl border-2 border-highlight'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth-="1.5" stroke="currentColor" className="size-5 ml-2 text-highlight">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                            <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Change email' className='w-52 outline-none bg-bg-light text-text placeholder:text-highlight rounded-r-2xl' />
                        </div>
                        <p className="text-xs text-text-muted">use a valid email</p>
                        <div className='mt-4 shadow-(--shadow-m) bg-bg-light w-full h-10 flex justify-between items-center rounded-2xl border-2 border-highlight'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5 ml-2 text-highlight">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            <input id="password" type={isPasswordVisible ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className='w-45 outline-none bg-bg-light text-text placeholder:text-highlight' />
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
                        <p className="text-xs text-text-muted">password must be at least 8 characters long contain a number and an uppercase letter.</p>
                        <button className='mt-4 mb-8 shadow-(--shadow-l) bg-highlight text-text-highlight w-full rounded-xl hover:cursor-pointer hover:bg-highlight/80 p-2 transform transition-transform duration-300 hover:scale-110 ease-in-out'>Update</button>
                    </form>

                </div>
                <div className="w-full h-1 md:w-1 md:h-100 bg-highlight"></div>
                <div className="flex flex-col">

                    <h1 className="text-highlight text-center text-xl mb-4">Apply as a medical expert</h1>
                    <form onSubmit={handleSubmitMedical} className="w-60">
                        <div className='overflow-hidden shadow-(--shadow-m) pl-2 bg-bg-light w-full h-fit flex-col rounded-2xl border-2 border-highlight'>
                            <div className="flex text-highlight">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-file-badge-icon lucide-file-badge size-5"><path d="M13 22h5a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v3.3" /><path d="M14 2v5a1 1 0 0 0 1 1h5" /><path d="m7.69 16.479 1.29 4.88a.5.5 0 0 1-.698.591l-1.843-.849a1 1 0 0 0-.879.001l-1.846.85a.5.5 0 0 1-.692-.593l1.29-4.88" /><circle cx="6" cy="14" r="3" /></svg>
                                <label htmlFor="file" className="pl-0.5">Upload Medical Certificate</label>
                            </div>
                            <input required id="file" onChange={(e) => setFile(e.target.files[0])} type="file" className="file:hidden text-sm text-text-muted" accept=".pdf" />
                        </div>
                        <p className="text-xs text-text-muted">certificate must be .pdf</p>

                        <div className='mt-4 shadow-(--shadow-m) bg-bg-light w-full h-10 flex justify-between items-center rounded-2xl border-2 border-highlight'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 ml-2 text-highlight">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <input required onChange={(e) => setSpecialty(e.target.value)} type="text" placeholder='Enter your primary specialty' className='w-52 outline-none bg-bg-light text-text placeholder:text-highlight rounded-r-2xl' />
                        </div>
                        <p className="text-xs text-text-muted">e.g., Pediatrics</p>

                        <button className='mt-4 mb-8 shadow-(--shadow-l) bg-highlight text-text-highlight w-full rounded-xl hover:cursor-pointer hover:bg-highlight/80 p-2 transform transition-transform duration-300 hover:scale-110 ease-in-out'>Apply</button>
                    </form>

                </div>


            </div>
            <div className='flex justify-center'>
                <button onClick={handleLogout} className='w-80 mt-4 mb-8 shadow-(--shadow-l) bg-highlight text-text-highlight rounded-xl hover:cursor-pointer hover:bg-highlight/80 p-2 transform transition-transform duration-300 hover:scale-110 ease-in-out'>Log out</button>
            </div>
        </div>
    </>)
}

export default Settings