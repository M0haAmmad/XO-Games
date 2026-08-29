const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let isMuted = false;

const sounds = {
    click: () => playTone(800, 'sine', 0.05),
    hover: () => playTone(400, 'triangle', 0.02, -10),
    move: () => playTone(600, 'square', 0.1, -5),
    error: () => playTone(150, 'sawtooth', 0.3),
    win: () => playMelody([523, 659, 784, 1046], 0.1)
};

function playTone(freq, type, duration, vol = -5) {
    if (isMuted) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
}

function playMelody(notes, tempo) {
    if (isMuted) return;
    notes.forEach((note, i) => {
        setTimeout(() => playTone(note, 'square', tempo, -5), i * (tempo * 1000));
    });
}

function toggleMute() {
    isMuted = !isMuted;
    const btn = document.getElementById('muteBtn');
    btn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
}


document.body.addEventListener('click', () => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
}, { once: true });


let p1Name = "P1", p2Name = "P2";
let p1Symbol = "X", p2Symbol = "O";
let scores = { X: 0, O: 0 };
let board = Array(9).fill(null);
let turn = "X";
let targetIndex = null;


function selectSide(side) {
    sounds.click();
    document.querySelectorAll('.side-btn').forEach(b => b.classList.remove('selected'));
    event.target.classList.add('selected');
    p1Symbol = side;
    p2Symbol = side === 'X' ? 'O' : 'X';
}

function startGame() {
    sounds.win(); // Start chime
    p1Name = document.getElementById('p1Input').value || "Player 1";
    p2Name = document.getElementById('p2Input').value || "Player 2";

    document.getElementById('p1NameDisplay').innerText = p1Name;
    document.getElementById('p2NameDisplay').innerText = p2Name;

    document.documentElement.style.setProperty('--p1-color', p1Symbol === 'X' ? '#00ff88' : '#ff0055');
    document.documentElement.style.setProperty('--p2-color', p2Symbol === 'X' ? '#00ff88' : '#ff0055');

    document.getElementById('setupScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');

    resetBoard();


    document.querySelectorAll('button').forEach(b => b.addEventListener('mouseenter', sounds.hover));
    cells.forEach(c => c.addEventListener('mouseenter', sounds.hover));
}


const cells = document.querySelectorAll('.cell');
cells.forEach(c => c.addEventListener('click', onCellClick));

function onCellClick(e) {
    const i = e.target.getAttribute('data-i');
    if (board[i] || checkWinner()) return;

    sounds.click();
    targetIndex = i;
    showCategories();
}


