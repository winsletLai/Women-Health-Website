import { FiSearch, FiPlus } from 'react-icons/fi';
import ArticleCard from '../components/ArticleCard.jsx';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api.js';


function Article() {

    const [articles, setArticles] = useState([]);

    const [user, setUser] = useState({});

    const [search, setSearch] = useState("");
    const [allow18, setAllow18] = useState(true);

    useEffect(() => {
        getArticles();
        getUser();
    }, []);

    function getArticles() {
        API.get("getAllArticle.php").then(res => {
            console.log(res.data);
            setArticles(res.data.data);
        }).catch(err => {
            console.log("ERROR:", err);
        });
    }

    function getUser() {
        API.get("getUser.php").then(function (response) {
            setUser(response.data);
        });
    }

    const handleExplicit = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post(
                "filterArticle.php",
                { allow18 }
            );
            setArticles(response.data.data);
        } catch (error) {
            console.error("FULL ERROR:", error);
            if (error.response) console.log("SERVER DATA:", error.response.data);
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post(
                "searchArticle.php",
                { search, allow18 }
            );
            setArticles(response.data.data);
        } catch (error) {
            console.error("FULL ERROR:", error);
            if (error.response) console.log("SERVER DATA:", error.response.data);
        }
    }

    return (
        <section className="space-y-6 min-h-screen bg-bg-dark pb-20 md:pb-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className='flex justify-between w-full'>
                    <h1 className="text-3xl font-bold text-highlight">Articles</h1>
                    {(user.role === "expert") && (<Link to="/addArticle">
                        <button className="cursor-pointer  bg-highlight inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-sandy text-text-highlight font-semibold shadow-md">
                            <FiPlus /> Add Article
                        </button>
                    </Link>)
                    }
                </div>
            </div>

            <div className="bg-bg shadow-(--shadow-l) mx-2 rounded-3xl p-4 space-y-4">
                <form onSubmit={handleSearch}>
                    <div className="flex items-center gap-3 bg-bg-light shadow-(--shadow-s) rounded-2xl pl-4">
                        <FiSearch className="text-highlight" />
                        <input
                            type="text"
                            placeholder="Search articles"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 py-3 placeholder:text-text-muted text-text bg-transparent outline-none"
                            required
                        />
                        <button className='bg-bg-dark text-highlight shadow(--shadow-s) py-3 rounded-r-2xl w-20'>Search</button>
                    </div>
                </form>
                <div className="flex justify-end">
                    <form onSubmit={handleExplicit}>
                        <button
                            onClick={() => setAllow18(prev => !prev)}
                            className={`cursor-pointer px-4 py-2 rounded-2xl text-sm font-semibold ${allow18 ? "bg-green-200" : "bg-red-200"
                                }`}
                        >
                            {allow18 ? "18+ Allowed" : "18+ Hidden"}
                        </button>
                    </form>

                </div>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 m-2">
                {articles?.map((article) => (
                    <ArticleCard
                        key={article.AID}
                        AID={article.AID}
                        image={article.image}
                        title={article.title}
                        description={article.description}
                        date={article.date}
                        author={article.author}
                        specialty={article.specialty}
                        tags={article.tags}
                        likes={article.likes}
                    />
                ))}
            </div>
        </section>
    );
}

export default Article;


