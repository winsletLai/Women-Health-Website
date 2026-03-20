import { useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

const optionsList = [
    { id: '1', name: 'Nutrition', value: 'Nutrition' },
    { id: '2', name: 'Menopause', value: 'Menopause' },
    { id: '3', name: 'Cycle', value: 'Cycle' },
    { id: '4', name: 'Mental', value: 'Mental' },
    { id: '5', name: 'Pregnancy', value: 'Pregnancy' },
    { id: '6', name: '🔞18+', value: '18+' }
];

function AddArticle() {
    const navigate = useNavigate();

    const [selectedImage, setSelectImage] = useState("");
    const [tags, setTags] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (tags.length > 0) {
            tags.forEach((tag) => {
                formData.append("tags[]", tag);
            });
        }
        formData.append("file", file);

        try {
            const response = await API.post(
                "addArticle.php", formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            setMsg(response.data.message);
            if (response.data.status === "success") {
                setSelectImage("");
                setTitle("");
                setDescription("");
                setTags([]);
                setFile(null);
                setTimeout(() => {
                    navigate("/article");
                }, 1500);
            }
        } catch (error) {
            console.error(error);
        }
    }



    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setTags([...tags, value]);
        } else {
            setTags(tags.filter((item) => item !== value));
        }
    }

    const imageSelector = (e) => {
        const image = e.target.files?.[0];
        setFile(image);
        setSelectImage(image ? URL.createObjectURL(image) : undefined);
    }

    return (
        <section className="space-y-6 bg-bg-dark pb-20 md:pb-0">

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-2/5">
                        <label className="bg-bg rounded-3xl shadow-lg aspect-square flex flex-col items-center justify-center text-highlight gap-3 cursor-pointer">
                            {selectedImage && (<img src={selectedImage} alt="" className='aspect-video max-h-72 object-cover' />)}
                            <div className="w-16 h-16 rounded-full bg-bg-light flex items-center justify-center">
                                <FiUploadCloud size={32} />
                            </div>
                            <p className="font-semibold">Upload cover image</p>
                            <input required type="file" onChange={imageSelector} className='file:hidden w-fit' accept=".jpg, .jpeg, .png, image/jpeg, image/png" />
                        </label>
                    </div>


                    <div className="md:w-3/5 bg-bg rounded-3xl shadow-lg p-5 space-y-4">
                        <label className="block">
                            {msg && (
                                <div className='mb-2 shadow-(--shadow-m) bg-linear-to-br from-highlight to-highlight/60 rounded-2xl p-1'><p className='text-center text-bg text-sm'>{msg}</p></div>
                            )}
                            <span className="text-lg font-semibold text-highlight">Title</span>
                            <input onChange={(e) => { setTitle(e.target.value) }} required type="text" placeholder="Write a headline" className="bg-bg-light placeholder:text-text-muted text-text w-full mt-2 rounded-2xl border-2 border-text-muted/60 px-4 py-3 outline-none focus:border-highlight" />
                        </label>

                        <label className="block">
                            <span className="text-lg font-semibold text-highlight">Description</span>
                            <textarea onChange={(e) => { setDescription(e.target.value) }} required
                                placeholder="Share soothing tips, routines, or expertise..."
                                className="bg-bg-light placeholder:text-text-muted text-text w-full mt-2 h-40 rounded-2xl border-2 border-text-muted/60 px-4 py-3 outline-none focus:border-highlight resize-none overflow-y-auto"
                            />
                        </label>

                        <div className=''>
                            <p className="text-lg font-semibold text-highlight mb-2">Tags</p>
                            <p className='text-text-muted'>Pick your tags accordingly</p>
                            <div className='flex gap-2 flex-wrap'>
                                {optionsList.map((option) => (
                                    <label className='my-2 cursor-pointer' htmlFor={option.id} key={option.id}>
                                        <input
                                            id={option.id}
                                            type="checkbox"
                                            value={option.value}
                                            checked={tags.includes(option.value)}
                                            onChange={handleCheckboxChange}
                                            className='peer hidden'
                                        />
                                        <span className="px-4 py-2 text-text border border-text-muted peer-checked:border-highlight peer-checked:bg-highlight peer-checked:text-text-highlight rounded-full">
                                            {option.name} </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button className="cursor-pointer px-6 py-3 rounded-2xl bg-highlight text-text-highlight font-semibold shadow-md">
                                Post Article
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default AddArticle;


