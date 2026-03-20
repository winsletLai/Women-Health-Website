import ForumCard from '../components/forumCard.jsx';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api.js';

function Community() {
    const [user, setUser] = useState({});
    const [search, setSearch] = useState("");
    const [questions, setQuestions] = useState([]);


    useEffect(() => {
        getQuestion();
        getUser();
    }, []);

    function getQuestion() {
        API.get("getAllQuestion.php").then(res => {
            console.log(res.data);
            setQuestions(res.data.data);
        }).catch(err => {
            console.log("ERROR:", err);
        });
    }

    function getUser() {
        API.get("getUser.php").then(function (response) {
            setUser(response.data);
        });
    }

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post(
                "searchQuestion.php",
                { search }
            );
            setQuestions(response.data.data);
        } catch (error) {
            console.error("FULL ERROR:", error);
            if (error.response) console.log("SERVER DATA:", error.response.data);
        }
    }

    return (
        <section className="space-y-6 min-h-screen bg-bg-dark pb-20 md:pb-0">
            <div className="flex items-center justify-between gap-4 px-2">
                <div>
                    <p className="text-xs uppercase tracking-wide text-text-muted">Community</p>
                    <h1 className="text-highlight text-3xl font-bold">FAQs</h1>
                </div>
                {(user.role === "general") && (<Link to="/addQuestion">
                    <button className="cursor-pointer  bg-highlight inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-sandy text-text-highlight font-semibold shadow-md">
                        <FiPlus /> Ask Question
                    </button>
                </Link>)
                }
            </div>

            <div className="bg-bg shadow-(--shadow-l) mx-2 rounded-3xl p-4 space-y-4">
                <form onSubmit={handleSearch}>
                    <div className="flex items-center gap-3 bg-bg-light shadow-(--shadow-s) rounded-2xl pl-4">
                        <FiSearch className="text-highlight" />
                        <input
                            type="text"
                            placeholder="Search discussions"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 py-3 placeholder:text-text-muted text-text bg-transparent outline-none"
                            required
                        />
                        <button className='bg-bg-dark text-highlight shadow(--shadow-s) py-3 rounded-r-2xl w-20'>Search</button>
                    </div>
                </form>
            </div>

            <div className="flex flex-col gap-4 mx-2">
                {questions?.map((question) => (
                    <ForumCard
                        key={question.QID}
                        QID={question.QID}
                        title={question.title}
                        description={question.description}
                        user={question.user}
                        likes={question.likes}
                        time={question.time}
                        answers={question.answers}
                    />
                ))}
            </div>
        </section>
    );
};

export default Community;


