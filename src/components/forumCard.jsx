import { FiHeart, FiMessageCircle } from 'react-icons/fi';
import { Link } from "react-router-dom";

const forumCard = ({
    QID,
    title,
    description,
    user,
    likes,
    time,
    answers
}) => (
    <Link to={`/question/${QID}`}>
        <div className="bg-bg rounded-3xl shadow-(--shadow-l) p-5 flex flex-col gap-3">
            <h3 className="text-lg font-bold text-highlight">{title}</h3>
            <p className="text-sm text-slate-500">{description}</p>
            <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-slate-400">
                    {user} • {time}
                </div>
                <div className="flex items-center gap-4 text-sm font-semibold text-slate-500">
                    <span className="flex items-center gap-1 text-highlight">
                        <FiHeart /> {likes}
                    </span>
                    <span className="flex items-center gap-1 text-blue-500">
                        <FiMessageCircle /> {answers} answers
                    </span>
                </div>

            </div>
        </div>
    </Link>
);

export default forumCard;


