import React, { useState, useEffect } from "react";
import { fetchYears } from "../api";

type YearAutocompleteProps = {
    onYearSelect: (year: string) => void;
};

const YearAutocomplete: React.FC<YearAutocompleteProps> = ({ onYearSelect }) => {
    const [year, setYear] = useState(""); // Current user input
    const [years, setYears] = useState<string[]>([]); // List of years from the server
    const [filteredYears, setFilteredYears] = useState<string[]>([]); // Filtered years for suggestions

    useEffect(() => {
        const getYears = async () => {
            try {
                const response = await fetchYears();
                console.log("Years fetched from server:", response.data.years); // Log the years
                setYears(response.data.years); // Store the years in state
            } catch (error) {
                console.error("Error fetching years:", error);
            }
        };

        getYears();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim(); // Ensure input is trimmed
        setYear(value);

        const suggestions = years.filter(
            (y) => typeof y === "string" && y.startsWith(value)
        );

        console.log("Filtered suggestions:", suggestions); // Log suggestions
        setFilteredYears(suggestions);
    };

    const handleSelect = (selectedYear: string) => {
        console.log("Year selected:", selectedYear); // Log the selected year
        setYear(selectedYear);
        setFilteredYears([]); // Clear suggestions
        onYearSelect(selectedYear); // Notify parent component
    };

    return (
        <div>
            <input
                type="text"
                value={year}
                onChange={handleInputChange}
                placeholder="Enter a year"
            />
            {filteredYears.length > 0 && (
                <ul style={{ border: "1px solid #ccc", marginTop: 0, padding: "5px" }}>
                    {filteredYears.map((y) => (
                        <li
                            key={y}
                            onClick={() => handleSelect(y)}
                            style={{ cursor: "pointer" }}
                        >
                            {y}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default YearAutocomplete;
