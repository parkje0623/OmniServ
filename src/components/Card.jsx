import React from "react";

function Card({ title, value }) {
    return (
        <div className="card-data data">
            <h2>{value}</h2>
            <h4>{title}</h4>
        </div>
    );
}

export default Card;