
const commentCard = ({
    img,
    name,
    created_at,
    comment,
}) => (
    <div className="flex flex-col gap-2 p-2 bg-bg rounded-2xl shadow-(--shadow-l) max-w-157">
        <div className="flex items-center justify-between">
            <span className="flex items-center gap-2">
                <img
                    className="w-10 h-10 object-cover rounded-full"
                    src={img}
                    alt="profile"
                />
                <h1 className="font-bold text-text text-xl">{name}</h1>
            </span>
            <h1 className="text-text">{created_at}</h1>
        </div>

        <p className="text-text wrap-break-word">{comment}</p>

    </div>
);

export default commentCard;


