// أصوات اللعبة
const SOUNDS = {
    click: null,
    win: null,
    draw: null,
    move: null
};

// متغيرات اللعبة
let gameMode = null; // 'computer' أو 'player'
let currentPlayer = 'x'; // 'x' أو 'o'
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let player1Score = 0;
let player2Score = 0;

// تكوينات الفوز المحتملة
const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // الصفوف
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // الأعمدة
    [0, 4, 8], [2, 4, 6]             // القطريات
];

// تحميل الأصوات
function loadSounds() {
    SOUNDS.click = new Audio('sounds/click.wav');
    SOUNDS.win = new Audio('sounds/win.wav');
    SOUNDS.draw = new Audio('sounds/draw.wav');
    SOUNDS.move = SOUNDS.click; // استخدام نفس صوت النقر للحركة
}

// تهيئة اللعبة
function initGame() {
    // إضافة مستمعي الأحداث لأزرار اختيار وضع اللعب
    document.getElementById('vs-computer').addEventListener('click', () => {
        setGameMode('computer');
    });
    
    document.getElementById('vs-player').addEventListener('click', () => {
        setGameMode('player');
    });
    
    // إضافة مستمعي الأحداث لأزرار نتيجة اللعبة
    document.getElementById('play-again').addEventListener('click', resetGame);
    document.getElementById('change-mode').addEventListener('click', showGameModeSelection);
    
    // إضافة مستمعي الأحداث لخلايا اللعبة
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', () => {
            const index = parseInt(cell.getAttribute('data-index'));
            handleCellClick(index);
        });
    });
    
    // تحميل الأصوات
    loadSounds();
}

// تعيين وضع اللعب
function setGameMode(mode) {
    gameMode = mode;
    document.getElementById('game-mode-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    
    // تعيين أسماء اللاعبين بناءً على وضع اللعب
    if (mode === 'computer') {
        document.getElementById('player1-name').textContent = 'Computer';
        document.getElementById('player2-name').textContent = 'You';
    } else {
        document.getElementById('player1-name').textContent = 'Player 1';
        document.getElementById('player2-name').textContent = 'Player 2';
    }
    
    resetGame();
}

// إعادة تعيين اللعبة
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'x';
    gameActive = true;
    
    // إعادة تعيين خلايا اللعبة
    document.querySelectorAll('.cell').forEach(cell => {
        cell.className = 'cell';
        cell.innerHTML = '';
    });
    
    // إخفاء نتيجة اللعبة
    document.getElementById('game-result').style.display = 'none';
    
    // إذا كان وضع اللعب ضد الكمبيوتر والكمبيوتر يبدأ أولاً
    if (gameMode === 'computer' && currentPlayer === 'x') {
        setTimeout(computerMove, 700);
    }
}

// عرض اختيار وضع اللعب
function showGameModeSelection() {
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('game-result').style.display = 'none';
    document.getElementById('game-mode-selection').style.display = 'block';
    
    // إعادة تعيين النقاط
    player1Score = 0;
    player2Score = 0;
    updateScores();
}

// التعامل مع النقر على خلية
function handleCellClick(index) {
    // التحقق من أن اللعبة نشطة وأن الخلية فارغة
    if (!gameActive || gameBoard[index] !== '') {
        return;
    }
    
    // إذا كان وضع اللعب ضد الكمبيوتر ودور اللاعب الأول (الكمبيوتر)
    if (gameMode === 'computer' && currentPlayer === 'x') {
        return;
    }
    
    // تنفيذ الحركة
    makeMove(index);
    
    // إذا كان وضع اللعب ضد الكمبيوتر ولا تزال اللعبة نشطة
    if (gameMode === 'computer' && gameActive) {
        setTimeout(computerMove, 700);
    }
}

// تنفيذ حركة
function makeMove(index) {
    // تحديث لوحة اللعبة
    gameBoard[index] = currentPlayer;
    
    // تحديث واجهة المستخدم
    const cell = document.querySelector(`.cell[data-index="${index}"]`);
    cell.classList.add(currentPlayer);
    
    // تشغيل صوت الحركة
    playSound('move');
    
    // التحقق من حالة اللعبة
    checkGameState();
    
    // تبديل اللاعب الحالي
    currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
}

// حركة الكمبيوتر
function computerMove() {
    if (!gameActive) {
        return;
    }
    
    // اختيار حركة ذكية للكمبيوتر
    const index = getBestMove();
    
    // تنفيذ الحركة
    makeMove(index);
}

// الحصول على أفضل حركة للكمبيوتر
function getBestMove() {
    // محاولة الفوز
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'x';
            if (checkWinner('x')) {
                gameBoard[i] = '';
                return i;
            }
            gameBoard[i] = '';
        }
    }
    
    // منع اللاعب من الفوز
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'o';
            if (checkWinner('o')) {
                gameBoard[i] = '';
                return i;
            }
            gameBoard[i] = '';
        }
    }
    
    // اختيار الوسط إذا كان متاحاً
    if (gameBoard[4] === '') {
        return 4;
    }
    
    // اختيار حركة عشوائية
    const availableMoves = [];
    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            availableMoves.push(i);
        }
    }
    
    if (availableMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        return availableMoves[randomIndex];
    }
    
    return -1; // لا توجد حركات متاحة
}

// التحقق من حالة اللعبة
function checkGameState() {
    // التحقق من الفوز
    if (checkWinner(currentPlayer)) {
        gameActive = false;
        
        // تحديث النقاط
        if (currentPlayer === 'x') {
            player1Score += 20;
        } else {
            player2Score += 20;
        }
        
        updateScores();
        
        // عرض رسالة الفوز
        const winnerName = currentPlayer === 'x' ? 
            document.getElementById('player1-name').textContent : 
            document.getElementById('player2-name').textContent;
        
        document.getElementById('result-message').textContent = `${winnerName} win!`;
        document.getElementById('game-result').style.display = 'block';
        
        // تشغيل صوت الفوز
        playSound('win');
        
        return;
    }
    
    // التحقق من التعادل
    if (!gameBoard.includes('')) {
        gameActive = false;
        document.getElementById('result-message').textContent = 'Draw!';
        document.getElementById('game-result').style.display = 'block';
        
        // تشغيل صوت التعادل
        playSound('draw');
        
        return;
    }
}

// التحقق من الفائز
function checkWinner(player) {
    return winPatterns.some(pattern => {
        return pattern.every(index => gameBoard[index] === player);
    });
}

// تحديث النقاط
function updateScores() {
    document.getElementById('player1-points').textContent = `$${player1Score}`;
    document.getElementById('player2-points').textContent = `$${player2Score}`;
}

// تشغيل الصوت
function playSound(soundName) {
    if (SOUNDS[soundName]) {
        SOUNDS[soundName].currentTime = 0;
        SOUNDS[soundName].play().catch(error => {
            console.error('Error playing sound:', error);
        });
    }
}

// تنفيذ الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initGame);
