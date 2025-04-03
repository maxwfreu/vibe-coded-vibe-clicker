import { useState, useEffect } from "react";

// Achievement data structure
const ACHIEVEMENTS = {
  // Tier 1 Powerup Achievements
  coffee_10: {
    id: "coffee_10",
    name: "Coffee Addict",
    description: "Own 10 Coffee",
    icon: "☕",
    requirement: { type: "powerup", itemId: "coffee", count: 10 },
    achieved: false,
  },
  coffee_100: {
    id: "coffee_100",
    name: "Coffee Enthusiast",
    description: "Own 100 Coffee",
    icon: "☕",
    requirement: { type: "powerup", itemId: "coffee", count: 100 },
    achieved: false,
  },
  coffee_1000: {
    id: "coffee_1000",
    name: "Coffee Master",
    description: "Own 1000 Coffee",
    icon: "☕",
    requirement: { type: "powerup", itemId: "coffee", count: 1000 },
    achieved: false,
  },
  energy_drink_10: {
    id: "energy_drink_10",
    name: "Energy Boost",
    description: "Own 10 Energy Drinks",
    icon: "🥤",
    requirement: { type: "powerup", itemId: "energy_drink", count: 10 },
    achieved: false,
  },
  energy_drink_100: {
    id: "energy_drink_100",
    name: "Energy Surge",
    description: "Own 100 Energy Drinks",
    icon: "🥤",
    requirement: { type: "powerup", itemId: "energy_drink", count: 100 },
    achieved: false,
  },
  energy_drink_1000: {
    id: "energy_drink_1000",
    name: "Energy Overload",
    description: "Own 1000 Energy Drinks",
    icon: "🥤",
    requirement: { type: "powerup", itemId: "energy_drink", count: 1000 },
    achieved: false,
  },
  coding_bootcamp_10: {
    id: "coding_bootcamp_10",
    name: "Bootcamp Graduate",
    description: "Own 10 Coding Bootcamps",
    icon: "👨‍💻",
    requirement: { type: "powerup", itemId: "coding_bootcamp", count: 10 },
    achieved: false,
  },
  coding_bootcamp_100: {
    id: "coding_bootcamp_100",
    name: "Bootcamp Instructor",
    description: "Own 100 Coding Bootcamps",
    icon: "👨‍💻",
    requirement: { type: "powerup", itemId: "coding_bootcamp", count: 100 },
    achieved: false,
  },
  coding_bootcamp_1000: {
    id: "coding_bootcamp_1000",
    name: "Bootcamp Empire",
    description: "Own 1000 Coding Bootcamps",
    icon: "👨‍💻",
    requirement: { type: "powerup", itemId: "coding_bootcamp", count: 1000 },
    achieved: false,
  },

  // Tier 2 Powerup Achievements
  new_laptop_10: {
    id: "new_laptop_10",
    name: "Tech Enthusiast",
    description: "Own 10 New Laptops",
    icon: "💻",
    requirement: { type: "powerup", itemId: "new_laptop", count: 10 },
    achieved: false,
  },
  new_laptop_100: {
    id: "new_laptop_100",
    name: "Tech Collector",
    description: "Own 100 New Laptops",
    icon: "💻",
    requirement: { type: "powerup", itemId: "new_laptop", count: 100 },
    achieved: false,
  },
  new_laptop_1000: {
    id: "new_laptop_1000",
    name: "Tech Empire",
    description: "Own 1000 New Laptops",
    icon: "💻",
    requirement: { type: "powerup", itemId: "new_laptop", count: 1000 },
    achieved: false,
  },
  standing_desk_10: {
    id: "standing_desk_10",
    name: "Ergonomics Beginner",
    description: "Own 10 Standing Desks",
    icon: "🪑",
    requirement: { type: "powerup", itemId: "standing_desk", count: 10 },
    achieved: false,
  },
  standing_desk_100: {
    id: "standing_desk_100",
    name: "Ergonomics Expert",
    description: "Own 100 Standing Desks",
    icon: "🪑",
    requirement: { type: "powerup", itemId: "standing_desk", count: 100 },
    achieved: false,
  },
  standing_desk_1000: {
    id: "standing_desk_1000",
    name: "Ergonomics Master",
    description: "Own 1000 Standing Desks",
    icon: "🪑",
    requirement: { type: "powerup", itemId: "standing_desk", count: 1000 },
    achieved: false,
  },
  ergonomic_chair_10: {
    id: "ergonomic_chair_10",
    name: "Comfort Seeker",
    description: "Own 10 Ergonomic Chairs",
    icon: "🪑",
    requirement: { type: "powerup", itemId: "ergonomic_chair", count: 10 },
    achieved: false,
  },
  ergonomic_chair_100: {
    id: "ergonomic_chair_100",
    name: "Comfort Enthusiast",
    description: "Own 100 Ergonomic Chairs",
    icon: "🪑",
    requirement: { type: "powerup", itemId: "ergonomic_chair", count: 100 },
    achieved: false,
  },
  ergonomic_chair_1000: {
    id: "ergonomic_chair_1000",
    name: "Comfort Master",
    description: "Own 1000 Ergonomic Chairs",
    icon: "🪑",
    requirement: { type: "powerup", itemId: "ergonomic_chair", count: 1000 },
    achieved: false,
  },

  // Tier 3 Powerup Achievements
  home_office_10: {
    id: "home_office_10",
    name: "Remote Worker",
    description: "Own 10 Home Offices",
    icon: "🏠",
    requirement: { type: "powerup", itemId: "home_office", count: 10 },
    achieved: false,
  },
  home_office_100: {
    id: "home_office_100",
    name: "Remote Manager",
    description: "Own 100 Home Offices",
    icon: "🏠",
    requirement: { type: "powerup", itemId: "home_office", count: 100 },
    achieved: false,
  },
  home_office_1000: {
    id: "home_office_1000",
    name: "Remote Empire",
    description: "Own 1000 Home Offices",
    icon: "🏠",
    requirement: { type: "powerup", itemId: "home_office", count: 1000 },
    achieved: false,
  },
  coding_workshop_10: {
    id: "coding_workshop_10",
    name: "Workshop Organizer",
    description: "Own 10 Coding Workshops",
    icon: "👨‍🏫",
    requirement: { type: "powerup", itemId: "coding_workshop", count: 10 },
    achieved: false,
  },
  coding_workshop_100: {
    id: "coding_workshop_100",
    name: "Workshop Director",
    description: "Own 100 Coding Workshops",
    icon: "👨‍🏫",
    requirement: { type: "powerup", itemId: "coding_workshop", count: 100 },
    achieved: false,
  },
  coding_workshop_1000: {
    id: "coding_workshop_1000",
    name: "Workshop Empire",
    description: "Own 1000 Coding Workshops",
    icon: "👨‍🏫",
    requirement: { type: "powerup", itemId: "coding_workshop", count: 1000 },
    achieved: false,
  },
  tech_startup_10: {
    id: "tech_startup_10",
    name: "Startup Founder",
    description: "Own 10 Tech Startups",
    icon: "🚀",
    requirement: { type: "powerup", itemId: "tech_startup", count: 10 },
    achieved: false,
  },
  tech_startup_100: {
    id: "tech_startup_100",
    name: "Startup CEO",
    description: "Own 100 Tech Startups",
    icon: "🚀",
    requirement: { type: "powerup", itemId: "tech_startup", count: 100 },
    achieved: false,
  },
  tech_startup_1000: {
    id: "tech_startup_1000",
    name: "Startup Empire",
    description: "Own 1000 Tech Startups",
    icon: "🚀",
    requirement: { type: "powerup", itemId: "tech_startup", count: 1000 },
    achieved: false,
  },

  // AI Agent Achievements
  ai_agent_10: {
    id: "ai_agent_10",
    name: "AI Assistant",
    description: "Own 10 AI Agents",
    icon: "🤖",
    requirement: { type: "ai_agent", count: 10 },
    achieved: false,
  },
  ai_agent_100: {
    id: "ai_agent_100",
    name: "AI Manager",
    description: "Own 100 AI Agents",
    icon: "🤖",
    requirement: { type: "ai_agent", count: 100 },
    achieved: false,
  },
  ai_agent_1000: {
    id: "ai_agent_1000",
    name: "AI Empire",
    description: "Own 1000 AI Agents",
    icon: "🤖",
    requirement: { type: "ai_agent", count: 1000 },
    achieved: false,
  },

  // Vibe Producer Achievements
  intern_10: {
    id: "intern_10",
    name: "Internship Program",
    description: "Own 10 Vibe Coder Interns",
    icon: "👨‍💻",
    requirement: { type: "producer", itemId: "intern", count: 10 },
    achieved: false,
  },
  intern_100: {
    id: "intern_100",
    name: "Internship Department",
    description: "Own 100 Vibe Coder Interns",
    icon: "👨‍💻",
    requirement: { type: "producer", itemId: "intern", count: 100 },
    achieved: false,
  },
  intern_1000: {
    id: "intern_1000",
    name: "Internship Empire",
    description: "Own 1000 Vibe Coder Interns",
    icon: "👨‍💻",
    requirement: { type: "producer", itemId: "intern", count: 1000 },
    achieved: false,
  },
  junior_dev_10: {
    id: "junior_dev_10",
    name: "Junior Team",
    description: "Own 10 Junior Vibe Developers",
    icon: "👨‍💻",
    requirement: { type: "producer", itemId: "junior_dev", count: 10 },
    achieved: false,
  },
  junior_dev_100: {
    id: "junior_dev_100",
    name: "Junior Department",
    description: "Own 100 Junior Vibe Developers",
    icon: "👨‍💻",
    requirement: { type: "producer", itemId: "junior_dev", count: 100 },
    achieved: false,
  },
  junior_dev_1000: {
    id: "junior_dev_1000",
    name: "Junior Empire",
    description: "Own 1000 Junior Vibe Developers",
    icon: "👨‍💻",
    requirement: { type: "producer", itemId: "junior_dev", count: 1000 },
    achieved: false,
  },
  senior_dev_10: {
    id: "senior_dev_10",
    name: "Senior Team",
    description: "Own 10 Senior Vibe Developers",
    icon: "👨‍💻",
    requirement: { type: "producer", itemId: "senior_dev", count: 10 },
    achieved: false,
  },
  senior_dev_100: {
    id: "senior_dev_100",
    name: "Senior Department",
    description: "Own 100 Senior Vibe Developers",
    icon: "👨‍💻",
    requirement: { type: "producer", itemId: "senior_dev", count: 100 },
    achieved: false,
  },
  senior_dev_1000: {
    id: "senior_dev_1000",
    name: "Senior Empire",
    description: "Own 1000 Senior Vibe Developers",
    icon: "👨‍💻",
    requirement: { type: "producer", itemId: "senior_dev", count: 1000 },
    achieved: false,
  },
  tech_lead_10: {
    id: "tech_lead_10",
    name: "Tech Leadership",
    description: "Own 10 Vibe Tech Leads",
    icon: "👨‍💼",
    requirement: { type: "producer", itemId: "tech_lead", count: 10 },
    achieved: false,
  },
  tech_lead_100: {
    id: "tech_lead_100",
    name: "Tech Management",
    description: "Own 100 Vibe Tech Leads",
    icon: "👨‍💼",
    requirement: { type: "producer", itemId: "tech_lead", count: 100 },
    achieved: false,
  },
  tech_lead_1000: {
    id: "tech_lead_1000",
    name: "Tech Empire",
    description: "Own 1000 Vibe Tech Leads",
    icon: "👨‍💼",
    requirement: { type: "producer", itemId: "tech_lead", count: 1000 },
    achieved: false,
  },
};

