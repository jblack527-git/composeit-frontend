import React, { useEffect, useState } from 'react';

function Scales() {
    const [scales, setScales] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/scales')
            .then(response => response.json())
            .then(data => setScales(data))
            .catch(error => console.error('Error fetching scales:', error));
    }, []);

    return (
        <div>
            <h1>Scales</h1>
            <ul>
                {scales.length > 0 ? (
                    scales.map((scale, index) => <li key={index}>{scale}</li>)
                ) : (
                    <li>No scales found</li>
                )}
            </ul>
        </div>
    );
}

export default Scales;
