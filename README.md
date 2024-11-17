# Trillion Checkboxes Game

A massive multiplayer checkbox drawing game that supports both single-player and global multiplayer modes. The game features a trillion (1,000,000,000,000) drawable checkboxes in a vast canvas that players can explore and interact with.

## Features

- Infinite canvas with 1 trillion checkboxes
- Two game modes:
  - Play Alone (Single-player)
  - Play with the World (Global multiplayer)
- Real-time multiplayer synchronization
- Smooth canvas navigation with drag-and-drop
- Responsive design that works on different screen sizes

## Installation

1. Make sure you have Node.js installed on your system
2. Clone this repository
3. Install dependencies:
```bash
npm install
```

## Running the Game

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## How to Play

1. Choose your game mode by clicking either "Play Alone" or "Play with the World"
2. Click on checkboxes to toggle them
3. Drag the canvas to explore different areas
4. In multiplayer mode, you'll see other players' actions in real-time

## Technical Details

- Frontend: HTML5 Canvas, JavaScript
- Backend: Node.js, Express
- Real-time Communication: Socket.IO
- Optimized rendering using viewport-based calculations
- Efficient memory management using sparse grid storage
