import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        // Placeholder API call to fetch leaderboard data
        const response = await fetch('https://example.com/api/leaderboard');
        const data = await response.json();
        setScores(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchScores();
  }, []);

  return (
    <div className="leaderboard">
      <h2 className="section-title">Leaderboard</h2>
      {scores.length > 0 ? (
        <ul className="score-list">
          {scores.map((score, index) => (
            <li key={index} className="score-item">
              <span className="score-name">{score.name}</span>
              <span className="score-value">{score.score}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-scores">No scores available</p>
      )}
    </div>
  );
}

export default Leaderboard;
