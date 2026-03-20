import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from "./Layout";
import Home from "./pages/Home";
import Login from "./pages/Login"
import Register from "./pages/Register";
import { createContext, useState } from 'react';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Calendar from './pages/Calendar';
import Assistant from './pages/Assistant';
import AddArticle from './pages/AddArticle';
import Article from './pages/Article';
import ArticleDetail from './pages/ArticleDetail'
import Community from './pages/Community';
import AddQuestion from './pages/AddQuestion'
import QuestionDetail from "./pages/QuestionDetail"

export const LoggedinContext = createContext();
export const ThemeContext = createContext();

function App() {

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState("light");

    return (

        <LoggedinContext.Provider value={{ isLoggedin, setIsLoggedin }}>
            <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route path='/calendar' element={<Calendar />} />
                        <Route path='/assistant' element={<Assistant />} />
                        <Route path='/article' element={<Article />} />
                        <Route path='/addArticle' element={<AddArticle />} />
                        <Route path="/article/:id" element={<ArticleDetail />} />
                        <Route path='/community' element={<Community />} />
                        <Route path='/addQuestion' element={<AddQuestion />} />
                        <Route path='/question/:id' element={<QuestionDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path='/settings' element={<Settings />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </ThemeContext.Provider>
        </LoggedinContext.Provider>

    )
}

export default App