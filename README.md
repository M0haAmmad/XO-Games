# 🎮 Neon Trivia XO

A futuristic, cyber-themed Tic-Tac-Toe game with a trivia security-check twist, built using vanilla HTML5, CSS3, and JavaScript.

---

## 🚀 Concept & Gameplay

**Neon Trivia XO** takes the classic game of Tic-Tac-Toe (XO) and updates it with retro-futuristic arcade aesthetics and a mind-bending trivia mechanic. 

In this game, players cannot claim a cell just by clicking on it. Every move requires passing a **Security Check**—answering a trivia question correctly from one of three categories:
- 🌌 **Space**
- 💻 **Coding**
- 📜 **History**

If you answer correctly, you secure the cell with your symbol. If you answer incorrectly, you are greeted with **ACCESS DENIED**, your turn is forfeit, and play passes to your opponent.

---

## ✨ Features

- **Double-Layer Strategy**: Combine Tic-Tac-Toe positioning tactics with general knowledge prowess.
- **Dynamic Synthesized Audio**: Real-time sound effects generated directly via the browser's **Web Audio API** (no large audio assets to load). Includes a global mute control.
- **Vibrant Cyberpunk Visuals**: Beautiful neon glow styles, responsive layouts, sleek animations (shake effect on defeat, victory popups), and a dynamic winning line calculator.
- **Local Match Settings**:
  - Enter custom usernames.
  - Choose starting symbols (`X` or `O`).
- **Scoreboard Tracking**: Real-time score updates across multiple rounds, with options to advance rounds or fully reset matches.

---

## 🛠️ Built With

- **HTML5**: Semantic tags and responsive viewport layout.
- **CSS3 (Vanilla)**: Features modular CSS variables, custom neon-glow filters, linear-gradient grid backgrounds, and CSS keyframe animations.
- **JavaScript (ES6)**: Clean, procedural logic handling player state, trivia selection, local state storage, and procedural sound generation.
- **FontAwesome**: Retro game icon set.
- **Google Fonts**:
  - `Rajdhani` (for primary numbers and futuristic menus).
  - `Press Start 2P` (for classic 8-bit title screens).

---

## 🚀 How to Run Locally

Since this project is built entirely on standard frontend technologies with zero external dependencies, running it is simple:

1. Clone this repository:
   ```bash
   git clone https://github.com/M0haAmmad/XO-Games.git
   ```
2. Navigate to the project folder:
   ```bash
   cd XO-Games
   ```
3. Open `index.html` directly in any modern web browser:
   - On Windows: Double-click `index.html` or run `start index.html` in your terminal.
   - On Mac/Linux: Run `open index.html`.

Alternatively, serve it using any simple local server (like Python's HTTP server or Live Server in VS Code) to ensure full compatibility with the Web Audio API:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

---

## 🕹️ Game Rules

1. **Setup**: Enter Player 1 & Player 2 names, choose which side Player 1 represents (`X` or `O`), and click **INITIATE**.
2. **Taking a Turn**: Click any empty cell on the 3x3 board.
3. **The Challenge**: Select a trivia category ("Space", "Coding", or "History") and answer the multiple-choice question.
   - **Correct Answer**: Your symbol is placed in the cell, and turn passes to the next player.
   - **Incorrect Answer**: You lose your turn, the cell remains empty, and turn passes to the next player.
4. **Victory**: Create a line of three symbols horizontally, vertically, or diagonally. A neon line will strike through your winning combination!
5. **Draw**: If all 9 cells are filled (or no more moves are available) and no player has 3 in a row, the match ends in a **DEADLOCK**.
