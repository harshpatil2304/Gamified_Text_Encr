import React, { useState } from 'react';

function Achievements() {
  const [achievements, setAchievements] = useState([]);

  const handleAchievementUnlock = () => {
    const unlockedAchievements = unlockAchievements();
    setAchievements(unlockedAchievements);
  };

  const unlockAchievements = () => {
    // Placeholder function for unlocking achievements based on user progress
    const achievementsData = [
      { name: 'Novice', description: 'Complete the first encryption' },
      { name: 'Master', description: 'Complete 10 encryptions' },
    ];
    return achievementsData;
  };

  return (
    <div className="achievements">
      <h2 className="section-title">Achievements</h2>
      {achievements.length > 0 ? (
        <ul className="achievement-list">
          {achievements.map((achievement, index) => (
            <li key={index} className="achievement-item">
              <span className="achievement-name">{achievement.name}</span>
              <span className="achievement-description">{achievement.description}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-achievements">No achievements unlocked</p>
      )}
      <button onClick={handleAchievementUnlock} className="unlock-button">Unlock Achievements</button>
    </div>
  );
}

export default Achievements;
