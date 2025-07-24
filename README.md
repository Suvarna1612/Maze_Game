# 🔐 Lock & Key Maze Game

A modern, interactive maze game built with HTML5 Canvas, featuring a lock and key theme with beautiful animations and effects.

## 🎮 Game Overview

Navigate through procedurally generated mazes using a key to unlock the exit door. Each maze is unique and guaranteed to be solvable, providing endless entertainment across three difficulty levels.

## 🚀 Features

### Core Gameplay
- **Three Difficulty Levels**: Easy (8x8), Medium (12x12), Hard (16x16)
- **Procedural Generation**: Every maze is unique using recursive backtracking algorithm
- **Guaranteed Solvability**: Advanced pathfinding ensures every maze has a solution
- **Move Counter**: Track your progress with step counting
- **Responsive Controls**: Arrow keys or WASD movement

### Visual Effects
- **Lock & Key Theme**: Player represented as a key, destination as a lock
- **Animated Background**: Subtle floating lock and key patterns
- **Gradient Overlays**: Multiple layered gradients for depth
- **Glow Effects**: Dynamic shadows and glowing elements
- **Smooth Transitions**: CSS transitions and animations
- **Victory Celebrations**: Confetti animations and popup messages

### User Experience
- **Loading Animations**: Spinning loader during maze generation
- **Glassmorphism UI**: Modern frosted glass effect containers
- **Responsive Design**: Adapts to different screen sizes
- **Immediate Feedback**: Instant victory notifications
- **Professional Styling**: Clean, modern interface design

## 📚 Libraries & Dependencies

### External Libraries
- **[Canvas Confetti](https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js)**
  - Version: 1.6.0
  - Purpose: Victory celebration animations
  - Features: Customizable particle effects, multiple colors
  - Usage: Launched on game completion with golden/bronze theme

### Core Technologies
- **HTML5**: Game structure and semantic markup
- **CSS3**: Advanced styling and animations
- **JavaScript (ES6+)**: Game logic and maze generation
- **Canvas API**: Maze rendering and graphics

## 🎨 CSS Effects & Animations

### Background Patterns
```css
/* Layered gradient backgrounds */
- Linear gradients (135deg, 45deg, -45deg)
- Repeating patterns with transparency
- Radial gradients for lock/key symbols
- Floating emoji animations
```

### Animation Effects
- **slowFloat**: 40-second emoji movement cycle
- **victoryPop**: Bounce effect for victory messages
- **spin**: Loading spinner rotation
- **Transform transitions**: Hover effects and scaling

### Visual Techniques
- **Backdrop-filter**: Blur effects for glassmorphism
- **Box-shadow**: Layered shadows for depth
- **Border-radius**: Rounded corners throughout
- **Opacity layering**: Subtle overlays and patterns
- **Text gradients**: Gradient text effects on headings

## 🔧 Technical Implementation

### Maze Generation Algorithm
- **Recursive Backtracking**: Creates complex, winding paths
- **Enhanced Randomization**: Multiple randomness layers
- **Path Validation**: Breadth-First Search verification
- **Fallback Generation**: Guaranteed path creation if needed

### Image Handling
- **Preloading System**: Loads `home.png` and `key.png` assets
- **Fallback Graphics**: Colored shapes if images fail to load
- **Responsive Scaling**: Images adapt to cell sizes

### Game State Management
- **Centralized State**: Single `gameState` object
- **Screen Management**: Multiple game screens with transitions
- **Event Handling**: Keyboard input processing
- **Canvas Management**: Dynamic resizing and redrawing

## 📁 File Structure

```
Maze_Game/
├── index.html          # Main HTML structure
├── style.css           # All styling and animations
├── script.js           # Game logic and maze generation
├── home.png           # Lock image asset
├── key.png            # Key image asset
└── README.md          # This documentation
```

## 🎯 Game Features

### Difficulty System
- **Easy (8x8)**: Green button, beginner-friendly
- **Medium (12x12)**: Pink button, balanced challenge  
- **Hard (16x16)**: Blue button, expert level

### Victory System
- **Immediate Feedback**: "🗝️ UNLOCKED! 🔓" popup
- **Detailed Results**: Move count and difficulty completed
- **Celebration Effects**: Golden confetti animation
- **Action Options**: Play again or change difficulty

### Controls
- **Arrow Keys**: Traditional directional movement
- **WASD**: Alternative movement scheme
- **R Key**: Quick restart functionality
- **Mouse**: Button interactions and menu navigation

## 🌟 Advanced Features

### Performance Optimizations
- **Efficient Rendering**: Only redraws when necessary
- **Image Caching**: Preloaded assets for smooth gameplay
- **Optimized Algorithms**: Fast maze generation and pathfinding

### Accessibility
- **High Contrast**: Clear visual distinctions
- **Multiple Input Methods**: Keyboard alternatives
- **Clear Feedback**: Visual and textual confirmations
- **Responsive Design**: Works on various screen sizes

### Code Quality
- **Modular Functions**: Well-organized, reusable code
- **Error Handling**: Graceful fallbacks for missing assets
- **Comments**: Documented code sections
- **ES6+ Features**: Modern JavaScript syntax

## 🎨 Color Scheme

### Primary Colors
- **Gold/Yellow**: `#ffd700`, `#f39c12` (Key theme)
- **Dark Blue**: `#2c3e50`, `#34495e` (Lock theme)
- **White/Light**: `#f8f9fa`, `#ecf0f1` (Backgrounds)

### UI Colors
- **Easy**: Green gradient (`#56ab2f` to `#a8e6cf`)
- **Medium**: Pink gradient (`#f093fb` to `#f5576c`)
- **Hard**: Blue gradient (`#4b6cb7` to `#182848`)

## 🚀 Getting Started

1. **Clone or download** the project files
2. **Ensure assets** (`home.png`, `key.png`) are in the root directory
3. **Open `index.html`** in a modern web browser
4. **Select difficulty** and start playing!

## 🌐 Browser Compatibility

- **Chrome/Edge**: Full support for all features
- **Firefox**: Complete compatibility
- **Safari**: Canvas and CSS3 support required
- **Mobile**: Responsive design works on tablets and phones

## 📄 License

This project is open source and available under the MIT License.

---

**Enjoy solving the mazes and unlocking your way to victory!** 🗝️🔓
