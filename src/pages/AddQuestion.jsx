import { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

function AddQuestion() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [anon, setAnon] = useState(false);
    const [msg, setMsg] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post(
                "addQuestion.php",
                { title, description, anon }
            );
            setMsg(response.data.message);
            if (response.data.status === "success") {
                setTitle("");
                setDescription("");
                setAnon(false);
                setTimeout(() => {
                    navigate("/community");
                }, 1500);
            }
        } catch (error) {
            console.error("FULL ERROR:", error);
            if (error.response) console.log("SERVER DATA:", error.response.data);
        }
    }

    return (
        <section className="space-y-6 flex justify-center min-h-screen bg-bg-dark pb-20 md:pb-0">
            <div className="w-full md:w-120 bg-bg rounded-3xl shadow-lg p-5 space-y-4">
                <form onSubmit={handleSubmit}>
                    <label className="block">
                        {msg && (
                            <div className='mb-2 shadow-(--shadow-m) bg-linear-to-br from-highlight to-highlight/60 rounded-2xl p-1'><p className='text-center text-bg text-sm'>{msg}</p></div>
                        )}
                        <span className="text-lg font-semibold text-highlight">Title</span>
                        <input onChange={(e) => { setTitle(e.target.value) }} required type="text" placeholder="Write a concise title for your question" className="bg-bg-light placeholder:text-text-muted text-text w-full mt-2 rounded-2xl border-2 border-text-muted/60 px-4 py-3 outline-none focus:border-highlight" />
                    </label>

                    <label className="block my-2">
                        <span className="text-lg font-semibold text-highlight">Description</span>
                        <textarea onChange={(e) => { setDescription(e.target.value) }} required
                            placeholder="Share your experience, troubles or any questions about your health..."
                            className="bg-bg-light placeholder:text-text-muted text-text w-full mt-2 h-40 rounded-2xl border-2 border-text-muted/60 px-4 py-3 outline-none focus:border-highlight resize-none overflow-y-auto"
                        />
                    </label>

                    <div className=''>
                        <p className="text-lg font-semibold text-highlight mb-2">Anonymous</p>
                        <p className='text-text-muted'>Don't show your identity to others?</p>

                        <button type='button'
                            onClick={() => setAnon(prev => !prev)}
                            className={`my-4 cursor-pointer px-4 py-2 rounded-full border text-text ${anon ? "bg-highlight border-highlight" : "bg-transparent border-text-muted"
                                }`} >
                            Don't show
                        </button>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button className="cursor-pointer px-6 py-3 rounded-2xl bg-highlight text-text-highlight font-semibold shadow-md">
                            Post Question
                        </button>
                    </div>
                </form>
            </div>
        </section >
    );
};

export default AddQuestion;


