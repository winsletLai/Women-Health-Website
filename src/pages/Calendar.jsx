import { useContext, useEffect, useState } from "react";
import API from "../api/api";
import { LoggedinContext } from "../App";
import { useNavigate } from "react-router-dom";

function Calendar() {

    const navigate = useNavigate();

    const { isLoggedin, setIsLoggedin } = useContext(LoggedinContext);
    if (!isLoggedin) {
        setTimeout(() => {
            navigate("/login");
        }, 100);
    }

    const currentDate = new Date();
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [showPopUp, setShowPopUp] = useState(false);
    const [inputFlow, setInputFlow] = useState("");
    const [inputNotes, setInputNotes] = useState("");
    const [msg, setMsg] = useState("");
    const [symptoms, setSymptoms] = useState(null);

    const [periodData, setPeriodData] = useState([]);

    useEffect(() => {
        getPeriods();
        getSymptoms();

    }, [currentMonth, currentYear, selectedDate]);


    function getPeriods() {
        API.get("getPeriod.php").then(function (response) {
            setPeriodData(response.data.data);
        });
    }

    function getSymptoms() {
        const formattedDate = formatDate(selectedDate);
        API.get("getSymptoms.php", {
            params: { date: formattedDate }
        }).then(function (response) {
            setSymptoms(response.data.data);

        });
    }

    function getPeriodDays() {
        let days = [];

        periodData.forEach(p => {
            let start = new Date(p.start_date);
            let end = new Date(p.end_date);

            while (start <= end) {
                if (
                    start.getMonth() === currentMonth &&
                    start.getFullYear() === currentYear
                ) {
                    days.push(start.getDate());
                }
                start.setDate(start.getDate() + 1);
            }
        });

        return days;
    }

    function getPredictedDays() {
        let days = [];

        periodData.forEach(p => {
            if (!p.predict_next_period) return;

            let start = new Date(p.predict_next_period);

            for (let i = 0; i < 5; i++) {
                let temp = new Date(start);
                temp.setDate(start.getDate() + i);

                if (
                    temp.getMonth() === currentMonth &&
                    temp.getFullYear() === currentYear
                ) {
                    days.push(temp.getDate());
                }
            }
        });

        return days;
    }

    function getOvulationDays() {
        let days = [];

        periodData.forEach(p => {
            if (!p.predict_ovulation) return;

            let ovu = new Date(p.predict_ovulation);

            for (let i = -1; i <= 1; i++) {
                let temp = new Date(ovu);
                temp.setDate(ovu.getDate() + i);

                if (
                    temp.getMonth() === currentMonth &&
                    temp.getFullYear() === currentYear
                ) {
                    days.push(temp.getDate());
                }
            }
        });

        return days;
    }

    const periods = getPeriodDays();
    const ovulation = getOvulationDays();
    const prediction = getPredictedDays();

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];



    const prevMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
        setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear));
    }

    const nextMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
        setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear));
    }

    const handleDayClick = (day) => {
        const clickedDate = new Date(currentYear, currentMonth, day);
        const today = new Date()

        if (clickedDate <= today) {
            setSelectedDate(clickedDate);
            setShowPopUp(true);
            setInputFlow("");
            setInputNotes("");
        }
    }

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedDate = formatDate(selectedDate);

        try {
            const response = await API.post(
                "addPeriod.php",
                {
                    date: formattedDate,
                    flow: inputFlow,
                    notes: inputNotes
                }
            );
            setMsg(response.data.message);

        } catch (error) {
            console.error(error);
        }
    }

    const handleRadioButton = (e) => {
        setInputFlow(e.target.value);
    }

    return (
        <>
            <div className="min-h-screen bg-bg-dark p-5 pb-20 md:pb-5">
                <div className="rounded-2xl shadow-(--shadow-l) bg-bg flex gap-5 flex-col md:flex-row">
                    <div className="md:w-[40%] max-w-150 m-4">

                        {msg && (
                            <div className='shadow-(--shadow-m) bg-linear-to-br from-highlight to-highlight/60 rounded-2xl mt-4 p-1'><p className='text-center text-bg text-sm'>{msg}</p></div>
                        )}

                        <div className="mb-4 flex items-center justify-between text-xl font-bold text-highlight">
                            <button type="button" onClick={prevMonth} className="rounded-full bg-bg-dark w-8 h-8 cursor-pointer">
                                &lt;
                            </button>
                            <div className="flex gap-2">
                                <h1 className="">{months[currentMonth]}</h1>
                                <h1>{currentYear}</h1>
                            </div>
                            <button type="button" onClick={nextMonth} className="rounded-full bg-bg-dark w-8 h-8 cursor-pointer">
                                &gt;
                            </button>
                        </div>

                        <div className="Weekdays w-full flex flex-wrap text-text-muted uppercase">
                            {weekDays.map((i) => <span key={i} className="w-[calc(100%/7)] text-shadow-2xs flex justify-center items-center">{i}</span>)}

                        </div>

                        <div className="Days w-full flex flex-wrap">
                            {[...Array(firstDayOfMonth).keys()].map((_, index) =>
                                <span key={`empty-${index}`} className="" />
                            )}
                            {[...Array(daysInMonth).keys()].map((day) => (
                                <span key={day + 1}
                                    className={
                                        (day + 1 === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear() ? "current-day" : "") ||
                                        (periods.includes(day + 1) ? "period" : "") ||
                                        (ovulation.includes(day + 1) ? "ovulation" : "") ||
                                        (prediction.includes(day + 1) ? "prediction" : "")
                                    }
                                    onClick={() => handleDayClick(day + 1)}
                                >
                                    {day + 1}
                                </span>))}
                        </div>
                        <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-1">
                                <div className="bg-red-500 w-3 h-5 rounded-full"></div><h1 className="text-text-muted">period</h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="bg-emerald-500 w-3 h-5 rounded-full"></div><h1 className="text-text-muted">fertility window</h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="bg-pink-300 w-3 h-5 rounded-full"></div><h1 className="text-text-muted">predicted period</h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="bg-orange w-3 h-5 rounded-full"></div><h1 className="text-text-muted">today</h1>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-[60%] h-full md:h-50 py-4 sm:py-12">
                        {showPopUp && (

                            <form onSubmit={handleSubmit}>
                                <div className="absolute top-[28%] left-12 bg-bg-light shadow-(--shadow-l) rounded-xl flex flex-col items-center p-2 gap-2 aspect-square md:aspect-3/2 w-100 md:w-[35%] max-w-120">

                                    <h1 className="text-2xl font-bold text-text-muted">Log your First Day of Period</h1>


                                    <div className="flex flex-col w-full items-start mt-6">
                                        <h1 className="text-text font-bold text-xl">Flow:</h1>

                                    </div>
                                    <div className="flex gap-4">
                                        <label htmlFor="mild" className="shadow-(--shadow-m) cursor-pointer aspect-square hover:border-highlight border-bg-dark border-2 flex flex-col items-end bg-bg-dark rounded-2xl text-highlight hover:bg-bg-dark/50">
                                            <input checked={inputFlow === "mild"} required className="accent-highlight" id="mild" type="radio" name="flow" value="mild" onChange={handleRadioButton} />
                                            <div className="flex flex-col w-full items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-bubbles-icon lucide-bubbles size-15">
                                                <path d="M7.001 15.085A1.5 1.5 0 0 1 9 16.5" /><circle cx="18.5" cy="8.5" r="3.5" /><circle cx="7.5" cy="16.5" r="5.5" /><circle cx="7.5" cy="4.5" r="2.5" />
                                            </svg>
                                                <span className="font-bold">Mild</span>
                                            </div>
                                        </label>
                                        <label htmlFor="moderate" className="shadow-(--shadow-m) cursor-pointer aspect-square hover:border-highlight border-bg-dark border-2 flex flex-col items-end bg-bg-dark rounded-2xl text-highlight hover:bg-bg-dark/50">
                                            <input checked={inputFlow === "moderate"} className="accent-highlight" id="moderate" type="radio" name="flow" value="moderate" onChange={handleRadioButton} />
                                            <div className="flex flex-col w-full items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-droplet-icon lucide-droplet size-15"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                                                </svg>
                                                <span className="font-bold">Moderate</span>
                                            </div>
                                        </label>
                                        <label htmlFor="severe" className="shadow-(--shadow-m) cursor-pointer aspect-square hover:border-highlight border-bg-dark border-2 flex flex-col items-end bg-bg-dark rounded-2xl text-highlight hover:bg-bg-dark/50">
                                            <input checked={inputFlow === "severe"} className="accent-highlight" id="severe" type="radio" name="flow" value="severe" onChange={handleRadioButton} />
                                            <div className="flex flex-col w-full items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-droplets-icon lucide-droplets size-15"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" /><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" /></svg>
                                                <span className="font-bold">Severe</span>
                                            </div>
                                        </label>

                                    </div>

                                    <div className="flex gap-2 items-center w-full mt-6">
                                        <h1 className="text-text font-bold text-xl">Notes: </h1>
                                        <textarea value={inputNotes} onChange={(e) => setInputNotes(e.target.value)} className="placeholder:text-text-muted w-[80%] aspect-5/1 bg-bg-dark p-2 rounded-xl shadow-(--shadow-m) text-highlight" placeholder="Eg: cramps..."></textarea>
                                    </div>
                                    <button className='mt-4 mb-8 shadow-(--shadow-l) bg-highlight text-text-highlight w-60 rounded-xl hover:cursor-pointer hover:bg-highlight/80 p-2 transform transition-transform duration-300 hover:scale-110 ease-in-out'>Add</button>
                                    <button type="button" onClick={() => setShowPopUp(false)} className="absolute top-0 right-4 text-2xl text-text cursor-pointer font-bold">x</button>
                                </div>
                            </form>)}

                        <div className="flex flex-col gap-5 mx-2 rounded-2xl h-fit shadow-(--shadow-l) bg-bg-light p-6 mb-8">
                            <div className="">
                                <div className="text-text-muted">Selected Date:</div>
                                <div className="text-highlight text-2xl font-bold">{formatDate(selectedDate)}</div>
                            </div>
                            <div className="bg-bg shadow-(--shadow-m) rounded-xl p-4">
                                <p className="text-text-muted text-lg">Flow:</p>
                                <span className="text-text capitalize text-xl font-semibold">
                                    {!symptoms?.severity ? "No data" : symptoms.severity}
                                </span>
                            </div>
                            <div className="bg-bg shadow-(--shadow-m) rounded-xl p-4">
                                <p className="text-text-muted text-lg">Notes:</p>
                                <span className="text-text capitalize text-xl font-semibold">
                                    {!symptoms?.notes ? "No data" : symptoms.notes}
                                </span>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </>
    )

}

export default Calendar