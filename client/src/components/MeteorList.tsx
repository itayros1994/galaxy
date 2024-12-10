import React from "react";

type Meteor = {
    id: string;
    name: string;
    mass?: string;
    year?: string;
};

type MeteorListProps = {
    meteors: Meteor[];
};

const MeteorList: React.FC<MeteorListProps> = ({ meteors }) => {
    return (
        <ul>
            {meteors.map((meteor) => (
                <li key={meteor.id} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                    <p>
                        <strong>Name:</strong> {meteor.name || "Unknown"}
                    </p>
                    <p>
                        <strong>Mass:</strong> {meteor.mass ? meteor.mass + " g" : "Unknown"}
                    </p>
                    <p>
                        <strong>Year:</strong> {meteor.year ? new Date(meteor.year).getFullYear() : "Unknown"}
                    </p>
                </li>
            ))}
        </ul>
    );
};

export default MeteorList;
