import { Link } from "react-router-dom";

const ArticleCard = ({
    AID,
    image,
    title,
    description,
    date,
    author,
    specialty,
    tags = [],
    likes
}) => (
    <Link to={`/article/${AID}`}>
        <article className="bg-bg rounded-3xl shadow-lg overflow-hidden flex flex-col">
            <img src={image} alt={title} className="h-32 w-full object-cover" />
            <div className="p-4 flex-1 flex flex-col gap-3">
                <p className="text-xs uppercase tracking-wide text-text-muted">{date}</p>
                <h3 className="text-lg font-bold text-highlight">{title}</h3>
                <p className="text-sm text-slate-500 flex-1">{description}</p>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 text-xs rounded-full bg-bg-light text-text-muted"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                    <div>
                        {author} • <span className="text-slate-400">{specialty}</span>
                    </div>
                    <div className="flex items-center gap-1 text-highlight">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        {likes}
                    </div>
                </div>
            </div>
        </article>
    </Link >
);

export default ArticleCard;


