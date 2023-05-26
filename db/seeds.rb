    Game.destroy_all
    categories = [
      { id: 1, title: "Action" },
      { id: 2, title: "Adventure" },
      { id: 3, title: "Role-Playing" },
      { id: 4, title: "Strategy" },
      { id: 5, title: "Simulation" },
      { id: 6, title: "Sports" },
      { id: 7, title: "Racing" },
      { id: 8, title: "Puzzle" },
      { id: 9, title: "Platformer" },
      { id: 10, title: "Fighting" },
      { id: 11, title: "Shooter" },
      { id: 12, title: "Stealth" },
      { id: 13, title: "Survival" },
      { id: 14, title: "Open World" },
      { id: 15, title: "Sandbox" },
      { id: 16, title: "MMO" },
      { id: 17, title: "RPG Shooter" },
      { id: 18, title: "Tactical" },
      { id: 19, title: "Horror" },
      { id: 20, title: "Educational" }
    ]
    
    # Loop through the categories array and create video game categories
    categories.each do |category|
      Game.create!(id: category[:id], title: category[:title])
    end

