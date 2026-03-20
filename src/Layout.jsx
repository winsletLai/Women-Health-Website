import { Outlet } from "react-router-dom";
import Menu from "./components/menu";
import { useContext } from 'react';
import { ThemeContext } from './App';

function Layout() {
    const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);

    return (<>
        <Menu />
        <main className={`${isDarkMode}`}>
            <Outlet />
        </main >
    </>);
}

export default Layout;