const triviaDB = {
    'Space': [
        { q: "Which planet has the most moons?", options: ["Jupiter", "Saturn", "Mars", "Uranus"], a: 1 },
        { q: "What is the closest star to Earth?", options: ["Proxima Centauri", "The Sun", "Sirius", "Alpha Centauri"], a: 1 },
        { q: "Who was the first human in space?", options: ["Neil Armstrong", "Yuri Gagarin", "Buzz Aldrin", "John Glenn"], a: 1 },
        { q: "What galaxy is Earth located in?", options: ["Andromeda", "Milky Way", "Whirlpool", "Sombrero"], a: 1 },
        { q: "Which planet is known as the Red Planet?", options: ["Mars", "Venus", "Mercury", "Jupiter"], a: 0 },
        { q: "What is the largest planet in our solar system?", options: ["Saturn", "Jupiter", "Neptune", "Earth"], a: 1 },
        { q: "Which planet is closest to the Sun?", options: ["Venus", "Mercury", "Mars", "Earth"], a: 1 },
        { q: "What is the hottest planet in our solar system?", options: ["Mercury", "Venus", "Mars", "Jupiter"], a: 1 },
        { q: "Who was the first woman in space?", options: ["Sally Ride", "Valentina Tereshkova", "Mae Jemison", "Peggy Whitson"], a: 1 },
        { q: "Which celestial body was formerly considered the 9th planet?", options: ["Ceres", "Eris", "Pluto", "Makemake"], a: 2 },
        { q: "What is the name of the first artificial Earth satellite?", options: ["Apollo 11", "Sputnik 1", "Voyager 1", "Hubble"], a: 1 },
        { q: "Which planet has a Great Red Spot?", options: ["Mars", "Jupiter", "Saturn", "Neptune"], a: 1 }
    ],
    'Coding': [
        { q: "Which tag is used for the main title in HTML?", options: ["<h1>", "<head>", "<title>", "<header>"], a: 0 },
        { q: "What does CSS stand for?", options: ["Visual Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Computer Style Sheets"], a: 1 },
        { q: "Which language runs natively in the web browser?", options: ["Python", "Java", "JavaScript", "C++"], a: 2 },
        { q: "What is a 'bug' in programming?", options: ["An insect", "A new feature", "An error or flaw", "A hardware issue"], a: 2 },
        { q: "Which symbol is used for assignment in JavaScript?", options: ["==", "===", "=", "=>"], a: 2 },
        { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"], a: 0 },
        { q: "Which of the following is rarely considered a JavaScript framework/library?", options: ["React", "Angular", "Vue", "Django"], a: 3 },
        { q: "What is the correct way to write a comment in HTML?", options: ["// comment", "/* comment */", "<!-- comment -->", "# comment"], a: 2 },
        { q: "In CSS, how do you select an element with id 'header'?", options: [".header", "#header", "header", "*header"], a: 1 },
        { q: "Which data structure uses LIFO (Last In First Out)?", options: ["Queue", "Array", "Stack", "Tree"], a: 2 },
        { q: "What does SQL stand for?", options: ["Structured Query Language", "Strong Question Language", "System Query Logic", "Standard Query Language"], a: 0 },
        { q: "Which value is not falsy in JavaScript?", options: ["0", "null", "undefined", "'false'"], a: 3 }
    ],
    'History': [
        { q: "Who invented the telephone?", options: ["Alexander G. Bell", "Thomas Edison", "Nikola Tesla", "Guglielmo Marconi"], a: 0 },
        { q: "In what year did World War II end?", options: ["1945", "1939", "1950", "1918"], a: 0 },
        { q: "Who painted the Mona Lisa?", options: ["Vincent Van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"], a: 1 },
        { q: "The Great Wall is located in which country?", options: ["China", "Japan", "India", "Mongolia"], a: 0 },
        { q: "Who is famous for discovering electricity with a kite?", options: ["Benjamin Franklin", "Albert Einstein", "Isaac Newton", "Galileo Galilei"], a: 0 },
        { q: "Who was the first President of the United States?", options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"], a: 1 },
        { q: "In what year did the Titanic sink?", options: ["1905", "1912", "1920", "1898"], a: 1 },
        { q: "Which ancient civilization built the pyramids of Giza?", options: ["Romans", "Greeks", "Egyptians", "Mayans"], a: 2 },
        { q: "Who was the British Prime Minister during most of WWII?", options: ["Neville Chamberlain", "Winston Churchill", "Clement Attlee", "Margaret Thatcher"], a: 1 },
        { q: "Which empire was ruled by Julius Caesar?", options: ["Ottoman Empire", "Roman Empire", "British Empire", "Mongol Empire"], a: 1 },
        { q: "What was the name of the ship that brought the Pilgrims to America?", options: ["Santa Maria", "Mayflower", "Endeavour", "Beagle"], a: 1 },
        { q: "Who was the first female Prime Minister of the UK?", options: ["Theresa May", "Queen Elizabeth II", "Margaret Thatcher", "Angela Merkel"], a: 2 }
    ]
};

function showCategories() {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modalContent');
    modal.style.display = 'flex';
    content.classList.remove('shake'); // Reset anim
    content.innerHTML = `
                <h2>Select Data Bank</h2>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button class="category-btn" onclick="runTrivia('Space')"><i class="fas fa-meteor"></i> Space</button>
                    <button class="category-btn" onclick="runTrivia('Coding')"><i class="fas fa-code"></i> Coding</button>
                    <button class="category-btn" onclick="runTrivia('History')"><i class="fas fa-land-mine-on"></i> History</button>
                </div>
            `;
}

const askedQuestions = { Space: [], Coding: [], History: [] };

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function runTrivia(cat) {
    sounds.click();

    let questions = triviaDB[cat].filter(q => !askedQuestions[cat].includes(q.q));

    if (questions.length === 0) {
        askedQuestions[cat] = [];
        questions = triviaDB[cat];
    }

    const q = questions[Math.floor(Math.random() * questions.length)];
    askedQuestions[cat].push(q.q);

    const content = document.getElementById('modalContent');
    content.innerHTML = `
                <h3>Security Check</h3>
                <p style="margin: 20px 0; font-size: 1.2rem;">${q.q}</p>
                <div id="opts"></div>
            `;

    let optionsObj = q.options.map((opt, idx) => ({
        text: opt,
        isCorrect: idx === q.a
    }));
    optionsObj = shuffleArray(optionsObj);

    const optsDiv = content.querySelector('#opts');
    optionsObj.forEach((optObj) => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = optObj.text;
        btn.onmouseenter = sounds.hover;
        btn.onclick = () => {
            if (optObj.isCorrect) {
                confirmMove();
            } else {
                failMove();
            }
        };
        optsDiv.appendChild(btn);
    });
}

function confirmMove() {
    sounds.move();
    document.getElementById('modal').style.display = 'none';
    playMove(targetIndex);
}

function failMove() {
    sounds.error();
    const content = document.getElementById('modalContent');
    content.classList.add('shake');
    content.innerHTML = `<h2 style="color:red">ACCESS DENIED</h2><p>Turn Lost.</p>`;
    setTimeout(() => {
        content.classList.remove('shake');
        document.getElementById('modal').style.display = 'none';
        turn = turn === 'X' ? 'O' : 'X';
        updateTurnUI();
    }, 1000);
}

function playMove(i) {
    board[i] = turn;
    const cell = document.querySelector(`[data-i='${i}']`);
    cell.classList.add(turn.toLowerCase());
    cell.innerText = turn;
    cell.style.animation = "pop 0.3s ease";

    const win = checkWinner();
    if (win) {
        handleWin(win);
    } else if (!board.includes(null)) {
        handleDraw();
    } else {
        turn = turn === 'X' ? 'O' : 'X';
        updateTurnUI();
    }
}

function updateTurnUI() {
    const p1Box = document.getElementById('p1ScoreBox');
    const p2Box = document.getElementById('p2ScoreBox');

    if (p1Symbol === turn) {
        p1Box.classList.add('active-turn');
        p2Box.classList.remove('active-turn');
    } else {
        p1Box.classList.remove('active-turn');
        p2Box.classList.add('active-turn');
    }
}

function checkWinner() {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let combo of lines) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], combo };
        }
    }
    return null;
}

