import { useContext, useEffect, useState } from "react";
import API from "../api/api";
import { LoggedinContext } from "../App";
import hero from "../assets/images/hero.jpg";
import track from "../assets/images/track.jpg";
import community from "../assets/images/community.jpg";
import resources from "../assets/images/resources.jpg";
import mascot from '../assets/images/mascot.png';
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

const tips = {
    "Period": "Red Sea Incoming Meow! Remember to change your menstrual products regularly. 🙀",
    "Follicular": "Energy maximized today! Let's try out some new activites together. 😻",
    "Ovulation": "Luna will be watching you today, make sure to eat nutrient-dense foods, no skipping meals, (P/S:It's also the best time for conceiving). 😽",
    "Luteal": "Feeling tired today? Let's reduce exercise intensity, and remember to proritize 7-9 hours of sleep. 😽",
    "Predicted Period": "How are you feeling? Has it arrived. It's okay to take a break if you're feeling tired. I can be your heating pad. 😼"
};


function Home() {

    const { isLoggedin, setIsLoggedin } = useContext(LoggedinContext);
    const [cycle, setCycle] = useState(null);

    useEffect(() => {
        getLatestPeriod();
    }, []);

    function getLatestPeriod() {
        API.get("home.php").then(function (response) {
            if (response.data.status === "success") {
                setCycle(response.data.data);
            } else {
                setCycle(null);
            }
        });
    }

    function calculatePhaseNormalness(cycle) {
        if (!cycle) {
            return [
                { title: 'Previous cycle length', value: 'No Data', status: '' },
                { title: 'Previous period length', value: 'No Data', status: '' }
            ]
        } else {

            const start = new Date(cycle.start_date);
            const end = new Date(cycle.end_date);
            const day = 1000 * 60 * 60 * 24;
            const period_length = Math.max(0, Math.ceil((end - start) / day) + 1);

            let cycle_status = "";
            let period_status = "";

            if (cycle.cycle_length <= 21 || cycle.cycle_length >= 35) {
                cycle_status = "⚠️ Abnormal";
            } else {
                cycle_status = "✅ Normal";
            }

            if (cycle.period_length <= 1 || cycle.period_length >= 8) {
                period_status = "⚠️ Abnormal";
            } else {
                period_status = "✅ Normal";
            }


            return [
                { title: 'Previous cycle length', value: cycle.cycle_length, status: cycle_status },
                { title: 'Previous period length', value: period_length, status: period_status }
            ]
        }

    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function calculateCyclePhases(cycle) {
        if (!cycle) return { labels: [], data: [] };

        const start = new Date(cycle.start_date);
        const end = new Date(cycle.end_date);
        const next = new Date(cycle.predict_next_period);
        const ovulation = new Date(cycle.predict_ovulation);

        const day = 1000 * 60 * 60 * 24;

        const periodDays = Math.max(0, Math.ceil((end - start) / day) + 1);
        const follicularDays = Math.max(0, Math.ceil((ovulation - end) / day));
        const ovulationDays = 1;
        const lutealDays = Math.max(0, Math.ceil((next - ovulation) / day));
        const predictedDays = 5;

        const follicularEnd = new Date(ovulation);
        follicularEnd.setDate(ovulation.getDate() - 1);
        const follicularStart = new Date(end);
        follicularStart.setDate(end.getDate() + 1);

        const lutealStart = new Date(ovulation);
        lutealStart.setDate(ovulation.getDate() + 1);
        const lutealEnd = new Date(next);
        lutealEnd.setDate(next.getDate() - 1);

        const predictionEnd = new Date(next);
        predictionEnd.setDate(next.getDate() + predictedDays);

        const periodLabel = "Period " + cycle.start_date + ", " + cycle.end_date;
        const follicularLabel = "Follicular " + formatDate(follicularStart) + ", " + formatDate(follicularEnd);
        const ovulationLabel = "Ovulation " + cycle.predict_ovulation;
        const lutealLabel = "Luteal " + formatDate(lutealStart) + ", " + formatDate(lutealEnd);
        const predictionLabel = "Prediction " + cycle.predict_next_period + ", " + formatDate(predictionEnd);

        return {
            labels: [periodLabel, follicularLabel, ovulationLabel, lutealLabel, predictionLabel],
            data: [periodDays, follicularDays, ovulationDays, lutealDays, predictedDays]
        };
    }

    function getCurrentPhase(cycle) {
        if (!cycle) return "No Data";

        const today = new Date();

        const start = new Date(cycle.start_date);
        const end = new Date(cycle.end_date);
        const ovulation = new Date(cycle.predict_ovulation);
        const next = new Date(cycle.predict_next_period);

        if (today >= start && today <= end) return "Period";

        if (today > end && today < ovulation) return "Follicular";

        if (today.toDateString() === ovulation.toDateString()) return "Ovulation";

        if (today > ovulation && today < next) return "Luteal";

        if (today >= next) return "Predicted Period";

        return "Unknown";
    }

    function CycleChart() {
        if (!cycle) {
            return <p className="text-text-muted"> ✨ Let's Start Tracking in the Calendar!</p>;
        }

        const { labels, data } = calculateCyclePhases(cycle);

        const chartData = {
            labels,
            datasets: [{
                data,
                backgroundColor: [
                    "#ff6384",
                    "#36a2eb",
                    "#ffcd56",
                    "#4bc0c0",
                    "#9966ff"
                ], hoverOffset: 16
            }]
        };

        const centerTextPlugin = {
            id: "centerText",
            beforeDraw(chart, args, options) {
                const { width, height, ctx } = chart;

                ctx.restore();

                ctx.font = "20px bold sans-serif";
                ctx.textAlign = "center";
                ctx.fillStyle = '#90a1b9';

                ctx.fillText(options.date, width / 2, height / 2);
                ctx.save();

                ctx.restore();
                ctx.font = "32px bold sans-serif";
                ctx.textAlign = "center";
                ctx.fillStyle = 'tomato';

                ctx.fillText(options.phase, width / 2, height / 2 + 35);
                ctx.save();

            }
        };

        return <Doughnut
            data={chartData}
            plugins={[centerTextPlugin]}
            options={{
                plugins: {
                    centerText: {
                        date: new Date().toLocaleDateString(),
                        phase: getCurrentPhase(cycle)
                    }
                }
            }}
        />;
    }

    const tip = tips[getCurrentPhase(cycle)] || "Remember to stay hydrated! Luna wants to see you exercise well, eat well, play well and sleep well.😸";



    return (
        <>

            <div className="bg-bg-dark min-h-screen pt-4 px-4 pb-20 md:pb-0 ">


                {(isLoggedin ? <div className="flex flex-col gap-8 md:flex-row justify-center">
                    <div className="flex flex-col gap-8">
                        <div className="w-full md:w-120 flex flex-col py-4 items-center gap-2 bg-radial from-soft/20 to-bg-light bg-bg-light rounded-2xl shadow-(--shadow-l)">
                            <CycleChart />
                        </div>
                        <div className="flex w-full gap-2">
                            <img src={mascot} alt="" className="w-25" />
                            <div className="bg-bg shadow-(--shadow-s) rounded-2xl p-2 md:w-70 w-full rounded-bl-none ">
                                <h1 className="text-highlight font-bold">✨Today's Tips</h1>
                                <p className="text-text-muted text-sm">
                                    {tip}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-bg rounded-2xl p-2 md:w-100 w-full flex flex-col gap-4">
                        <h1 className='font-bold text-3xl text-highlight mt-4'>My Cycles</h1>
                        {calculatePhaseNormalness(cycle).map((item) => (<div key={item.title}>
                            <div className="bg-bg-light rounded-2xl shadow-(--shadow-l) p-4 w-full flex flex-col gap-2">
                                <p className="text-sm text-text-muted">{item.title}</p>
                                <div className='flex justify-between items-center w-full'>
                                    <p className="text-2xl font-bold text-highlight">{item.value}</p>
                                    <p className="uppercase text-md font-semibold text-text">{item.status}</p>
                                </div>
                            </div>
                        </div>))}
                    </div>
                </div>
                    : <div>
                        <section>
                            <div style={{ backgroundImage: `url('${hero}')` }} className="bg-no-repeat bg-cover">
                                <div className="max-w-screen bg-radial from-[#D7A790] to-white/50 h-90 flex justify-between overflow-hidden">
                                    <div className="sm:flex-2">
                                        <p className="text-center mt-20 text-black text-2xl flex flex-col items-center">
                                            <span className="">
                                                <span className="text-highlight text-9xl">83%</span>
                                                <span className="text-rose-900 text-5xl ml-2">of</span>
                                            </span>
                                            woman finds information on menstrual wellbeing lacking
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        <section className="mb-20 md:mb-0">
                            <div className="min-h-80 text-center">
                                <h1 className="mt-4 text-highlight text-3xl font-semibold">How can Lunaria Help?</h1>
                                <div className="my-2 flex justify-center flex-col sm:flex-row gap-6 md:gap-12 px-2">
                                    <div className="flex gap-2 sm:flex-col sm:h-auto sm:w-50 rounded-2xl shadow-(--shadow-l) bg-radial from-soft to-bg-light h-50">
                                        <img src={track} alt="" className="h-50 w-43 rounded-l-2xl sm:h-40 sm:w-50 sm:rounded-t-2xl sm:rounded-bl-none" />
                                        <div className="flex flex-col gap-4">
                                            <h1 className="text-highlight font-bold text-xl mt-2"><span className="bg-bg-dark py-1 px-2 rounded-xl shadow-(--shadow-m)">Track Your Cycle</span></h1>
                                            <p className="text-left sm:ml-2 text-text mb-2">Tracking your menstrual cycle is vital for understanding your body's patterns, and managing reproductive health</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 sm:flex-col sm:h-auto sm:w-50 rounded-2xl shadow-(--shadow-l) bg-radial from-soft to-bg-light h-50">
                                        <img src={community} alt="" className="h-50 w-43 rounded-l-2xl sm:h-40 sm:w-50 sm:rounded-t-2xl sm:rounded-bl-none" />
                                        <div className="flex flex-col gap-4">
                                            <h1 className="text-highlight font-bold text-xl mt-2"><span className="bg-bg-dark py-1 px-2 rounded-xl shadow-(--shadow-m) whitespace-nowrap">Support</span></h1>
                                            <p className="text-left sm:ml-2 text-text">Our community forum offers informational and emotional support from peers and verified medical experts</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 sm:flex-col sm:h-auto sm:w-50 rounded-2xl shadow-(--shadow-l) bg-radial from-soft to-bg-light h-50">
                                        <img src={resources} alt="" className="h-50 w-43 rounded-l-2xl sm:h-40 sm:w-50 sm:rounded-t-2xl sm:rounded-bl-none" />
                                        <div className="flex flex-col gap-4">
                                            <h1 className="text-highlight font-bold text-xl mt-2"><span className="bg-bg-dark py-1 px-2 rounded-xl shadow-(--shadow-m)">Resources</span></h1>
                                            <p className="text-left sm:ml-2 text-text">There's are several resources and health tips posted by medical experts on this website</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>)}
            </div >
        </>);
}

export default Home;