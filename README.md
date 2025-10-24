# 🚀 Emoji Space Evaders

A fun, interactive browser-based Space Invaders-style game built with HTML5 Canvas, featuring emoji graphics, synthesized sound effects, and voice announcements.

## 🎮 Game Overview

Emoji Space Evaders is a modern take on the classic Space Invaders arcade game. Defend Earth from waves of emoji aliens using your trusty rocket ship! The game features multiple levels, high score tracking, and engaging audio-visual effects.

### 🌟 Key Features

- **Emoji Graphics**: All game elements use colorful emoji characters
- **Multi-Platform**: Play on desktop browsers or mobile devices (iPhone/Android)
- **Sound Effects**: Synthesized audio using Tone.js library
- **Voice Announcements**: Hear "Next Level", "Game Over", and "New High Score" 
- **Touch Controls**: Full mobile support with on-screen controls
- **High Score System**: Track and save your best performances locally
- **Visual Effects**: Particle explosions, glowing effects, and animated starfield
- **Progressive Difficulty**: Each level brings new challenges

## 🎯 How to Play

### Objective
Destroy all alien invaders before they reach the bottom of the screen or hit your ship.

### Desktop Controls
- **Arrow Keys (←/→)**: Move your ship left and right
- **Spacebar**: Fire projectiles at aliens
- **P**: Pause/unpause the game

### Mobile Controls
Touch the control areas at the bottom of the screen:
- **Left Arrow (◀)**: Move ship left
- **Right Arrow (▶)**: Move ship right  
- **Rocket (🚀)**: Fire projectiles

### Scoring
- **100 points** per alien destroyed
- Advance to the next level by clearing all aliens
- Game ends if aliens reach the bottom or hit your ship

## 🎵 Audio Features

- **Laser Sounds**: Each shot produces a unique synthesized tone
- **Alien Hit Sounds**: Different aliens make different sounds when destroyed:
  - 👾 Space Invader: E5 tone
  - 👽 Alien: F5 tone
  - 🛸 UFO: G5 tone
  - 🤖 Robot: A5 tone
- **Explosion Effects**: Metallic crash sounds for ship destruction
- **Voice Announcements**: Clear audio cues for game state changes

## 🏆 High Score System

- Tracks your top 5 high scores locally
- Records both score and completion time
- Enter your name when achieving a new high score
- Persistent storage using browser localStorage

## 🛠️ Technical Details

### Built With
- **HTML5 Canvas** for game rendering
- **Vanilla JavaScript** for game logic
- **Tone.js** for audio synthesis
- **Web Speech API** for voice announcements
- **CSS** for styling and mobile responsiveness

### Browser Compatibility
- Modern desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile, Samsung Internet)
- Requires JavaScript enabled
- Audio features require user interaction to start

### Performance
- 60 FPS gameplay using requestAnimationFrame
- Efficient particle system for visual effects
- Optimized collision detection
- Responsive design adapts to different screen sizes

## 🚀 Getting Started

1. **Clone or Download**: Get the game files from the repository
2. **Open**: Simply open `index.html` in any modern web browser
3. **Play**: Click anywhere to start audio, then use controls to play
4. **Mobile**: Access via mobile browser for touch controls

### Live Demo
Visit: `https://freestudentaccount-code.github.io/JAIRO_DEMO/`

## 📱 Mobile Installation

### iOS (iPhone/iPad)
1. Open the game in Safari
2. Tap the share button
3. Select "Add to Home Screen"
4. The game will appear as an app icon

### Android
1. Open the game in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home screen"
4. The game will appear as an app icon

## 🎨 Game Elements

### Player Ship
- 🚀 **Rocket Ship**: Your controllable character

### Alien Types
- 👾 **Space Invader**: Classic pixel-style alien
- 👽 **Green Alien**: Traditional UFO occupant  
- 🛸 **Flying Saucer**: Advanced alien vessel
- 🤖 **Robot**: Mechanical invader

### Projectiles
- 💥 **Player Shots**: Red explosion emoji
- 💧 **Alien Shots**: Blue water droplet

### Effects
- ✨ **Stars**: Animated background starfield
- 🔥 **Explosions**: Particle effects on destruction
- 💥 **Impact**: Visual feedback for hits

## 🔧 Development

### File Structure
```
JAIRO_DEMO/
├── index.html          # Main game page
├── style.css           # Styling and layout
├── game.js             # Core game logic
├── README.md           # This documentation
└── CHANGE.md           # Development changelog
```

### Version History
- v1.0.8: Current version with full iOS compatibility
- v1.0.7: Improved mobile audio handling
- v1.0.6: Added audio context fixes
- v1.0.5: Sound effects and voice synthesis
- v1.0.4: Version display and alien collision detection
- Previous versions: Core gameplay and mobile support

## 👥 Authors & Credits

### Primary Developer
- **jasmoone** - Game concept, design, and implementation

### Technologies Used
- **Tone.js** - Audio synthesis library
- **Web APIs** - Canvas, Audio, Speech Synthesis, Local Storage
- **GitHub Pages** - Hosting platform

### Special Thanks
- Classic **Space Invaders** for inspiration
- **Emoji creators** for expressive graphics
- **Open source community** for tools and libraries

## 📄 License

This project is open source and available under the MIT License.

## 🐛 Known Issues & Troubleshooting

### Audio Not Working
- **Solution**: Click or tap the screen once to enable audio
- **iOS**: Make sure device is not in silent mode

### Touch Controls Not Responding (Mobile)
- **Solution**: Try refreshing the page and tapping the control areas
- **iOS**: Ensure you're using Safari or another modern browser

### Game Running Slowly
- **Solution**: Close other browser tabs and applications
- **Mobile**: Ensure sufficient device memory available

### High Scores Not Saving
- **Solution**: Enable localStorage in browser settings
- **Private Mode**: High scores won't persist in incognito/private browsing

## 🎉 Fun Facts

- The game uses over 100 stars in the animated background
- Each alien type has its own unique sound frequency
- Particle explosions use up to 15 individual emoji per explosion
- The starfield creates a parallax scrolling effect
- Voice synthesis works in over 20 languages (browser dependent)

## 🔮 Future Enhancements

Potential features for future versions:
- Power-ups and special weapons
- Multiple difficulty modes
- Online leaderboards
- Additional alien types and boss battles
- Multiplayer support
- Achievement system

---

**Enjoy defending Earth from the emoji invasion! 🛸👾🚀**

*For support or feedback, please create an issue in the GitHub repository.*