function handleWin(result) {
    sounds.win();
    document.getElementById('gameScreen').classList.add('shake'); // Shake board on win
    setTimeout(() => document.getElementById('gameScreen').classList.remove('shake'), 500);

    scores[result.winner]++;
    updateScores();
    drawWinLine(result.combo);

    setTimeout(() => {
        const winnerName = result.winner === p1Symbol ? p1Name : p2Name;
        showEndScreen(`${winnerName} WINS!`);
    }, 1500);
}

function handleDraw() {
    sounds.error();
    showEndScreen("DEADLOCK / DRAW");
}

function updateScores() {
    const p1Score = p1Symbol === 'X' ? scores.X : scores.O;
    const p2Score = p2Symbol === 'X' ? scores.X : scores.O;
    document.getElementById('p1ScoreVal').innerText = p1Score;
    document.getElementById('p2ScoreVal').innerText = p2Score;
}

function drawWinLine(combo) {
    const line = document.getElementById('winLine');
    const cells = document.querySelectorAll('.cell');
    const c1 = cells[combo[0]];
    const c3 = cells[combo[2]];
    const rect1 = c1.getBoundingClientRect();
    const rect3 = c3.getBoundingClientRect();
    const parent = document.getElementById('board').getBoundingClientRect();
    const x1 = rect1.left - parent.left + 50;
    const y1 = rect1.top - parent.top + 50;
    const x2 = rect3.left - parent.left + 50;
    const y2 = rect3.top - parent.top + 50;
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    line.style.width = `${length}px`;
    line.style.transform = `translate(${x1}px, ${y1}px) rotate(${angle}deg)`;
    line.style.display = 'block';
}

function showEndScreen(msg) {
    const modal = document.getElementById('modal');
    const content = document.getElementById('modalContent');
    modal.style.display = 'flex';
    content.innerHTML = `
                <div class="win-msg" style="animation: pop 0.5s">${msg}</div>
                <div class="btn-group">
                    <button class="start-btn" onclick="nextRound()">Next Round</button>
                    <button class="btn-secondary" onclick="resetMatch()">Reset Match</button>
                </div>
            `;
}

function nextRound() {
    sounds.click();
    resetBoard();
    document.getElementById('modal').style.display = 'none';
}

function resetMatch() {
    sounds.click();
    scores = { X: 0, O: 0 };
    updateScores();
    resetBoard();
    document.getElementById('modal').style.display = 'none';
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('setupScreen').classList.remove('hidden');
}

function resetBoard() {
    board.fill(null);
    cells.forEach(c => {
        c.innerText = '';
        c.className = 'cell';
        c.style.animation = ''; // Reset anims
    });
    document.getElementById('winLine').style.display = 'none';
    turn = "X"; // P1 (or X) always starts
    updateTurnUI();
}
