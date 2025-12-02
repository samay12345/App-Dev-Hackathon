import { useEffect, useState } from "react";
import { Link } from 'react-router'
import "./home.css";

export default function Home() {
    const [username, setUsername] = useState<string | null>(null);
    const [habits, setHabits] = useState<Array<{id:string,title:string,description:string}>>([]);

    useEffect(() => {
        const name = localStorage.getItem("username");
        setUsername(name);
    }, []);

    const [affirmations, setAffirmations] = useState<string[]>([]);

    // fetch affirmations from backend once
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('http://localhost:8000/affirmations');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) setAffirmations(data);
                }
            } catch (err) {
                console.error('Failed to load affirmations', err);
            }
        })();
    }, []);

    // Use local days since epoch so affirmation changes at local midnight for each user.
    const localMidnight = new Date();
    localMidnight.setHours(0, 0, 0, 0);
    const daysSinceEpochLocal = Math.floor(localMidnight.getTime() / 86400000);
    const todaysAffirmation = affirmations.length ? affirmations[daysSinceEpochLocal % affirmations.length] : "Today is a great day to learn and build something new.";

    // --- Daily habits & streak (per-user) ---
    // Use local date key (YYYY-MM-DD) so habits reset at local midnight.
    const getLocalDateKey = () => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const todayKey = getLocalDateKey();

    const [streak, setStreak] = useState<number>(0);
    const [lastStreakDate, setLastStreakDate] = useState<string | null>(null);
    const [completed, setCompleted] = useState<Record<string, boolean>>({});

    // Load user-specific data once username is known
    useEffect(() => {
        if (!username) return;

        // load habits from backend
        (async () => {
            try {
                const res = await fetch(`http://localhost:8000/habits?username=${encodeURIComponent(username)}`);
                if (res.ok) {
                    const data = await res.json();
                    setHabits(data || []);
                }
            } catch (err) {
                console.error('Failed to fetch habits', err);
            }
        })();

        // load streak and last date for this user
        const s = localStorage.getItem(`streak-${username}`);
        setStreak(s ? Number(s) : 0);
        const lsd = localStorage.getItem(`streakDate-${username}`);
        setLastStreakDate(lsd);

        // load today's completed set for this user
        const raw = localStorage.getItem(`habits-${username}-${todayKey}`);
        if (raw) setCompleted(JSON.parse(raw));
    }, [username, todayKey]);

    // Persist streak and lastStreakDate when they change (per-user)
    useEffect(() => {
        if (!username) return;
        localStorage.setItem(`streak-${username}`, String(streak));
        if (lastStreakDate) localStorage.setItem(`streakDate-${username}`, lastStreakDate);
    }, [streak, lastStreakDate, username]);

    // Persist today's completed set when it changes (per-user)
    useEffect(() => {
        if (!username) return;
        localStorage.setItem(`habits-${username}-${todayKey}`, JSON.stringify(completed));
    }, [completed, todayKey, username]);

    const markHabit = (id: string, value: boolean) => {
        setCompleted(prev => {
            const next = { ...prev, [id]: value };

            const prevCount = Object.values(prev).filter(Boolean).length;
            const nextCount = Object.values(next).filter(Boolean).length;
            if (prevCount === 0 && nextCount > 0) {
                if (lastStreakDate !== todayKey) {
                    setStreak(s => s + 1);
                    setLastStreakDate(todayKey);
                }
            }

            return next;
        });
    };

    const addHabitToBackend = async (title: string, description: string) => {
        if (!username) return;
        try {
            const res = await fetch('http://localhost:8000/habits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, title, description })
            });
            if (res.ok) {
                const data = await res.json();
                // append to local state
                if (data.habit) setHabits(h => [...h, data.habit]);
            } else {
                console.error('Failed to create habit', await res.text());
            }
        } catch (err) {
            console.error(err);
        }
    };

    const onAddHabitClicked = async () => {
        const title = window.prompt('Habit title');
        if (!title) return;
        const description = window.prompt('Description (optional)') || '';
        await addHabitToBackend(title, description);
    };

    return (

            <div className="home-container home-root">
                <div className="home-card">
                    <h1 className="home-heading">Hello{username ? `, ${username}` : ", Guest"}</h1>

                    <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                        <h2 style={{ fontSize: '1rem', margin: 0, fontWeight: 700 }}>Daily Affirmation -</h2>
                        <p className="affirmation" aria-live="polite" style={{ marginTop: '0.5rem' }}>{todaysAffirmation}</p>
                    </div>

                    <div style={{ marginTop: '1rem', textAlign: 'left' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontWeight: 700 }}>Your Daily Habits</div>
                            <div>
                                <button className="btn btn-secondary" onClick={onAddHabitClicked}>Add Habit</button>
                            </div>
                        </div>

                        <div style={{ marginTop: '0.5rem' }}>
                            <div className="streak">Streak: <strong>{streak}</strong></div>

                            <div className="habits-list">
                                {habits.length === 0 && (<div style={{ color: 'rgba(0,0,0,0.6)' }}>You have no habits yet. Add one to get started.</div>)}
                                {habits.map(h => (
                                    <label key={h.id} className="habit-item">
                                        <input type="checkbox" checked={!!completed[h.id]} onChange={(e) => markHabit(h.id, e.target.checked)} />
                                        <span style={{ marginLeft: 8, fontWeight: 600 }}>{h.title}</span>
                                        <div style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)' }}>{h.description}</div>
                                    </label>
                                ))}
                            </div>
                        </div>

                    </div>

                    <div className="sections-grid">
                        <div className="section section-academic">
                            <h3>Academic</h3>
                            <p>A Smart Terp stays on top of their classes</p>
                            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                <Link to="/assignments"><button className="btn btn-primary">Assignments</button></Link>
                                <Link to="/exams"><button className="btn btn-secondary">Exams</button></Link>
                            </div>
                        </div>

                        <div className="section section-health">
                            <h3>Health</h3>
                            <p>A Healthy Terp can balance class with their body wellness</p>
                            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                <Link to="/workouts"><button className="btn btn-primary">Workouts</button></Link>
                                <Link to="/water"><button className="btn btn-secondary">Water Intake</button></Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
    );
}