import { useEffect, useState } from "react";
import API from "../api/api";
import mascot from '../assets/images/mascot.png';

function Assistant() {

    const [inputMessage, setInputMessage] = useState("");

    const [messages, setMessages] = useState([
        { role: "bot", text: "Hello! I'm Luna. How can I help you with your health today?" }
    ]);

    useEffect(() => {
        getLatestChat();
    }, []);

    function getLatestChat() {
        API.get("getChat.php").then(function (response) {
            if (response.data.status === "success") {
                setMessages(response.data.history);
            } else {
                ;
            }
        });
    }



    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMsg = { role: "user", text: inputMessage };
        setMessages((prev) => [...prev, userMsg]);

        const currentInput = inputMessage; // Store it before clearing
        setInputMessage("");

        try {
            const response = await API.post(
                "sendChat.php",
                { inputMessage: currentInput }
            );

            if (response.data && response.data.status === "success") {
                const botMsg = { role: "bot", text: response.data.response };
                setMessages((prev) => [...prev, botMsg]);
            }

        } catch (error) {
            console.error(error);
        }
    }


    return (<>
        <div className="bg-bg-dark md:h-fit flex justify-center">
            <div className="bg-bg w-full h-113 flex flex-col justify-between md:h-fit md:w-120">
                <div className="hidden md:flex gap-1 items-center bg-bg-light px-4 h-18">
                    <img src={mascot} alt="icon" className="w-12 h-12 border-2 border-highlight rounded-full" />
                    <h1 className="text-text text-xl font-bold">Luna- Your smart assistant</h1>
                </div>
                <div className="w-full overflow-y-scroll bg-bg h-112 md:h-100 md:w-120 p-4">
                    {messages.map((m, index) => (
                        <div key={index} className={`flex mb-4 w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-4 shadow-l max-w-[80%] h-fit ${m.role === 'user'
                                ? 'bg-highlight text-text-highlight rounded-l-2xl rounded-tr-2xl'
                                : 'bg-bg-light text-text rounded-r-2xl rounded-tl-2xl'
                                }`}>
                                {m.text}
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSend}>
                    <div className="flex items-center bg-bg-light justify-center px-4 h-18">
                        <input value={inputMessage} type="text" onChange={(e) => setInputMessage(e.target.value)} className="md:w-100 pl-2 text-text w-full rounded-l-xl border-2 border-highlight  h-15 placeholder:text-text-muted" placeholder="Ask a health related question" />
                        <button className="cursor-pointer w-15 flex justify-center rounded-r-xl items-center bg-highlight h-15">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-send-icon lucide-send text-text-highlight"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg>
                        </button>
                    </div>

                </form>

            </div>


        </div>
    </>);

}

export default Assistant;