function Achievements({ powerups, aiAgent, vibeProducers }) {
  const [achievements, setAchievements] = useState(ACHIEVEMENTS);
  const [showTooltip, setShowTooltip] = useState(null);

  // Check achievements whenever powerups, aiAgent, or vibeProducers change
  useEffect(() => {
    const updatedAchievements = { ...achievements };
    let hasChanges = false;

    // Check powerup achievements
    Object.values(achievements).forEach((achievement) => {
      if (achievement.requirement.type === "powerup") {
        const powerup = powerups.find(
          (p) => p.id === achievement.requirement.itemId
        );
        if (
          powerup &&
          powerup.count >= achievement.requirement.count &&
          !achievement.achieved
        ) {
          updatedAchievements[achievement.id].achieved = true;
          hasChanges = true;
        }
      }
    });

    // Check AI Agent achievements
    Object.values(achievements).forEach((achievement) => {
      if (
        achievement.requirement.type === "ai_agent" &&
        aiAgent.count >= achievement.requirement.count &&
        !achievement.achieved
      ) {
        updatedAchievements[achievement.id].achieved = true;
        hasChanges = true;
      }
    });

    // Check Vibe Producer achievements
    Object.values(achievements).forEach((achievement) => {
      if (achievement.requirement.type === "producer") {
        const producer = vibeProducers.find(
          (p) => p.id === achievement.requirement.itemId
        );
        if (
          producer &&
          producer.count >= achievement.requirement.count &&
          !achievement.achieved
        ) {
          updatedAchievements[achievement.id].achieved = true;
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setAchievements(updatedAchievements);
    }
  }, [powerups, aiAgent, vibeProducers]);

  // Calculate total achievements and achieved count
  const totalAchievements = Object.keys(achievements).length;
  const achievedCount = Object.values(achievements).filter(
    (a) => a.achieved
  ).length;

  return (
    <div className="mt-12 w-full max-w-4xl bg-gray-800 bg-opacity-50 p-6 rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Achievements</h2>
      <p className="text-sm mb-4 text-gray-300 text-center">
        {achievedCount} / {totalAchievements} Achievements Unlocked
      </p>

      <div className="grid grid-cols-8 gap-2">
        {Object.values(achievements).map((achievement) => (
          <div
            key={achievement.id}
            onMouseEnter={() => setShowTooltip(achievement.id)}
            onMouseLeave={() => setShowTooltip(null)}
            className={`relative rounded-lg transition-all duration-300 cursor-pointer`}
          >
            <div
              className={`${
                achievement.achieved ? "bg-pink-500" : "bg-gray-900 opacity-50"
              } transition-all duration-300 cursor-pointer p-2 rounded-lg`}
            >
              <div className="text-2xl text-center">{achievement.icon}</div>
            </div>
            {showTooltip === achievement.id && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-900 rounded-lg shadow-lg z-10 whitespace-nowrap">
                <p className="font-bold">{achievement.name}</p>
                <p className="text-sm">{achievement.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;
