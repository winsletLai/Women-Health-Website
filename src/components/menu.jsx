import logo from '../assets/images/logo.png';
import { NavLink, useLocation, Link } from 'react-router-dom';
import {
    FiHome,
    FiCalendar,
    FiBookOpen,
    FiUsers,
} from 'react-icons/fi';
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { useContext, useEffect, useState } from 'react';
import { LoggedinContext, ThemeContext } from '../App';
import API from '../api/api';

const navItems = [
    { label: 'Home', to: '/', icon: FiHome },
    { label: 'Calendar', to: '/calendar', icon: FiCalendar },
    { label: 'Assistant', to: '/assistant', icon: IoChatbubbleEllipsesSharp },
    { label: 'Article', to: '/article', icon: FiBookOpen },
    { label: 'Community', to: '/community', icon: FiUsers }
];

function menu() {

    const { isLoggedin, setIsLoggedin } = useContext(LoggedinContext);
    const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
    function changeMode() {
        setIsDarkMode(i => i = (i === "light" ? "dark" : "light"));

    }

    const [image, setImage] = useState("");

    useEffect(() => {
        getUser();
    }, []);



    function getUser() {
        API.get("getUser.php").then(function (response) {

            setImage(
                `http://localhost/lunaria-backend/profile/${response.data.img}`
            );
            if (response.data.UID) {
                setIsLoggedin(true);
            }

        });
    }


    return (<>
        <div className={`sticky top-0 z-50 h-18 flex justify-between items-center ${isDarkMode} bg-bg-light shadow-(--shadow-l)`}>
            <Link to="/">
                <div className="flex items-center gap-1">
                    <img src={logo} alt="lunaria" className='w-10 ml-2' />
                    <p className="text-highlight text-2xl font-extrabold">Lunaria</p>
                </div>
            </Link>
            <div className="hidden md:flex items-center gap-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.to;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={`px-4 py-2  rounded-md rounded-bl-none rounded-br-none font-semibold transition 300s ease-linear  ${isActive
                                ? ' text-highlight shadow-highlight shadow-lg bg-bg'
                                : 'text-text-muted hover:text-highlight'
                                }`}
                        >
                            <span className='flex gap-1'><Icon size={20} />{item.label}</span>

                        </NavLink>
                    );
                })}
            </div>
            <div className='flex items-center gap-2'>
                <div>
                    <button className="text-xl cursor-pointer" onClick={changeMode}>
                        {(isDarkMode === "light" ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-highlight mt-2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                            </svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 text-highlight mt-2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                            </svg>
                        )}</button>
                </div>
                {isLoggedin ?
                    <Link to="/profile" >
                        <div className="w-12 h-12 mr-2 rounded-full bg-bg flex items-center justify-center text-highlight shadow-(--shadow-m)">
                            <img src={image} alt="Profile" className='w-12 h-12 rounded-full' />
                        </div>
                    </Link> :
                    <Link to="/login">
                        <div className="w-20 h-12 mr-2 rounded-xl bg-highlight flex items-center justify-center text-bg-dark shadow-(--shadow-m)">
                            <h1 className='font-bold'>Login</h1>
                        </div>
                    </Link>
                }
            </div>
        </div >
        <div className="md:hidden">
            <nav className={`${isDarkMode} fixed z-50 bottom-0 left-0 right-0 bg-bg shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-t-3xl px-6 py-2`}>
                <div className="flex items-center justify-between">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.to;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className="flex flex-col items-center gap-1 text-xs font-semibold text-text-muted"
                            >
                                <div
                                    className={`w-10 h-10 flex items-center justify-center shadow-(--shadow-m) rounded-2xl transition 300s ease-linear ${isActive ? 'bg-highlight text-bg-dark' : 'bg-bg-light text-text-muted'
                                        }`}
                                >
                                    <Icon size={20} />
                                </div>
                                <span className={isActive ? 'text-highlight' : ''}>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>
        </div>
    </>);
}

export default menu;