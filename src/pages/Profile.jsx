import { useEffect, useState } from 'react';
import ArticleCard from '../components/ArticleCard.jsx';
import { Link } from 'react-router-dom';
import API from '../api/api.js';
import ForumCard from '../components/forumCard.jsx';

function Profile() {

    const [user, setUser] = useState("");
    const [image, setImage] = useState("");
    const [articles, setArticles] = useState([]);
    const [questions, setQuestions] = useState([]);


    useEffect(() => {
        getArticles();
        getQuestion();
        getUser();
    }, []);

    function getArticles() {
        API.get("getPersonalArticle.php").then(res => {
            setArticles(res.data.data);
        });
    }

    function getQuestion() {
        API.get("getPersonalQuestion.php").then(res => {
            setQuestions(res.data.data);
        });
    }

    function getUser() {
        API.get("getUser.php").then(function (response) {
            setUser(response.data);
            setImage(
                `http://localhost/lunaria-backend/profile/${response.data.img}`
            );

        });
    }

    return (
        <section className="space-y-6 bg-bg-dark min-h-screen">
            <div className="bg-bg rounded-3xl shadow-(--shadow-l) p-6 flex flex-col gap-4">
                <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-4'>
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-highlight">
                            <img
                                src={image}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <div className='flex items-center gap-1'>
                                <h1 className="text-2xl font-bold text-text">{user.name}</h1>
                                <h1 className='cursor-pointer group'>
                                    {(user.role === "expert") && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-blue-600">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                    </svg>
                                    }
                                    <span className='group-hover:scale-100 absolute w-auto p-2 m-2 min-w-max left-55 top-25 rounded-md text-text-muted bg-bg-dark text-xs font-bold transition-all duration-100 origin-left scale-0'>verified medical expert</span>
                                </h1>
                            </div>
                            <p className="text-text-muted">{user.email}</p>
                        </div>
                    </div>
                    <Link to="/settings">
                        <button className='cursor-pointer hover:text-highlight text-text-muted'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                        </button>
                    </Link>
                </div>
                <div className="w-full text-left">
                    <p className="text-xs uppercase tracking-wide text-text-muted mb-1">
                        {(user.role === "expert") ?
                            <span>Article Posted: {(articles.length) ? articles.length : "0"}</span> :
                            <span>Question Posted:{(questions.length) ? questions.length : "0"} </span>
                        }
                    </p>
                </div>
            </div>

            {(user.role === "expert") ?

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 m-2">
                    {Array.isArray(articles) && articles.map((article) => (
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
                </div> :
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
            }
        </section>);
}

export default Profile;


