import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import CommentCard from "../components/commentCard";
import { LoggedinContext } from "../App";

function ArticleDetail() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [isLike, setIsLikes] = useState(false);
    const [likes, setLikes] = useState("");
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const { isLoggedin, setIsLoggedin } = useContext(LoggedinContext);

    useEffect(() => {
        getArticle();
        getLikes();
        getComments();
    }, []);

    function getComments() {
        API.get(`getArticleComment.php?aid=${id}`)
            .then(res => {
                setComments(res.data.data);
            })
            .catch(err => console.error(err));
    }

    function getLikes() {
        API.get(`like.php?aid=${id}`)
            .then(res => {
                setIsLikes(Boolean(res.data.like) && res.data.like !== "false" && res.data.like !== "0");
            })
            .catch(err => console.error(err));
    }

    function getArticle() {
        API.get(`getArticleDetail.php?aid=${id}`)
            .then(res => {
                setArticle(res.data.data);
                setLikes(Number(res.data.data.likes));
            })
            .catch(err => console.error(err));
    }

    if (!article) return <p>Page not Found</p>;

    const submitComment = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post(
                "addComment.php",
                { id, comment }
            );

            if (response.data.status === "success") {
                if (response.data.status === "success") {
                    const newComment = {
                        comment,
                        name: "You",
                        img: "http://localhost/lunaria-backend/profile/default.png",
                        created_at: "Just now"
                    };
                    setComments(prev => [newComment, ...prev]);
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
                "like.php",
                { id }
            );

            if (response.data.status === "success") {
                if (isLike) {
                    console.log("Success! Updating state now...");
                    setIsLikes(false);
                    setLikes(l => l - 1);
                } else {
                    console.log("Success! Updating state now...");
                    setIsLikes(true);
                    setLikes(l => l + 1);
                }
            }

        } catch (error) {
            console.error("FULL ERROR:", error);
            if (error.response) console.log("SERVER DATA:", error.response.data);
        }
    }

    const tags = article.category ? article.category.split(",") : [];

    return (<>
        <div className="bg-bg-dark min-h-screen pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row">
                <div className="md:flex-1">
                    <div className="m-4 bg-bg-light p-2 rounded-2xl flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-highlight">{article.title}</h1>
                        <div className="text-text flex justify-between">
                            <p>{article.author} • <span className="text-slate-400">{article.specialty}</span></p>
                            <p>{article.date}</p>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 text-xs rounded-full bg-bg text-text-muted"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            {isLoggedin ?
                                (<button onClick={handleLike} className="flex cursor-pointer text-highlight">
                                    {isLike ? (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
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
                        <img src={article.image} alt="" className="aspect-video max-h-72 object-cover" />

                        <p className="text-text">{article.description}</p>


                    </div>
                </div>
                <div className="md:flex-1 ">
                    <div className="m-4 bg-bg-light p-2 rounded-2xl flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-highlight">Comment Section</h1>
                        {isLoggedin && <form onSubmit={submitComment} className="w-full">
                            <input type="text" onChange={(e) => { setComment(e.target.value) }} className="w-full text-text border-2 border-text-muted focus:border-highlight outline-none rounded-lg h-10 placeholder:text-text-muted pl-2" placeholder="Write something..." />
                            <button className='mt-4 mb-8 shadow-(--shadow-l) bg-highlight text-text-highlight w-full rounded-xl hover:cursor-pointer hover:bg-highlight/80 p-2'>Post Comment</button>
                        </form>}


                        <div className="flex flex-col gap-4 mb-2">
                            {comments.map((c) => (
                                <CommentCard
                                    key={c.ACID}
                                    img={c.img}
                                    name={c.name}
                                    created_at={c.created_at}
                                    comment={c.comment}
                                />
                            ))}
                        </div>


                    </div>

                </div>
            </div>
        </div>
    </>);

}

export default ArticleDetail