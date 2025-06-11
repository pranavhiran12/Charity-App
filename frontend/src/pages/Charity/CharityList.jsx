import React, { useEffect, useState } from "react";
import axios from "axios";
import CharityCard from "./CharityCard";

export default function CharityList({ onCharitySelect }) {
    const [charities, setCharities] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchCharities = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/charities");
                setCharities(response.data);
            } catch (error) {
                console.error("Failed to fetch charities:", error);
            }
        };
        fetchCharities();
    }, []);

    const filtered = charities.filter((charity) =>
        charity.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <input
                type="text"
                placeholder="Search charities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border rounded shadow mb-6"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filtered.map((charity) => (
                    <CharityCard
                        key={charity._id}
                        charity={charity}
                        onSelect={onCharitySelect}
                    />
                ))}
            </div>
        </div>
    );
}
