import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import CommentCard from "../components/commentCard";
import { LoggedinContext } from "../App";

function QuestionDetail() {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [isHeart, setIsHearts] = useState(false);
    const [likes, setLikes] = useState("");
    const [answer, setAnswer] = useState("");
    const [answers, setAnswers] = useState([]);
    const { isLoggedin, setIsLoggedin } = useContext(LoggedinContext);

    useEffect(() => {
        getQuestion();
        getLikes();
        getAnswers();
    }, []);

    function getAnswers() {
        API.get(`getQuestionAnswer.php?qid=${id}`)
            .then(res => {
                setAnswers(res.data.data);
            })
            .catch(err => console.error(err));
    }

    function getLikes() {
        API.get(`heart.php?qid=${id}`)
            .then(res => {
                setIsHearts(Boolean(res.data.like) && res.data.like !== "false" && res.data.like !== "0");
            })
            .catch(err => console.error(err));
    }

    function getQuestion() {
        API.get(`getQuestionDetail.php?qid=${id}`)
            .then(res => {
                setQuestion(res.data.data);
                setLikes(Number(res.data.data.likes));
            })
            .catch(err => console.error(err));
    }

    if (!question) return <p>Missing Page...</p>;

    const submitAnswer = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post(
                "addAnswer.php",
                { id, answer }
            );

            if (response.data.status === "success") {
                if (response.data.status === "success") {
                    const newAnswer = {
                        answer,
                        name: "You",
                        img: "http://localhost/lunaria-backend/profile/default.png",
                        created_at: "Just now"
                    };
                    setAnswers(prev => [newAnswer, ...prev]);
                }
            }

        } catch (error) {
            console.error("FULL ERROR:", error);
            if (error.response) console.log("SERVER DATA:", error.response.data);
        }
    }

    const handleLike = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post(
                "heart.php",
                { id }
            );
            if (response.data.status === "success") {
                if (isHeart) {
                    console.log("Success! Updating state now...");
                    setIsHearts(false);
                    setLikes(l => l - 1);
                } else {
                    console.log("Success! Updating state now...");
                    setIsHearts(true);
                    setLikes(l => l + 1);
                }
            }

        } catch (error) {
            console.error("FULL ERROR:", error);
            if (error.response) console.log("SERVER DATA:", error.response.data);
        }
    }

    return (<>
        <div className="bg-bg-dark min-h-screen pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row">
                <div className="md:flex-1">
                    <div className="m-4 bg-bg-light p-2 rounded-2xl flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-highlight">{question.title}</h1>
                        <div className="text-text flex justify-between">
                            <p>{question.user} • <span className="text-slate-400">{question.date}</span></p>
                            {isLoggedin ?
                                (<button onClick={handleLike} className="flex cursor-pointer text-highlight">
                                    {isHeart ? (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                                        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                    </svg>
                                    )
                                        : (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                        </svg>)
                                    }
                                    {likes}
                                </button>) : (<div className="flex text-highlight"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>{likes}</div>)
                            }
                        </div>
                        <p className="text-text">{question.description}</p>
                    </div>
                </div>
                <div className="md:flex-1 ">
                    <div className="m-4 bg-bg-light p-2 rounded-2xl flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-highlight">Discussion Section</h1>
                        {isLoggedin && <form onSubmit={submitAnswer} className="w-full">
                            <input type="text" onChange={(e) => { setAnswer(e.target.value) }} className="w-full text-text border-2 border-text-muted focus:border-highlight outline-none rounded-lg h-10 placeholder:text-text-muted pl-2" placeholder="Write an answer or discuss..." />
                            <button className='mt-4 mb-8 shadow-(--shadow-l) bg-highlight text-text-highlight w-full rounded-xl hover:cursor-pointer hover:bg-highlight/80 p-2'>Post Answer</button>
                        </form>}


                        <div className="flex flex-col gap-4 mb-2">
                            {answers?.map((a) => (
                                <CommentCard
                                    key={a.ANID}
                                    img={a.img}
                                    name={a.name}
                                    created_at={a.created_at}
                                    comment={a.answer}
                                />
                            ))}
                        </div>


                    </div>

                </div>
            </div>
        </div>
    </>);

}

export default QuestionDetail