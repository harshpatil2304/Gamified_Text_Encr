import React from 'react';

const Scoreboard = ({ leaderboard, achievements }) => {
  return (
    <div>
      <h2>Leaderboard</h2>
      <ol>
        {leaderboard.map((player, index) => (
          <li key={index}>{`${player.name}: ${player.score}`}</li>
        ))}
      </ol>
      <h2>Achievements</h2>
      <ul>
        {achievements.map((achievement, index) => (
          <li key={index}>{achievement}</li>
        ))}
      </ul>
    </div>
  );
};

export default Scoreboard;
