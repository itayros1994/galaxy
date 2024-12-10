import React, { useState, useEffect } from "react";
import { fetchMeteors } from "./api";
import YearAutocomplete from "./components/YearAutocomplete";
import MeteorList from "./components/MeteorList";
import "./App.css";

type Meteor = {
    id: string;
    name: string;
    mass?: string;
    year?: string;
};

const App: React.FC = () => {
    const [meteors, setMeteors] = useState<Meteor[]>([]);
    const [year, setYear] = useState<string | null>(null);
    const [mass, setMass] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 1 >=
            document.documentElement.scrollHeight
        ) {
            if (!loading && hasMore) {
                setPage((prevPage) => prevPage + 1);
            }
        }
    };

    useEffect(() => {
        const getMeteors = async () => {
            setLoading(true);
            try {
                const response = await fetchMeteors({ year, mass, page, limit: 10 });
                const newMeteors = response.data.data;

                setMeteors((prevMeteors) =>
                    page === 1 ? newMeteors : [...prevMeteors, ...newMeteors]
                );
                setHasMore(newMeteors.length > 0);
            } catch (error) {
                console.error("Error fetching meteors:", error);
            } finally {
                setLoading(false);
            }
        };

        getMeteors();
    }, [year, mass, page]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore]);

    return (
        <div className="container">
            <h1>Meteor Search</h1>
            <YearAutocomplete onYearSelect={(year) => { setYear(year); setPage(1); }} />
            <input
                type="number"
                placeholder="Enter minimum mass"
                onChange={(e) => { setMass(Number(e.target.value) || null); setPage(1); }}
            />
            {loading && <p>Loading...</p>}
            <MeteorList meteors={meteors} />
            {!hasMore && <p>No more meteors to load.</p>}
        </div>
    );
};

export default App;
