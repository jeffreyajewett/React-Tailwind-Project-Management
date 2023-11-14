import React from "react";

const StatCard = ({ title, stat }) => {
    return (
        <div className="w-full md:w-1/3 mr-2">
            <div className="bg-black rounded-md p-4">
                <p className="text-white text-sm mb-2">{title}</p>
                <p className="text-white text-3xl font-semibold">{stat}</p>
            </div>
        </div>
    );
};

export default StatCard;