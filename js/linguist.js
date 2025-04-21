// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Show introduction screen
    elements.introScreen.style.display = 'flex';
    elements.gameContainer.style.display = 'none';
    
    // Automatically start the game after 3 seconds
    setTimeout(() => { 
        startGame();
    }, 10200);
});









// Game Data
const gameData = {
    // Word database with related words
    wordDatabase: {
        'لعب': {
            plural: "لاعبون",
            singular: 'لاعب',
            antonym: 'راحة',
            meaning: 'نشاط يتم ممارستة فى وقت الراحة'
        },
        'زهقا': {
            plural: 'زالوا',
            singular: 'انتهى',
            antonym: 'مازال',
            meaning: 'فاضت روحة'
        },
        'فؤاد': {
            plural: 'افئدة',
            singular: 'فؤاد',
            antonym: 'عناد',
            meaning: 'قلب'
        },
        'جوي': {
            plural: 'جويات',
            singular: 'جوي',
            antonym: 'أرضي',
            meaning: 'متعلق بالجو أو الهواء'
        },
        'حيوي': {
            plural: 'حيويات',
            singular: 'حيوي',
            antonym: 'ميت',
            meaning: 'مليء بالحياة والنشاط'
        },
        'بري': {
            plural: 'بريات',
            singular: 'بري',
            antonym: 'بحري',
            meaning: 'متعلق بالبر أو اليابسة'
        },
        'نبتة': {
            plural: 'نبتات',
            singular: 'نبتة',
            antonym: 'حيوان',
            meaning: 'نبات صغير'
        },
        'تجلى': {
            plural: 'متجلون',
            singular: 'متجلى',
            antonym: 'اختفى',
            meaning: 'الشى الذىْ يظهر'
        }
    },
    
    // Challenge types
    challengeTypes: ['مضاد', 'مفرد', 'جمع', 'معنى'],
    
    // Game state
    currentPlayer: 'human', // 'human' or 'ai'
    board: Array(9).fill(null),
    aiWord: '',
    humanWord: '',
    aiPoints: 0,
    humanPoints: 0,
    gameOver: false,
    winner: null,
    aiTimer: 20,
    humanTimer: 20,
    aiTimerInterval: null,
    humanTimerInterval: null,
    aiChallenge: '',
    humanChallenge: '',
    currentChallengeType: '',
    currentChallengeWord: '',
    currentChallengeOptions: [],
    currentChallengeAnswer: '',
    takeOverOpportunity: false,
    aiAnsweredCorrectly: true, // Flag to track if AI answered correctly
    humanAnsweredCorrectly: true, // Flag to track if human answered correctly
    selectedWord: '', // Track the currently selected word
    waitingForPlacement: false, // Flag to indicate waiting for word placement
    consecutiveTurns: 0, // Track consecutive turns for the same player
    isDrawn: false, // Flag to indicate if the game is drawn
    placedWords: [], // Track words that have been placed on the board
    aiDifficulty: 0.9, // AI difficulty level (0.0 to 1.0) - higher means more difficult
    waitingForChallengeType: false, // Flag to indicate waiting for challenge type selection
    aiIsResponding: false, // Flag to indicate AI is responding to a challenge
    humanIsResponding: false, // Flag to indicate human is responding to a challenge
    aiSelectedChallengeType: '', // Track the challenge type selected by AI for human
    humanLostTurn: false, // Flag to indicate if human lost their turn
    
    // Custom challenge data
    customChallenges: [], // Array to store custom challenges
    currentCustomChallenge: null, // Current custom challenge being played
    customChallengeActive: false // Flag to indicate if a custom challenge is active
};

// DOM Elements
const elements = {
    // Introduction screen elements
    introScreen: document.getElementById('introScreen'),
    gameContainer: document.getElementById('gameContainer'),
    //game const
    wordGrid: document.getElementById('word-grid'),
    boardCells: document.querySelectorAll('.board-cell'),
    gameBoard: document.getElementById('game-board'),
    aiTimerValue: document.getElementById('ai-timer'),
    humanTimerValue: document.getElementById('human-timer'),
    aiPointsValue: document.getElementById('ai-points'),
    humanPointsValue: document.getElementById('human-points'),
    aiNeedType: document.getElementById('ai-need-type'),
    humanNeedType: document.getElementById('human-need-type'),
    takeOverModal: document.getElementById('takeOverModal'),
    challengeTypeModal: document.getElementById('challengeTypeModal'),
    challengeTypeOptions: document.getElementById('challenge-type-options'),
    gameOverModal: document.getElementById('gameOverModal'),
    challengeHeader: document.getElementById('challenge-header'),
    challengeTitle: document.getElementById('challenge-title'),
    challengeText: document.getElementById('challenge-text'),
    statusMessage: document.getElementById('status-message'),
    gameStatus: document.getElementById('game-status'),
    challengeTimer: document.getElementById('challenge-timer'),
    winnerText: document.querySelector('.winner-text'),
    finalScore: document.querySelector('.final-score'),
    playAgainBtn: document.querySelector('.play-again'),
    takeOverYesBtn: document.querySelector('.takeover-yes'),
    takeOverNoBtn: document.querySelector('.takeover-no'),
    aiStartWord: document.getElementById('ai-word'),
    humanStartWord: document.getElementById('human-word'),
    drawConfirmModal: document.getElementById('drawConfirmModal'),
    drawPlayAgainBtn: document.querySelector('.draw-play-again'),
    drawEndGameBtn: document.querySelector('.draw-end-game'),
    
    // Custom Challenge Elements
    customChallengeBtn: document.getElementById('custom-challenge-btn'),
    customChallengeModal: document.getElementById('customChallengeModal'),
    challengeWordInput: document.getElementById('challenge-word'),
    challengeTypeSelect: document.getElementById('challenge-type'),
    optionInputs: document.querySelectorAll('.option-text'),
    correctOptionRadios: document.querySelectorAll('input[name="correct-option"]'),
    challengePointsInput: document.getElementById('challenge-points'),
    createChallengeBtn: document.getElementById('create-challenge'),
    cancelChallengeBtn: document.getElementById('cancel-challenge'),
    customChallengeAcceptModal: document.getElementById('customChallengeAcceptModal'),
    acceptChallengeBtn: document.querySelector('.accept-challenge'),
    declineChallengeBtn: document.querySelector('.decline-challenge')
};

// Initialize the game
function initGame() {
    // Set initial words
    gameData.aiWord = 'نبات';
    gameData.humanWord = 'حيوان';
    
    // Display initial words
    elements.aiStartWord.textContent = gameData.aiWord;
    elements.humanStartWord.textContent = gameData.humanWord;
    
    // Set initial challenges
    randomizeChallenge('ai');
    randomizeChallenge('human');
    
    // Reset game state
    gameData.board = Array(9).fill(null);
    gameData.gameOver = false;
    gameData.winner = null;
    gameData.aiTimer = 20;
    gameData.humanTimer = 20;
    gameData.takeOverOpportunity = false;
    gameData.aiAnsweredCorrectly = true;
    gameData.humanAnsweredCorrectly = true;
    gameData.selectedWord = '';
    gameData.waitingForPlacement = false;
    gameData.consecutiveTurns = 0;
    gameData.isDrawn = false;
    gameData.placedWords = [];
    gameData.waitingForChallengeType = false;
    gameData.aiIsResponding = false;
    gameData.humanIsResponding = false;
    gameData.aiSelectedChallengeType = '';
    gameData.customChallengeActive = false;
    gameData.currentCustomChallenge = null;
    gameData.humanLostTurn = false;
    
    // Reset points
    gameData.aiPoints = 0;
    gameData.humanPoints = 0;
    updatePointsDisplay();
    
    // Reset board cells
    elements.boardCells.forEach(cell => {
        cell.classList.remove('human-cell', 'ai-cell', 'correct-cell', 'incorrect-cell');
        cell.innerHTML = '';
        cell.style.backgroundColor = '';
    });
    
    // Add event listeners
    addEventListeners();
    
    // Start with human player
    gameData.currentPlayer = 'human';
    
    // Show word selection for human player
    showWordSelection();
}

// Add event listeners
function addEventListeners() {
    // Board cells click
    elements.boardCells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (gameData.currentPlayer === 'human' && !gameData.gameOver && gameData.waitingForPlacement) {
                const cellIndex = cell.getAttribute('data-cell');
                placeWord(cellIndex);
            }
        });
    });
    
    // Play again button
    elements.playAgainBtn.addEventListener('click', resetGame);
    
    // Take over buttons
    elements.takeOverYesBtn.addEventListener('click', () => {
        hideTakeOverModal();
        
        // Check if it's the AI taking over human's turn or human taking over AI's turn
        if (gameData.humanLostTurn) {
            // AI takes over human's turn
            aiTakesOverTurn();
            gameData.humanLostTurn = false;
        } else {
            // Human takes over AI's turn
            takeOverTurn();
        }
    });
    
    elements.takeOverNoBtn.addEventListener('click', () => {
        hideTakeOverModal();
        
        // Reset human lost turn flag if needed
        if (gameData.humanLostTurn) {
            gameData.humanLostTurn = false;
        }
        
        switchPlayer();
    });
    
    // Draw confirmation buttons
    elements.drawPlayAgainBtn.addEventListener('click', () => {
        hideDrawConfirmModal();
        continueAfterDraw();
    });
    
    elements.drawEndGameBtn.addEventListener('click', () => {
        hideDrawConfirmModal();
        endGameWithDraw();
    });
    
    // Custom Challenge Button
    elements.customChallengeBtn.addEventListener('click', showCustomChallengeModal);
    
    // Create Challenge Button
    elements.createChallengeBtn.addEventListener('click', createCustomChallenge);
    
    // Cancel Challenge Button
    elements.cancelChallengeBtn.addEventListener('click', hideCustomChallengeModal);
    
    // Accept Challenge Button
    elements.acceptChallengeBtn.addEventListener('click', () => {
        hideCustomChallengeAcceptModal();
        startCustomChallenge();
    });
    
    // Decline Challenge Button
    elements.declineChallengeBtn.addEventListener('click', () => {
        hideCustomChallengeAcceptModal();
        declineCustomChallenge();
    });
}

// Start the game from introduction screen
function startGame() {
    // Hide introduction screen
    elements.introScreen.style.display = 'none';
    
    // Show game container
    elements.gameContainer.style.display = 'flex';
    
    // Initialize the game
    initGame();
}

// Show word selection
function showWordSelection() {
    // Clear the word grid
    elements.wordGrid.innerHTML = '';
    
    // Update challenge header
    elements.challengeTitle.textContent = 'اختر كلمة للبدء';
    elements.challengeText.textContent = '';
    elements.statusMessage.textContent = '';
    elements.gameStatus.style.display = 'none';
    elements.challengeTimer.parentElement.style.display = 'none';
    
    // Reset selected word
    gameData.selectedWord = '';
    gameData.waitingForPlacement = false;
    gameData.waitingForChallengeType = false;
    gameData.aiIsResponding = false;
    gameData.humanIsResponding = false;
    
    // Add word options
    for (const word in gameData.wordDatabase) {
        // Skip words that have already been placed
        if (gameData.placedWords.includes(word)) continue;
        
        const option = document.createElement('div');
        option.classList.add('word-item');
        option.textContent = word;
        option.addEventListener('click', () => {
            selectWord(word, option);
        });
        elements.wordGrid.appendChild(option);
    }
}

// Show challenge type selection for AI word
function showChallengeTypeSelectionForAI() {
    // Clear the word grid
    elements.wordGrid.innerHTML = '';
    
    // Update challenge header
    elements.challengeTitle.textContent = 'اختر نوع التحدي للاعب الآخر';
    elements.challengeText.textContent = `الكلمة: ${gameData.aiWord}`;
    elements.statusMessage.textContent = '';
    elements.gameStatus.style.display = 'none';
    elements.challengeTimer.parentElement.style.display = 'none';
    
    // Set flag
    gameData.waitingForChallengeType = true;
    
    // Add challenge type options
    gameData.challengeTypes.forEach(type => {
        const option = document.createElement('div');
        option.classList.add('word-item', 'challenge-option');
        option.textContent = type;
        option.addEventListener('click', () => {
            selectChallengeType(type, option);
        });
        elements.wordGrid.appendChild(option);
    });
}

// AI selects challenge type for human
function aiSelectsChallengeForHuman() {
    // AI randomly selects a challenge type
    const randomIndex = Math.floor(Math.random() * gameData.challengeTypes.length);
    const challengeType = gameData.challengeTypes[randomIndex];
    
    // Store the selected challenge type
    gameData.aiSelectedChallengeType = challengeType;
    
    // Show human responding to challenge
    showHumanResponseToChallenge(challengeType, gameData.humanWord);
}

// Show human responding to challenge
function showHumanResponseToChallenge(challengeType, word) {
    // Clear the word grid
    elements.wordGrid.innerHTML = '';
    
    // Update challenge header
    elements.challengeTitle.textContent = 'أجب على تحدي اللاعب الآخر';
    elements.challengeText.textContent = `${challengeType} للكلمة: ${word}`;
    elements.statusMessage.textContent = '';
    elements.gameStatus.style.display = 'none';
    elements.challengeTimer.parentElement.style.display = 'block';
    
    // Set flags
    gameData.humanIsResponding = true;
    
    // Generate options
    let correctAnswer = '';
    let incorrectOptions = [];
    
    if (challengeType === 'مضاد') {
        correctAnswer = gameData.wordDatabase[word].antonym;
        incorrectOptions = getRandomWords(3, [word, correctAnswer]);
    } else if (challengeType === 'مفرد') {
        correctAnswer = gameData.wordDatabase[word].singular;
        incorrectOptions = getRandomWords(3, [word, correctAnswer]);
    } else if (challengeType === 'جمع') {
        correctAnswer = gameData.wordDatabase[word].plural;
        incorrectOptions = getRandomWords(3, [word, correctAnswer]);
    } else if (challengeType === 'معنى') {
        correctAnswer = gameData.wordDatabase[word].meaning;
        incorrectOptions = getRandomMeanings(3, word);
    }
    
    gameData.currentChallengeAnswer = correctAnswer;
    
    // Create array with correct answer and incorrect options
    const allOptions = [correctAnswer, ...incorrectOptions];
    
    // Shuffle options
    gameData.currentChallengeOptions = shuffleArray(allOptions);
    
    // Add options to word grid (clickable for human)
    gameData.currentChallengeOptions.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('word-item', 'challenge-option');
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => {
            checkHumanAnswer(option, optionElement);
        });
        elements.wordGrid.appendChild(optionElement);
    });
    
    // Reset and start timer
    elements.challengeTimer.textContent = '20';
    startChallengeTimer();
}

// Check human's answer to AI's challenge
function checkHumanAnswer(answer, element) {
    // Clear challenge timer
    clearInterval(gameData.challengeTimerInterval);
    
    const isCorrect = answer === gameData.currentChallengeAnswer;
    gameData.humanAnsweredCorrectly = isCorrect;
    
    // Visual feedback
    if (element) {
        if (isCorrect) {
            element.classList.add('correct');
        } else {
            element.classList.add('incorrect');
            
            // Find and highlight correct answer
            const options = document.querySelectorAll('.challenge-option');
            options.forEach(opt => {
                if (opt.textContent === gameData.currentChallengeAnswer) {
                    opt.classList.add('correct');
                }
            });
        }
    }
    
    // Delay to show feedback
    setTimeout(() => {
        if (isCorrect) {
            // Human answered correctly - continue with human's turn
            gameData.humanIsResponding = false;
            
            // Show word selection for human to place on board
            showWordSelection();
        } else {
            // Human answered incorrectly - AI gets a chance to take over
            gameData.humanIsResponding = false;
            
            // Set flag that human lost their turn
            gameData.humanLostTurn = true;
            
            // Show take over modal for AI to decide
            showTakeOverModal();
        }
    }, 2000); // Show feedback for 2 seconds
}

// AI takes over human's turn
function aiTakesOverTurn() {
    gameData.takeOverOpportunity = false;
    gameData.consecutiveTurns = 1; // AI will get two consecutive turns
    
    // AI makes a move
    makeAIMove();
}

// Select challenge type for AI
function selectChallengeType(type, element) {
    // Visual feedback
    const options = document.querySelectorAll('.challenge-option');
    options.forEach(opt => opt.classList.remove('selected'));
    if (element) element.classList.add('selected');
    
    // Set challenge type
    gameData.currentChallengeType = type;
    
    // Show AI responding to challenge
    setTimeout(() => {
        showAIResponseToChallenge(type, gameData.aiWord);
    }, 1000);
}

// Show AI responding to challenge
function showAIResponseToChallenge(challengeType, word) {
    // Clear the word grid
    elements.wordGrid.innerHTML = '';
    
    // Update challenge header
    elements.challengeTitle.textContent = 'اللاعب الآخر يجيب على التحدي';
    elements.challengeText.textContent = `${challengeType} للكلمة: ${word}`;
    elements.statusMessage.textContent = '';
    elements.gameStatus.style.display = 'none';
    elements.challengeTimer.parentElement.style.display = 'block';
    
    // Set flags
    gameData.waitingForChallengeType = false;
    gameData.aiIsResponding = true;
    
    // Generate options
    let correctAnswer = '';
    let incorrectOptions = [];
    
    if (challengeType === 'مضاد') {
        correctAnswer = gameData.wordDatabase[word].antonym;
        incorrectOptions = getRandomWords(3, [word, correctAnswer]);
    } else if (challengeType === 'مفرد') {
        correctAnswer = gameData.wordDatabase[word].singular;
        incorrectOptions = getRandomWords(3, [word, correctAnswer]);
    } else if (challengeType === 'جمع') {
        correctAnswer = gameData.wordDatabase[word].plural;
        incorrectOptions = getRandomWords(3, [word, correctAnswer]);
    } else if (challengeType === 'معنى') {
        correctAnswer = gameData.wordDatabase[word].meaning;
        incorrectOptions = getRandomMeanings(3, word);
    }
    
    gameData.currentChallengeAnswer = correctAnswer;
    
    // Create array with correct answer and incorrect options
    const allOptions = [correctAnswer, ...incorrectOptions];
    
    // Shuffle options
    gameData.currentChallengeOptions = shuffleArray(allOptions);
    
    // Add options to word grid (for display only, not clickable)
    gameData.currentChallengeOptions.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('word-item', 'challenge-option');
        optionElement.textContent = option;
        elements.wordGrid.appendChild(optionElement);
    });
    
    // Reset and start timer
    elements.challengeTimer.textContent = '20';
    startChallengeTimer();
    
    // Simulate AI thinking and answering
    setTimeout(() => {
        // AI difficulty determines chance of correct answer
        const aiSuccessRate = gameData.aiDifficulty;
        gameData.aiAnsweredCorrectly = Math.random() < aiSuccessRate;
        
        // Find the option element that matches the AI's answer
        const options = document.querySelectorAll('.challenge-option');
        let selectedOption = null;
        
        if (gameData.aiAnsweredCorrectly) {
            // AI answers correctly
            options.forEach(opt => {
                if (opt.textContent === gameData.currentChallengeAnswer) {
                    selectedOption = opt;
                }
            });
        } else {
            // AI answers incorrectly - choose a random wrong answer
            const wrongOptions = Array.from(options).filter(
                opt => opt.textContent !== gameData.currentChallengeAnswer
            );
            if (wrongOptions.length > 0) {
                selectedOption = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
            }
        }
        
        // Highlight AI's answer
        if (selectedOption) {
            if (gameData.aiAnsweredCorrectly) {
                selectedOption.classList.add('correct');
            } else {
                selectedOption.classList.add('incorrect');
                
                // Also highlight the correct answer
                options.forEach(opt => {
                    if (opt.textContent === gameData.currentChallengeAnswer) {
                        opt.classList.add('correct');
                    }
                });
            }
        }
        
        // Clear timer
        clearInterval(gameData.challengeTimerInterval);
        
        // Wait to show feedback then proceed
        setTimeout(() => {
            if (gameData.aiAnsweredCorrectly) {
                // AI answered correctly - switch to human's turn
                switchPlayer();
            } else {
                // AI answered incorrectly - show take over modal
                // Only show take over modal when AI loses its turn
                gameData.takeOverOpportunity = true;
                showTakeOverModal();
            }
        }, 2000);
    }, 3000); // AI thinks for 3 seconds
}

// Select word
function selectWord(word, element) {
    if (gameData.currentPlayer === 'human') {
        // Remove selected class from all word items
        const wordItems = document.querySelectorAll('.word-item');
        wordItems.forEach(item => item.classList.remove('selected'));
        
        // Add selected class to clicked word
        if (element) element.classList.add('selected');
        
        gameData.humanWord = word;
        elements.humanStartWord.textContent = word;
        gameData.selectedWord = word;
        gameData.waitingForPlacement = true;
        
        // Show message to place word
        elements.statusMessage.textContent = 'اختر مكان للعب';
        elements.gameStatus.style.display = 'block';
    } else {
        gameData.aiWord = word;
        elements.aiStartWord.textContent = word;
        gameData.selectedWord = word;
    }
}

// Place word on board
function placeWord(cellIndex) {
    // Check if cell is empty
    if (gameData.board[cellIndex] !== null) {
        return;
    }
    
    // Place word
    if (gameData.currentPlayer === 'human') {
        gameData.board[cellIndex] = {
            player: 'human',
            word: gameData.humanWord
        };
        
        // Add to placed words
        if (!gameData.placedWords.includes(gameData.humanWord)) {
            gameData.placedWords.push(gameData.humanWord);
        }
        
        // Update UI
        elements.boardCells[cellIndex].classList.add('human-cell');
        elements.boardCells[cellIndex].innerHTML = `<span class="word-in-cell">${gameData.humanWord}</span>`;
        
        // Reset waiting for placement
        gameData.waitingForPlacement = false;
    } else {
        gameData.board[cellIndex] = {
            player: 'ai',
            word: gameData.aiWord
        };
        
        // Add to placed words
        if (!gameData.placedWords.includes(gameData.aiWord)) {
            gameData.placedWords.push(gameData.aiWord);
        }
        
        // Update UI
        elements.boardCells[cellIndex].classList.add('ai-cell');
        elements.boardCells[cellIndex].innerHTML = `<span class="word-in-cell">${gameData.aiWord}</span>`;
    }
    
    // Check for win
    if (checkWin()) {
        endGame();
        return;
    }
    
    // Check for draw
    if (checkDraw()) {
        handleDraw();
        return;
    }
    
    // After placing word, switch player or show challenge type selection
    if (gameData.currentPlayer === 'human') {
        // Human placed word, now AI's turn
        switchPlayer();
    } else {
        // AI placed word, now human selects challenge type for AI
        showChallengeTypeSelectionForAI();
    }
}

// Show challenge in word selection panel (for human player)
function showChallenge(player, challengeType, word) {
    // Clear the word grid
    elements.wordGrid.innerHTML = '';
    
    // Update challenge header
    elements.challengeTitle.textContent = 'تحدي من اللاعب الآخر';
    elements.challengeText.textContent = `اختر ${challengeType} للكلمة: ${word}`;
    elements.statusMessage.textContent = '';
    elements.gameStatus.style.display = 'none';
    elements.challengeTimer.parentElement.style.display = 'block';
    
    // Set current challenge data
    gameData.currentChallengeType = challengeType;
    gameData.currentChallengeWord = word;
    
    // Generate options
    let correctAnswer = '';
    let incorrectOptions = [];
    
    if (challengeType === 'مضاد') {
        correctAnswer = gameData.wordDatabase[word].antonym;
        // Get random incorrect options
        incorrectOptions = getRandomWords(3, [word, correctAnswer]);
    } else if (challengeType === 'مفرد') {
        correctAnswer = gameData.wordDatabase[word].singular;
        incorrectOptions = getRandomWords(3, [word, correctAnswer]);
    } else if (challengeType === 'جمع') {
        correctAnswer = gameData.wordDatabase[word].plural;
        incorrectOptions = getRandomWords(3, [word, correctAnswer]);
    } else if (challengeType === 'معنى') {
        correctAnswer = gameData.wordDatabase[word].meaning;
        // For meaning, we need different incorrect options
        incorrectOptions = getRandomMeanings(3, word);
    }
    
    gameData.currentChallengeAnswer = correctAnswer;
    
    // Create array with correct answer and incorrect options
    const allOptions = [correctAnswer, ...incorrectOptions];
    
    // Shuffle options
    gameData.currentChallengeOptions = shuffleArray(allOptions);
    
    // Add options to word grid
    gameData.currentChallengeOptions.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('word-item', 'challenge-option');
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => {
            checkAnswer(option, optionElement);
        });
        elements.wordGrid.appendChild(optionElement);
    });
    
    // Reset and start timer
    elements.challengeTimer.textContent = '20';
    startChallengeTimer();
}

// Show challenge type selection modal
function showChallengeTypeModal() {
    // Clear previous options
    elements.challengeTypeOptions.innerHTML = '';
    
    // Add challenge type options
    gameData.challengeTypes.forEach(type => {
        const option = document.createElement('button');
        option.classList.add('challenge-type-option');
        option.textContent = type;
        option.addEventListener('click', () => {
            hideChallengeTypeModal();
            gameData.currentChallengeType = type;
            
            // Show challenge with selected type
            if (gameData.currentPlayer === 'human') {
                showChallenge('ai', type, gameData.aiWord);
            } else {
                showChallenge('human', type, gameData.humanWord);
            }
        });
        elements.challengeTypeOptions.appendChild(option);
    });
    
    // Show modal
    elements.challengeTypeModal.classList.add('active');
}

// Hide challenge type selection modal
function hideChallengeTypeModal() {
    elements.challengeTypeModal.classList.remove('active');
}

// Show take over modal
function showTakeOverModal() {
    // Update modal text based on who lost their turn
    if (gameData.humanLostTurn) {
        // Human lost their turn, ask AI if it wants to take over
        document.querySelector('.takeover-text').textContent = 'هل تريد أخذ دور اللاعب؟';
        
        // Simulate AI decision (always takes over)
        setTimeout(() => {
            hideTakeOverModal();
            aiTakesOverTurn();
            gameData.humanLostTurn = false;
        }, 2000);
    } else if (gameData.aiIsResponding && !gameData.aiAnsweredCorrectly) {
        // AI lost its turn, ask human if they want to take over
        document.querySelector('.takeover-text').textContent = 'هل تريد أخذ دور اللاعب الآخر؟';
        elements.takeOverModal.classList.add('active');
    } else {
        // If neither condition is met, just continue with the game
        switchPlayer();
    }
}

// Hide take over modal
function hideTakeOverModal() {
    elements.takeOverModal.classList.remove('active');
}

// Show draw confirmation modal
function showDrawConfirmModal() {
    elements.drawConfirmModal.classList.add('active');
}

// Hide draw confirmation modal
function hideDrawConfirmModal() {
    elements.drawConfirmModal.classList.remove('active');
}

// Show game over modal
function showGameOverModal() {
    const modal = elements.gameOverModal;
    
    if (gameData.winner === 'human') {
        elements.winnerText.textContent = 'مبروك! لقد فزت';
    } else if (gameData.winner === 'ai') {
        elements.winnerText.textContent = 'للأسف، لقد خسرت';
    } else {
        elements.winnerText.textContent = 'انتهت اللعبة بالتعادل';
    }
    
    elements.finalScore.textContent = `النقاط: أنت ${gameData.humanPoints} - الذكاء الاصطناعي ${gameData.aiPoints}`;
    
    modal.classList.add('active');
}

// Hide game over modal
function hideGameOverModal() {
    elements.gameOverModal.classList.remove('active');
}

// Check answer
function checkAnswer(answer, element) {
    // Clear challenge timer
    clearInterval(gameData.challengeTimerInterval);
    
    const isCorrect = answer === gameData.currentChallengeAnswer;
    
    // Visual feedback
    if (element) {
        if (isCorrect) {
            element.classList.add('correct');
        } else {
            element.classList.add('incorrect');
            
            // Find and highlight correct answer
            const options = document.querySelectorAll('.challenge-option');
            options.forEach(opt => {
                if (opt.textContent === gameData.currentChallengeAnswer) {
                    opt.classList.add('correct');
                }
            });
        }
    }
    
    // Delay to show feedback
    setTimeout(() => {
        if (isCorrect) {
            // Correct answer
            if (gameData.takeOverOpportunity) {
                // If taking over opponent's turn
                gameData.humanPoints += 3;
                updatePointsDisplay();
                gameData.takeOverOpportunity = false;
                
                // After taking over, show challenge type selection for next turn
                if (!gameData.gameOver) {
                    showChallengeTypeModal();
                    return; // Don't switch player yet
                }
            }
            
            // Switch player
            switchPlayer();
        } else {
            // Incorrect answer - AI will ask a question instead of player asking themselves
            if (gameData.takeOverOpportunity) {
                // If taking over opponent's turn and answered incorrectly
                gameData.humanPoints -= 3;
                if (gameData.humanPoints < 0) gameData.humanPoints = 0;
                updatePointsDisplay();
                gameData.takeOverOpportunity = false;
            }
            
            // Set flag that human lost their turn
            gameData.humanLostTurn = true;
            
            // Show take over modal for AI to decide
            showTakeOverModal();
        }
    }, 1500); // Show feedback for 1.5 seconds
}

// Take over turn
function takeOverTurn() {
    gameData.takeOverOpportunity = true;
    gameData.consecutiveTurns = 1; // Human will get two consecutive turns
    
    // Show challenge for the AI's word
    showChallenge('human', gameData.aiChallenge, gameData.aiWord);
}

// Switch player
function switchPlayer() {
    if (gameData.gameOver) return;
    
    // Check if player has consecutive turns
    if (gameData.consecutiveTurns > 0) {
        gameData.consecutiveTurns--;
        
        // If human has another turn, show challenge type selection
        if (gameData.currentPlayer === 'human' && gameData.consecutiveTurns > 0) {
            showChallengeTypeModal();
            return;
        }
        
        // If AI has another turn, make another move
        if (gameData.currentPlayer === 'ai' && gameData.consecutiveTurns > 0) {
            makeAIMove();
            return;
        }
    }
    
    // Switch player
    gameData.currentPlayer = gameData.currentPlayer === 'human' ? 'ai' : 'human';
    
    // Randomize new challenge
    if (gameData.currentPlayer === 'human') {
        randomizeChallenge('human');
        
        // AI asks human a challenge about human's word
        aiSelectsChallengeForHuman();
    } else {
        randomizeChallenge('ai');
        
        // If AI's turn, make AI move
        setTimeout(makeAIMove, 1500);
    }
}

// Make AI move
function makeAIMove() {
    if (gameData.gameOver) return;
    
    // Choose a random empty cell
    const emptyCells = [];
    for (let i = 0; i < gameData.board.length; i++) {
        if (gameData.board[i] === null) {
            emptyCells.push(i);
        }
    }
    
    if (emptyCells.length > 0) {
        // Choose a random word for AI that hasn't been placed yet
        const availableWords = Object.keys(gameData.wordDatabase).filter(
            word => !gameData.placedWords.includes(word)
        );
        
        let randomWord;
        if (availableWords.length > 0) {
            randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        } else {
            // If all words have been used, just pick any word
            const words = Object.keys(gameData.wordDatabase);
            randomWord = words[Math.floor(Math.random() * words.length)];
        }
        
        selectWord(randomWord);
        
        // Choose a random cell
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const cellIndex = emptyCells[randomIndex];
        
        // Place word
        placeWord(cellIndex);
    }
}

// Check for win
function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        
        if (gameData.board[a] && gameData.board[b] && gameData.board[c]) {
            if (gameData.board[a].player === gameData.board[b].player && 
                gameData.board[b].player === gameData.board[c].player) {
                
                // Set winner
                gameData.winner = gameData.board[a].player;
                
                // Update points
                if (gameData.winner === 'human') {
                    gameData.humanPoints += 20;
                } else {
                    gameData.aiPoints += 20;
                }
                
                updatePointsDisplay();
                
                // Highlight winning cells
                pattern.forEach(index => {
                    elements.boardCells[index].classList.add('correct-cell');
                });
                
                return true;
            }
        }
    }
    
    return false;
}

// Check for draw
function checkDraw() {
    // Check if all cells are filled
    const allFilled = gameData.board.every(cell => cell !== null);
    
    // If all cells are filled and no winner, it's a draw
    if (allFilled && !gameData.winner) {
        gameData.isDrawn = true;
        return true;
    }
    
    return false;
}

// Handle draw
function handleDraw() {
    // Add 2 points to each player
    gameData.humanPoints += 2;
    gameData.aiPoints += 2;
    updatePointsDisplay();
    
    // Show draw confirmation modal
    showDrawConfirmModal();
}

// Continue after draw (user chose to play again)
function continueAfterDraw() {
    // Clear the board
    gameData.board = Array(9).fill(null);
    gameData.placedWords = [];
    
    // Reset board cells
    elements.boardCells.forEach(cell => {
        cell.classList.remove('human-cell', 'ai-cell', 'correct-cell', 'incorrect-cell');
        cell.innerHTML = '';
    });
    
    // Show word selection for current player
    if (gameData.currentPlayer === 'human') {
        // AI asks human a challenge about human's word
        aiSelectsChallengeForHuman();
    } else {
        setTimeout(makeAIMove, 1500);
    }
}

// End game with draw (user chose to end game)
function endGameWithDraw() {
    gameData.gameOver = true;
    
    // Stop timers
    clearInterval(gameData.challengeTimerInterval);
    
    // Show game over modal with draw message
    gameData.winner = null; // Ensure it's a draw
    setTimeout(showGameOverModal, 1000);
}

// End game
function endGame() {
    gameData.gameOver = true;
    
    // Stop timers
    clearInterval(gameData.challengeTimerInterval);
    
    // Show game over modal
    setTimeout(showGameOverModal, 1000);
}

// Reset game
function resetGame() {
    // Hide game over modal
    hideGameOverModal();
    
    // Start new game
    initGame();
}

// Randomize challenge
function randomizeChallenge(player) {
    const randomIndex = Math.floor(Math.random() * gameData.challengeTypes.length);
    const challenge = gameData.challengeTypes[randomIndex];
    
    if (player === 'ai') {
        gameData.aiChallenge = challenge;
        elements.aiNeedType.textContent = challenge;
    } else {
        gameData.humanChallenge = challenge;
        elements.humanNeedType.textContent = challenge;
    }
}

// Start challenge timer
function startChallengeTimer() {
    let seconds = 20;
    elements.challengeTimer.textContent = seconds;
    
    // Clear any existing timer
    clearInterval(gameData.challengeTimerInterval);
    
    gameData.challengeTimerInterval = setInterval(() => {
        seconds--;
        elements.challengeTimer.textContent = seconds;
        
        if (seconds <= 0) {
            clearInterval(gameData.challengeTimerInterval);
            
            // Time's up
            if (gameData.aiIsResponding) {
                // AI ran out of time - consider as incorrect answer
                gameData.aiAnsweredCorrectly = false;
                
                // Show correct answer
                const options = document.querySelectorAll('.challenge-option');
                options.forEach(opt => {
                    if (opt.textContent === gameData.currentChallengeAnswer) {
                        opt.classList.add('correct');
                    }
                });
                
                // Delay to show feedback
                setTimeout(() => {
                    // Show take over modal only when AI loses its turn
                    gameData.takeOverOpportunity = true;
                    showTakeOverModal();
                }, 1500);
            } else if (gameData.humanIsResponding) {
                // Human ran out of time - consider as incorrect answer
                gameData.humanAnsweredCorrectly = false;
                
                // Show correct answer
                const options = document.querySelectorAll('.challenge-option');
                options.forEach(opt => {
                    if (opt.textContent === gameData.currentChallengeAnswer) {
                        opt.classList.add('correct');
                    }
                });
                
                // Delay to show feedback
                setTimeout(() => {
                    // Set flag that human lost their turn
                    gameData.humanLostTurn = true;
                    
                    // Show take over modal for AI to decide
                    showTakeOverModal();
                }, 1500);
            } else if (gameData.currentPlayer === 'human') {
                // Human ran out of time - consider as incorrect answer
                // Show correct answer
                const options = document.querySelectorAll('.challenge-option');
                options.forEach(opt => {
                    if (opt.textContent === gameData.currentChallengeAnswer) {
                        opt.classList.add('correct');
                    }
                });
                
                // Delay to show feedback
                setTimeout(() => {
                    // If taking over opportunity, reset it
                    if (gameData.takeOverOpportunity) {
                        gameData.takeOverOpportunity = false;
                    }
                    
                    // Set flag that human lost their turn
                    gameData.humanLostTurn = true;
                    
                    // Show take over modal for AI to decide
                    showTakeOverModal();
                }, 1500);
            }
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay(player) {
    if (player === 'ai') {
        const minutes = Math.floor(gameData.aiTimer / 60);
        const seconds = gameData.aiTimer % 60;
        elements.aiTimerValue.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        const minutes = Math.floor(gameData.humanTimer / 60);
        const seconds = gameData.humanTimer % 60;
        elements.humanTimerValue.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Update points display
function updatePointsDisplay() {
    elements.aiPointsValue.textContent = `$${gameData.aiPoints}`;
    elements.humanPointsValue.textContent = `$${gameData.humanPoints}`;
}

// Helper functions
function getRandomWords(count, exclude) {
    const allWords = Object.keys(gameData.wordDatabase);
    const availableWords = allWords.filter(word => !exclude.includes(word));
    
    const result = [];
    while (result.length < count && availableWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const word = availableWords.splice(randomIndex, 1)[0];
        result.push(word);
    }
    
    return result;
}

function getRandomMeanings(count, excludeWord) {
    const allWords = Object.keys(gameData.wordDatabase);
    const availableWords = allWords.filter(word => word !== excludeWord);
    
    const result = [];
    while (result.length < count && availableWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const word = availableWords.splice(randomIndex, 1)[0];
        result.push(gameData.wordDatabase[word].meaning);
    }
    
    return result;
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Custom Challenge Functions

// Show custom challenge modal
function showCustomChallengeModal() {
    // Reset form fields
    elements.challengeWordInput.value = '';
    elements.challengeTypeSelect.value = 'مضاد';
    elements.optionInputs.forEach(input => input.value = '');
    elements.correctOptionRadios[0].checked = true;
    elements.challengePointsInput.value = '5';
    
    // Show modal
    elements.customChallengeModal.classList.add('active');
}

// Hide custom challenge modal
function hideCustomChallengeModal() {
    elements.customChallengeModal.classList.remove('active');
}

// Create custom challenge
function createCustomChallenge() {
    // Get values from form
    const word = elements.challengeWordInput.value.trim();
    const challengeType = elements.challengeTypeSelect.value;
    const points = parseInt(elements.challengePointsInput.value);
    
    // Get options
    const options = [];
    elements.optionInputs.forEach(input => {
        const optionText = input.value.trim();
        if (optionText) {
            options.push(optionText);
        }
    });
    
    // Get correct option index
    let correctOptionIndex = 0;
    elements.correctOptionRadios.forEach((radio, index) => {
        if (radio.checked) {
            correctOptionIndex = index;
        }
    });
    
    // Validate inputs
    if (!word) {
        alert('يرجى إدخال الكلمة');
        return;
    }
    
    if (options.length < 2) {
        alert('يرجى إدخال خيارين على الأقل');
        return;
    }
    
    if (correctOptionIndex >= options.length) {
        alert('يرجى تحديد الإجابة الصحيحة');
        return;
    }
    
    if (isNaN(points) || points < 1 || points > 20) {
        alert('يرجى إدخال عدد نقاط صحيح بين 1 و 20');
        return;
    }
    
    // Create challenge object
    const challenge = {
        word,
        challengeType,
        options,
        correctOptionIndex,
        correctAnswer: options[correctOptionIndex],
        points
    };
    
    // Add to custom challenges
    gameData.customChallenges.push(challenge);
    
    // Hide modal
    hideCustomChallengeModal();
    
    // Start custom challenge directly without showing acceptance modal to player
    gameData.currentCustomChallenge = challenge;
    startCustomChallenge();
}

// Show custom challenge acceptance modal
function showCustomChallengeAcceptModal(challenge) {
    // Store current challenge
    gameData.currentCustomChallenge = challenge;
    
    // Show modal
    elements.customChallengeAcceptModal.classList.add('active');
    
    // Simulate AI decision (90% chance to accept)
    if (Math.random() < 0.9) {
        setTimeout(() => {
            hideCustomChallengeAcceptModal();
            startCustomChallenge();
        }, 2000);
    } else {
        setTimeout(() => {
            hideCustomChallengeAcceptModal();
            declineCustomChallenge();
        }, 2000);
    }
}

// Hide custom challenge acceptance modal
function hideCustomChallengeAcceptModal() {
    elements.customChallengeAcceptModal.classList.remove('active');
}

// Start custom challenge
function startCustomChallenge() {
    const challenge = gameData.currentCustomChallenge;
    
    if (!challenge) return;
    
    // Set flag
    gameData.customChallengeActive = true;
    
    // Clear the word grid
    elements.wordGrid.innerHTML = '';
    
    // Update challenge header
    elements.challengeTitle.textContent = 'تحدي خاص';
    elements.challengeText.textContent = `${challenge.challengeType} للكلمة: ${challenge.word}`;
    elements.statusMessage.textContent = '';
    elements.gameStatus.style.display = 'none';
    elements.challengeTimer.parentElement.style.display = 'block';
    
    // Add options to word grid
    challenge.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('word-item', 'challenge-option');
        optionElement.textContent = option;
        
        // AI is responding to the challenge
        elements.wordGrid.appendChild(optionElement);
    });
    
    // Reset and start timer
    elements.challengeTimer.textContent = '20';
    startCustomChallengeTimer(challenge);
}

// Start custom challenge timer
function startCustomChallengeTimer(challenge) {
    let seconds = 20;
    elements.challengeTimer.textContent = seconds;
    
    // Clear any existing timer
    clearInterval(gameData.challengeTimerInterval);
    
    gameData.challengeTimerInterval = setInterval(() => {
        seconds--;
        elements.challengeTimer.textContent = seconds;
        
        if (seconds <= 0) {
            clearInterval(gameData.challengeTimerInterval);
            
            // Time's up - AI ran out of time
            // Simulate AI answering incorrectly
            simulateAICustomChallengeResponse(challenge, false);
        }
    }, 1000);
    
    // Simulate AI thinking and answering
    setTimeout(() => {
        clearInterval(gameData.challengeTimerInterval);
        
        // AI difficulty determines chance of correct answer
        const aiSuccessRate = gameData.aiDifficulty;
        const isCorrect = Math.random() < aiSuccessRate;
        
        simulateAICustomChallengeResponse(challenge, isCorrect);
    }, 3000); // AI thinks for 3 seconds
}

// Simulate AI response to custom challenge
function simulateAICustomChallengeResponse(challenge, isCorrect) {
    // Find the option elements
    const options = document.querySelectorAll('.challenge-option');
    let selectedOption = null;
    
    if (isCorrect) {
        // AI answers correctly
        selectedOption = options[challenge.correctOptionIndex];
    } else {
        // AI answers incorrectly - choose a random wrong answer
        const wrongOptionIndices = [];
        for (let i = 0; i < challenge.options.length; i++) {
            if (i !== challenge.correctOptionIndex) {
                wrongOptionIndices.push(i);
            }
        }
        
        if (wrongOptionIndices.length > 0) {
            const randomWrongIndex = wrongOptionIndices[Math.floor(Math.random() * wrongOptionIndices.length)];
            selectedOption = options[randomWrongIndex];
        }
    }
    
    // Highlight AI's answer
    if (selectedOption) {
        if (isCorrect) {
            selectedOption.classList.add('correct');
        } else {
            selectedOption.classList.add('incorrect');
            
            // Also highlight the correct answer
            options[challenge.correctOptionIndex].classList.add('correct');
        }
    }
    
    // Update points based on result
    if (isCorrect) {
        // AI answered correctly - AI gets points from human
        gameData.aiPoints += challenge.points;
        gameData.humanPoints -= challenge.points;
        if (gameData.humanPoints < 0) gameData.humanPoints = 0;
    } else {
        // AI answered incorrectly - human gets points
        gameData.humanPoints += challenge.points;
    }
    
    updatePointsDisplay();
    
    // Wait to show feedback then proceed
    setTimeout(() => {
        // Reset custom challenge state
        gameData.customChallengeActive = false;
        gameData.currentCustomChallenge = null;
        
        // Continue with the game
        if (gameData.currentPlayer === 'human') {
            showWordSelection();
        } else {
            makeAIMove();
        }
    }, 2000);
}

// Decline custom challenge
function declineCustomChallenge() {
    // Reset custom challenge state
    gameData.customChallengeActive = false;
    gameData.currentCustomChallenge = null;
    
    // Show message
    alert('تم رفض التحدي من قبل اللاعب الآخر');
    
    // Continue with the game
    if (gameData.currentPlayer === 'human') {
        showWordSelection();
    } else {
        makeAIMove();
    }
}

// Add touch support for mobile devices
function addTouchSupport() {
    elements.boardCells.forEach(cell => {
        cell.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (gameData.currentPlayer === 'human' && !gameData.gameOver && gameData.waitingForPlacement) {
                const cellIndex = cell.getAttribute('data-cell');
                placeWord(cellIndex);
            }
        });
    });
}

// Add error handling
function handleError(error) {
    console.error('Game error:', error);
    alert('حدث خطأ في اللعبة. يرجى تحديث الصفحة.');
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        initGame();
        addTouchSupport();
    } catch (error) {
        handleError(error);
    }
});
















// Game Data
// const gameData = {
//     // Word database with related words
//     wordDatabase: {
//         'نبات': {
//             plural: 'نباتات',
//             singular: 'نبات',
//             antonym: 'حيوان',
//             meaning: 'كائن حي ينمو من الأرض'
//         },
//         'حيوان': {
//             plural: 'حيوانات',
//             singular: 'حيوان',
//             antonym: 'نبات',
//             meaning: 'كائن حي يتحرك ويتنفس'
//         },
//         'بحري': {
//             plural: 'بحريات',
//             singular: 'بحري',
//             antonym: 'بري',
//             meaning: 'متعلق بالبحر'
//         },
//         'جوي': {
//             plural: 'جويات',
//             singular: 'جوي',
//             antonym: 'أرضي',
//             meaning: 'متعلق بالجو أو الهواء'
//         },
//         'حيوي': {
//             plural: 'حيويات',
//             singular: 'حيوي',
//             antonym: 'ميت',
//             meaning: 'مليء بالحياة والنشاط'
//         },
//         'بري': {
//             plural: 'بريات',
//             singular: 'بري',
//             antonym: 'بحري',
//             meaning: 'متعلق بالبر أو اليابسة'
//         },
//         'نبتة': {
//             plural: 'نبتات',
//             singular: 'نبتة',
//             antonym: 'حيوان',
//             meaning: 'نبات صغير'
//         },
//         'حي': {
//             plural: 'أحياء',
//             singular: 'حي',
//             antonym: 'ميت',
//             meaning: 'كائن يتمتع بالحياة'
//         }
//     },
    
//     // Challenge types
//     challengeTypes: ['مضاد', 'مفرد', 'جمع', 'معنى'],
    
//     // Game state
//     currentPlayer: 'human', // 'human' or 'ai'
//     board: Array(9).fill(null),
//     aiWord: '',
//     humanWord: '',
//     aiPoints: 0,
//     humanPoints: 0,
//     gameOver: false,
//     winner: null,
//     aiTimer: 20,
//     humanTimer: 20,
//     aiTimerInterval: null,
//     humanTimerInterval: null,
//     aiChallenge: '',
//     humanChallenge: '',
//     currentChallengeType: '',
//     currentChallengeWord: '',
//     currentChallengeOptions: [],
//     currentChallengeAnswer: '',
//     takeOverOpportunity: false,
//     aiAnsweredCorrectly: true, // Flag to track if AI answered correctly
//     humanAnsweredCorrectly: true, // Flag to track if human answered correctly
//     selectedWord: '', // Track the currently selected word
//     waitingForPlacement: false, // Flag to indicate waiting for word placement
//     consecutiveTurns: 0, // Track consecutive turns for the same player
//     isDrawn: false, // Flag to indicate if the game is drawn
//     placedWords: [], // Track words that have been placed on the board
//     aiDifficulty: 0.9, // AI difficulty level (0.0 to 1.0) - higher means more difficult
//     waitingForChallengeType: false, // Flag to indicate waiting for challenge type selection
//     aiIsResponding: false, // Flag to indicate AI is responding to a challenge
//     humanIsResponding: false, // Flag to indicate human is responding to a challenge
//     aiSelectedChallengeType: '', // Track the challenge type selected by AI for human
//     humanLostTurn: false, // Flag to indicate if human lost their turn
    
//     // Custom challenge data
//     customChallenges: [], // Array to store custom challenges
//     currentCustomChallenge: null, // Current custom challenge being played
//     customChallengeActive: false // Flag to indicate if a custom challenge is active
// };

// // DOM Elements
// const elements = {
//     // Introduction screen elements
//     introScreen: document.getElementById('introScreen'),
//     startGameBtn: document.getElementById('startGameBtn'),
//     gameContainer: document.getElementById('gameContainer'),
    
//     // Game elements
//     wordGrid: document.getElementById('word-grid'),
//     boardCells: document.querySelectorAll('.board-cell'),
//     gameBoard: document.getElementById('game-board'),
//     aiTimerValue: document.getElementById('ai-timer'),
//     humanTimerValue: document.getElementById('human-timer'),
//     aiPointsValue: document.getElementById('ai-points'),
//     humanPointsValue: document.getElementById('human-points'),
//     aiNeedType: document.getElementById('ai-need-type'),
//     humanNeedType: document.getElementById('human-need-type'),
//     takeOverModal: document.getElementById('takeOverModal'),
//     challengeTypeModal: document.getElementById('challengeTypeModal'),
//     challengeTypeOptions: document.getElementById('challenge-type-options'),
//     gameOverModal: document.getElementById('gameOverModal'),
//     challengeHeader: document.getElementById('challenge-header'),
//     challengeTitle: document.getElementById('challenge-title'),
//     challengeText: document.getElementById('challenge-text'),
//     statusMessage: document.getElementById('status-message'),
//     gameStatus: document.getElementById('game-status'),
//     challengeTimer: document.getElementById('challenge-timer'),
//     winnerText: document.querySelector('.winner-text'),
//     finalScore: document.querySelector('.final-score'),
//     playAgainBtn: document.querySelector('.play-again'),
//     takeOverYesBtn: document.querySelector('.takeover-yes'),
//     takeOverNoBtn: document.querySelector('.takeover-no'),
//     aiStartWord: document.getElementById('ai-word'),
//     humanStartWord: document.getElementById('human-word'),
//     drawConfirmModal: document.getElementById('drawConfirmModal'),
//     drawPlayAgainBtn: document.querySelector('.draw-play-again'),
//     drawEndGameBtn: document.querySelector('.draw-end-game'),
//     takeOverText: document.querySelector('.takeover-text'),
    
//     // Custom Challenge Elements
//     customChallengeBtn: document.getElementById('custom-challenge-btn'),
//     customChallengeModal: document.getElementById('customChallengeModal'),
//     challengeWordInput: document.getElementById('challenge-word'),
//     challengeTypeSelect: document.getElementById('challenge-type'),
//     optionInputs: document.querySelectorAll('.option-text'),
//     correctOptionRadios: document.querySelectorAll('input[name="correct-option"]'),
//     challengePointsInput: document.getElementById('challenge-points'),
//     createChallengeBtn: document.getElementById('create-challenge'),
//     cancelChallengeBtn: document.getElementById('cancel-challenge'),
//     customChallengeAcceptModal: document.getElementById('customChallengeAcceptModal'),
//     acceptChallengeBtn: document.querySelector('.accept-challenge'),
//     declineChallengeBtn: document.querySelector('.decline-challenge')
// };

// // Initialize the game
// function initGame() {
//     // Set initial words
//     gameData.aiWord = 'نبات';
//     gameData.humanWord = 'حيوان';
    
//     // Display initial words
//     elements.aiStartWord.textContent = gameData.aiWord;
//     elements.humanStartWord.textContent = gameData.humanWord;
    
//     // Set initial challenges
//     randomizeChallenge('ai');
//     randomizeChallenge('human');
    
//     // Reset game state
//     gameData.board = Array(9).fill(null);
//     gameData.gameOver = false;
//     gameData.winner = null;
//     gameData.aiTimer = 20;
//     gameData.humanTimer = 20;
//     gameData.takeOverOpportunity = false;
//     gameData.aiAnsweredCorrectly = true;
//     gameData.humanAnsweredCorrectly = true;
//     gameData.selectedWord = '';
//     gameData.waitingForPlacement = false;
//     gameData.consecutiveTurns = 0;
//     gameData.isDrawn = false;
//     gameData.placedWords = [];
//     gameData.waitingForChallengeType = false;
//     gameData.aiIsResponding = false;
//     gameData.humanIsResponding = false;
//     gameData.aiSelectedChallengeType = '';
//     gameData.customChallengeActive = false;
//     gameData.currentCustomChallenge = null;
//     gameData.humanLostTurn = false;
    
//     // Reset points
//     gameData.aiPoints = 0;
//     gameData.humanPoints = 0;
//     updatePointsDisplay();
    
//     // Reset board cells
//     elements.boardCells.forEach(cell => {
//         cell.classList.remove('human-cell', 'ai-cell', 'correct-cell', 'incorrect-cell');
//         cell.innerHTML = '';
//         cell.style.backgroundColor = '';
//     });
    
//     // Add event listeners
//     addEventListeners();
    
//     // Start with human player
//     gameData.currentPlayer = 'human';
    
//     // Show word selection for human player
//     showWordSelection();
// }

// // Add event listeners
// function addEventListeners() {
//     // Introduction screen event listener
//     elements.startGameBtn.addEventListener('click', startGame);
    
//     // Board cell event listeners
//     elements.boardCells.forEach(cell => {
//         cell.addEventListener('click', handleCellClick);
//     });
    
//     // Take over modal event listeners
//     elements.takeOverYesBtn.addEventListener('click', handleTakeOverYes);
//     elements.takeOverNoBtn.addEventListener('click', handleTakeOverNo);
    
//     // Game over modal event listener
//     elements.playAgainBtn.addEventListener('click', resetGame);
    
//     // Draw confirmation modal event listeners
//     elements.drawPlayAgainBtn.addEventListener('click', handleDrawPlayAgain);
//     elements.drawEndGameBtn.addEventListener('click', handleDrawEndGame);
    
//     // Custom challenge button event listener
//     elements.customChallengeBtn.addEventListener('click', showCustomChallengeModal);
    
//     // Custom challenge modal event listeners
//     elements.createChallengeBtn.addEventListener('click', createCustomChallenge);
//     elements.cancelChallengeBtn.addEventListener('click', hideCustomChallengeModal);
    
//     // Custom challenge acceptance modal event listeners
//     elements.acceptChallengeBtn.addEventListener('click', acceptCustomChallenge);
//     elements.declineChallengeBtn.addEventListener('click', declineCustomChallenge);
// }

// // Start the game from introduction screen
// function startGame() {
//     // Hide introduction screen
//     elements.introScreen.style.display = 'none';
    
//     // Show game container
//     elements.gameContainer.style.display = 'flex';
    
//     // Initialize the game
//     initGame();
// }

// // Show word selection for current player
// function showWordSelection() {
//     // Clear word grid
//     elements.wordGrid.innerHTML = '';
    
//     // Clear challenge text
//     elements.challengeText.textContent = '';
    
//     // Reset game status
//     elements.statusMessage.textContent = '';
    
//     if (gameData.currentPlayer === 'human') {
//         // Show word selection for human player
//         if (!gameData.waitingForPlacement) {
//             // Show word selection title
//             elements.challengeTitle.textContent = 'اختر كلمة للبدء';
            
//             // Add words to grid
//             for (const word in gameData.wordDatabase) {
//                 if (!gameData.placedWords.includes(word)) {
//                     const wordItem = document.createElement('div');
//                     wordItem.classList.add('word-item');
//                     wordItem.textContent = word;
//                     wordItem.addEventListener('click', () => handleWordSelection(word));
//                     elements.wordGrid.appendChild(wordItem);
//                 }
//             }
//         } else {
//             // Show placement instruction
//             elements.challengeTitle.textContent = 'اختر مكان للعب';
//         }
        
//         // Start human timer
//         startTimer('human');
//     } else if (gameData.currentPlayer === 'ai') {
//         // Show AI thinking message
//         elements.challengeTitle.textContent = 'دور اللاعب الآخر';
//         elements.challengeText.textContent = 'يفكر اللاعب الآخر...';
        
//         // Start AI timer
//         startTimer('ai');
        
//         // AI takes its turn after a short delay
//         setTimeout(aiTurn, 1500);
//     }
// }

// // Handle word selection
// function handleWordSelection(word) {
//     // Set selected word
//     gameData.selectedWord = word;
    
//     // Highlight selected word
//     const wordItems = elements.wordGrid.querySelectorAll('.word-item');
//     wordItems.forEach(item => {
//         if (item.textContent === word) {
//             item.classList.add('selected');
//         } else {
//             item.classList.remove('selected');
//         }
//     });
    
//     // Set waiting for placement flag
//     gameData.waitingForPlacement = true;
    
//     // Update challenge title
//     elements.challengeTitle.textContent = 'اختر مكان للعب';
// }

// // Handle cell click
// function handleCellClick(event) {
//     const cell = event.target;
//     const cellIndex = parseInt(cell.getAttribute('data-cell'));
    
//     // Check if cell is already occupied
//     if (gameData.board[cellIndex] !== null) {
//         return;
//     }
    
//     // Check if game is over
//     if (gameData.gameOver) {
//         return;
//     }
    
//     // Check if it's human's turn and waiting for placement
//     if (gameData.currentPlayer === 'human' && gameData.waitingForPlacement) {
//         // Place word on board
//         gameData.board[cellIndex] = {
//             player: 'human',
//             word: gameData.selectedWord
//         };
        
//         // Add word to placed words
//         gameData.placedWords.push(gameData.selectedWord);
        
//         // Update cell appearance
//         cell.classList.add('human-cell');
//         cell.innerHTML = `<span class="word-in-cell">${gameData.selectedWord}</span>`;
        
//         // Reset waiting for placement flag
//         gameData.waitingForPlacement = false;
        
//         // Check for win
//         if (checkWin('human')) {
//             endGame('human');
//             return;
//         }
        
//         // Check for draw
//         if (checkDraw()) {
//             handleDraw();
//             return;
//         }
        
//         // Switch to AI turn
//         gameData.currentPlayer = 'ai';
        
//         // Show word selection for AI
//         showWordSelection();
//     }
// }

// // AI turn
// function aiTurn() {
//     // AI selects a word
//     const availableWords = Object.keys(gameData.wordDatabase).filter(word => !gameData.placedWords.includes(word));
//     const selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
//     // AI selects a cell
//     const availableCells = [];
//     for (let i = 0; i < gameData.board.length; i++) {
//         if (gameData.board[i] === null) {
//             availableCells.push(i);
//         }
//     }
    
//     const selectedCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    
//     // Place word on board
//     gameData.board[selectedCell] = {
//         player: 'ai',
//         word: selectedWord
//     };
    
//     // Add word to placed words
//     gameData.placedWords.push(selectedWord);
    
//     // Update cell appearance
//     const cell = elements.boardCells[selectedCell];
//     cell.classList.add('ai-cell');
//     cell.innerHTML = `<span class="word-in-cell">${selectedWord}</span>`;
    
//     // Check for win
//     if (checkWin('ai')) {
//         endGame('ai');
//         return;
//     }
    
//     // Check for draw
//     if (checkDraw()) {
//         handleDraw();
//         return;
//     }
    
//     // Ask human player to select challenge type for AI
//     showChallengeTypeModal();
// }

// // Show challenge type modal
// function showChallengeTypeModal() {
//     // Clear challenge type options
//     elements.challengeTypeOptions.innerHTML = '';
    
//     // Add challenge types to modal
//     gameData.challengeTypes.forEach(type => {
//         const button = document.createElement('button');
//         button.classList.add('challenge-type-option');
//         button.textContent = type;
//         button.addEventListener('click', () => handleChallengeTypeSelection(type));
//         elements.challengeTypeOptions.appendChild(button);
//     });
    
//     // Show modal
//     elements.challengeTypeModal.classList.add('active');
    
//     // Set waiting for challenge type flag
//     gameData.waitingForChallengeType = true;
// }

// // Handle challenge type selection
// function handleChallengeTypeSelection(type) {
//     // Hide modal
//     elements.challengeTypeModal.classList.remove('active');
    
//     // Set current challenge type
//     gameData.currentChallengeType = type;
    
//     // Reset waiting for challenge type flag
//     gameData.waitingForChallengeType = false;
    
//     // Get AI's last played word
//     const aiLastWord = gameData.board.find(cell => cell && cell.player === 'ai')?.word || gameData.aiWord;
    
//     // Set current challenge word
//     gameData.currentChallengeWord = aiLastWord;
    
//     // Generate challenge options
//     generateChallengeOptions(aiLastWord, type);
    
//     // Show challenge to AI
//     showChallengeToAI(aiLastWord, type);
// }

// // Generate challenge options
// function generateChallengeOptions(word, type) {
//     // Get correct answer based on challenge type
//     let correctAnswer = '';
//     switch (type) {
//         case 'مضاد':
//             correctAnswer = gameData.wordDatabase[word].antonym;
//             break;
//         case 'مفرد':
//             correctAnswer = gameData.wordDatabase[word].singular;
//             break;
//         case 'جمع':
//             correctAnswer = gameData.wordDatabase[word].plural;
//             break;
//         case 'معنى':
//             correctAnswer = gameData.wordDatabase[word].meaning;
//             break;
//     }
    
//     // Set current challenge answer
//     gameData.currentChallengeAnswer = correctAnswer;
    
//     // Generate incorrect options
//     const allAnswers = Object.values(gameData.wordDatabase).map(wordData => {
//         switch (type) {
//             case 'مضاد':
//                 return wordData.antonym;
//             case 'مفرد':
//                 return wordData.singular;
//             case 'جمع':
//                 return wordData.plural;
//             case 'معنى':
//                 return wordData.meaning;
//         }
//     });
    
//     // Filter out correct answer and duplicates
//     const incorrectOptions = [...new Set(allAnswers.filter(answer => answer !== correctAnswer))];
    
//     // Select random incorrect options
//     const selectedIncorrectOptions = [];
//     while (selectedIncorrectOptions.length < 3 && incorrectOptions.length > 0) {
//         const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
//         selectedIncorrectOptions.push(incorrectOptions[randomIndex]);
//         incorrectOptions.splice(randomIndex, 1);
//     }
    
//     // Combine correct answer and incorrect options
//     const options = [correctAnswer, ...selectedIncorrectOptions];
    
//     // Shuffle options
//     for (let i = options.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [options[i], options[j]] = [options[j], options[i]];
//     }
    
//     // Set current challenge options
//     gameData.currentChallengeOptions = options;
// }

// // Show challenge to AI
// function showChallengeToAI(word, type) {
//     // Clear word grid
//     elements.wordGrid.innerHTML = '';
    
//     // Update challenge title and text
//     elements.challengeTitle.textContent = `تحدي للاعب الآخر`;
//     elements.challengeText.textContent = `ما هو ${type} كلمة "${word}"؟`;
    
//     // Add options to grid
//     gameData.currentChallengeOptions.forEach(option => {
//         const optionItem = document.createElement('div');
//         optionItem.classList.add('word-item', 'challenge-option');
//         optionItem.textContent = option;
//         elements.wordGrid.appendChild(optionItem);
//     });
    
//     // Set AI is responding flag
//     gameData.aiIsResponding = true;
    
//     // AI responds to challenge after a delay
//     setTimeout(aiRespondToChallenge, 2000);
// }

// // AI responds to challenge
// function aiRespondToChallenge() {
//     // Get all challenge options
//     const optionItems = elements.wordGrid.querySelectorAll('.challenge-option');
    
//     // Determine if AI answers correctly based on difficulty
//     const answersCorrectly = Math.random() < gameData.aiDifficulty;
    
//     // Find correct and incorrect options
//     let correctOptionItem = null;
//     let incorrectOptionItems = [];
    
//     optionItems.forEach(item => {
//         if (item.textContent === gameData.currentChallengeAnswer) {
//             correctOptionItem = item;
//         } else {
//             incorrectOptionItems.push(item);
//         }
//     });
    
//     if (answersCorrectly) {
//         // AI answers correctly
//         correctOptionItem.classList.add('correct');
        
//         // Update game status
//         elements.statusMessage.textContent = 'إجابة صحيحة!';
        
//         // Set AI answered correctly flag
//         gameData.aiAnsweredCorrectly = true;
        
//         // Reset AI is responding flag
//         gameData.aiIsResponding = false;
        
//         // Switch to human turn after a delay
//         setTimeout(() => {
//             // Switch to human turn
//             gameData.currentPlayer = 'human';
            
//             // AI asks human a challenge
//             askHumanChallenge();
//         }, 1500);
//     } else {
//         // AI answers incorrectly
//         const randomIncorrectOption = incorrectOptionItems[Math.floor(Math.random() * incorrectOptionItems.length)];
//         randomIncorrectOption.classList.add('incorrect');
//         correctOptionItem.classList.add('correct');
        
//         // Update game status
//         elements.statusMessage.textContent = 'إجابة خاطئة!';
        
//         // Set AI answered correctly flag
//         gameData.aiAnsweredCorrectly = false;
        
//         // Reset AI is responding flag
//         gameData.aiIsResponding = false;
        
//         // Show take over modal for human after a delay
//         setTimeout(() => {
//             showTakeOverModal('ai');
//         }, 1500);
//     }
// }

// // Ask human a challenge
// function askHumanChallenge() {
//     // Clear word grid
//     elements.wordGrid.innerHTML = '';
    
//     // Randomly select challenge type for human
//     const challengeType = gameData.challengeTypes[Math.floor(Math.random() * gameData.challengeTypes.length)];
//     gameData.aiSelectedChallengeType = challengeType;
    
//     // Get human's last played word
//     const humanLastWord = gameData.board.find(cell => cell && cell.player === 'human')?.word || gameData.humanWord;
    
//     // Update challenge title and text
//     elements.challengeTitle.textContent = `تحدي من اللاعب الآخر`;
//     elements.challengeText.textContent = `ما هو ${challengeType} كلمة "${humanLastWord}"؟`;
    
//     // Generate challenge options for human
//     let correctAnswer = '';
//     switch (challengeType) {
//         case 'مضاد':
//             correctAnswer = gameData.wordDatabase[humanLastWord].antonym;
//             break;
//         case 'مفرد':
//             correctAnswer = gameData.wordDatabase[humanLastWord].singular;
//             break;
//         case 'جمع':
//             correctAnswer = gameData.wordDatabase[humanLastWord].plural;
//             break;
//         case 'معنى':
//             correctAnswer = gameData.wordDatabase[humanLastWord].meaning;
//             break;
//     }
    
//     // Set current challenge answer
//     gameData.currentChallengeAnswer = correctAnswer;
    
//     // Generate incorrect options
//     const allAnswers = Object.values(gameData.wordDatabase).map(wordData => {
//         switch (challengeType) {
//             case 'مضاد':
//                 return wordData.antonym;
//             case 'مفرد':
//                 return wordData.singular;
//             case 'جمع':
//                 return wordData.plural;
//             case 'معنى':
//                 return wordData.meaning;
//         }
//     });
    
//     // Filter out correct answer and duplicates
//     const incorrectOptions = [...new Set(allAnswers.filter(answer => answer !== correctAnswer))];
    
//     // Select random incorrect options
//     const selectedIncorrectOptions = [];
//     while (selectedIncorrectOptions.length < 3 && incorrectOptions.length > 0) {
//         const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
//         selectedIncorrectOptions.push(incorrectOptions[randomIndex]);
//         incorrectOptions.splice(randomIndex, 1);
//     }
    
//     // Combine correct answer and incorrect options
//     const options = [correctAnswer, ...selectedIncorrectOptions];
    
//     // Shuffle options
//     for (let i = options.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [options[i], options[j]] = [options[j], options[i]];
//     }
    
//     // Add options to grid
//     options.forEach(option => {
//         const optionItem = document.createElement('div');
//         optionItem.classList.add('word-item', 'challenge-option');
//         optionItem.textContent = option;
//         optionItem.addEventListener('click', () => checkHumanAnswer(option));
//         elements.wordGrid.appendChild(optionItem);
//     });
    
//     // Set human is responding flag
//     gameData.humanIsResponding = true;
    
//     // Start human timer
//     startTimer('human');
// }

// // Check human answer
// function checkHumanAnswer(answer) {
//     // Stop timer
//     stopTimer('human');
    
//     // Get all challenge options
//     const optionItems = elements.wordGrid.querySelectorAll('.challenge-option');
    
//     // Find selected option
//     let selectedOption = null;
//     optionItems.forEach(item => {
//         if (item.textContent === answer) {
//             selectedOption = item;
//         }
//     });
    
//     if (answer === gameData.currentChallengeAnswer) {
//         // Human answers correctly
//         selectedOption.classList.add('correct');
        
//         // Update game status
//         elements.statusMessage.textContent = 'إجابة صحيحة!';
        
//         // Set human answered correctly flag
//         gameData.humanAnsweredCorrectly = true;
        
//         // Reset human is responding flag
//         gameData.humanIsResponding = false;
        
//         // Show word selection after a delay
//         setTimeout(() => {
//             showWordSelection();
//         }, 1500);
//     } else {
//         // Human answers incorrectly
//         selectedOption.classList.add('incorrect');
        
//         // Find correct option and highlight it
//         optionItems.forEach(item => {
//             if (item.textContent === gameData.currentChallengeAnswer) {
//                 item.classList.add('correct');
//             }
//         });
        
//         // Update game status
//         elements.statusMessage.textContent = 'إجابة خاطئة!';
        
//         // Set human answered correctly flag
//         gameData.humanAnsweredCorrectly = false;
        
//         // Reset human is responding flag
//         gameData.humanIsResponding = false;
        
//         // Set human lost turn flag
//         gameData.humanLostTurn = true;
        
//         // Show take over modal for AI after a delay
//         setTimeout(() => {
//             showTakeOverModal('human');
//         }, 1500);
//     }
// }

// // Show take over modal
// function showTakeOverModal(player) {
//     // Update modal text based on player
//     if (player === 'ai') {
//         elements.takeOverText.textContent = 'لم يستطع اللاعب الآخر الإجابة. هل تريد أخذ دوره؟';
//     } else if (player === 'human') {
//         // Simulate AI decision (always takes over)
//         handleAITakeOver();
//         return;
//     }
    
//     // Show modal
//     elements.takeOverModal.classList.add('active');
    
//     // Set take over opportunity flag
//     gameData.takeOverOpportunity = true;
// }

// // Handle AI take over
// function handleAITakeOver() {
//     // AI always takes over human's turn
//     console.log('AI takes over human turn');
    
//     // AI gets consecutive turns
//     gameData.consecutiveTurns = 1;
    
//     // AI continues with its turn
//     gameData.currentPlayer = 'ai';
    
//     // Reset human lost turn flag
//     gameData.humanLostTurn = false;
    
//     // Show word selection for AI
//     showWordSelection();
// }

// // Handle take over yes
// function handleTakeOverYes() {
//     // Hide modal
//     elements.takeOverModal.classList.remove('active');
    
//     // Reset take over opportunity flag
//     gameData.takeOverOpportunity = false;
    
//     // Human takes over AI's turn
//     if (!gameData.aiAnsweredCorrectly) {
//         // Human gets consecutive turns
//         gameData.consecutiveTurns = 1;
        
//         // Human continues with its turn
//         gameData.currentPlayer = 'human';
        
//         // Show word selection for human
//         showWordSelection();
//     }
// }

// // Handle take over no
// function handleTakeOverNo() {
//     // Hide modal
//     elements.takeOverModal.classList.remove('active');
    
//     // Reset take over opportunity flag
//     gameData.takeOverOpportunity = false;
    
//     // Continue with normal turn order
//     if (!gameData.aiAnsweredCorrectly) {
//         // Switch to human turn
//         gameData.currentPlayer = 'human';
        
//         // Show word selection for human
//         showWordSelection();
//     }
// }

// // Start timer
// function startTimer(player) {
//     // Stop existing timer
//     stopTimer(player);
    
//     // Set timer interval
//     if (player === 'human') {
//         gameData.humanTimer = 20;
//         elements.challengeTimer.textContent = gameData.humanTimer;
        
//         gameData.humanTimerInterval = setInterval(() => {
//             gameData.humanTimer--;
//             elements.challengeTimer.textContent = gameData.humanTimer;
            
//             if (gameData.humanTimer <= 0) {
//                 // Time's up
//                 stopTimer('human');
                
//                 // Human loses turn
//                 gameData.humanAnsweredCorrectly = false;
//                 gameData.humanLostTurn = true;
                
//                 // Update game status
//                 elements.statusMessage.textContent = 'انتهى الوقت!';
                
//                 // Show take over modal for AI after a delay
//                 setTimeout(() => {
//                     showTakeOverModal('human');
//                 }, 1000);
//             }
//         }, 1000);
//     } else if (player === 'ai') {
//         gameData.aiTimer = 20;
//         elements.challengeTimer.textContent = gameData.aiTimer;
        
//         gameData.aiTimerInterval = setInterval(() => {
//             gameData.aiTimer--;
//             elements.challengeTimer.textContent = gameData.aiTimer;
            
//             if (gameData.aiTimer <= 0) {
//                 // Time's up
//                 stopTimer('ai');
                
//                 // AI loses turn
//                 gameData.aiAnsweredCorrectly = false;
                
//                 // Update game status
//                 elements.statusMessage.textContent = 'انتهى الوقت!';
                
//                 // Show take over modal for human after a delay
//                 setTimeout(() => {
//                     showTakeOverModal('ai');
//                 }, 1000);
//             }
//         }, 1000);
//     }
// }

// // Stop timer
// function stopTimer(player) {
//     if (player === 'human') {
//         clearInterval(gameData.humanTimerInterval);
//     } else if (player === 'ai') {
//         clearInterval(gameData.aiTimerInterval);
//     }
// }

// // Check for win
// function checkWin(player) {
//     const winPatterns = [
//         [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
//         [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
//         [0, 4, 8], [2, 4, 6]             // Diagonals
//     ];
    
//     return winPatterns.some(pattern => {
//         return pattern.every(index => {
//             return gameData.board[index] && gameData.board[index].player === player;
//         });
//     });
// }

// // Check for draw
// function checkDraw() {
//     // Check if all cells are filled
//     return gameData.board.every(cell => cell !== null);
// }

// // Handle draw
// function handleDraw() {
//     // Set drawn flag
//     gameData.isDrawn = true;
    
//     // Show draw confirmation modal
//     elements.drawConfirmModal.classList.add('active');
// }

// // Handle draw play again
// function handleDrawPlayAgain() {
//     // Hide draw confirmation modal
//     elements.drawConfirmModal.classList.remove('active');
    
//     // Add points for draw
//     gameData.aiPoints += 2;
//     gameData.humanPoints += 2;
    
//     // Update points display
//     updatePointsDisplay();
    
//     // Reset board but keep points
//     resetBoardOnly();
// }

// // Handle draw end game
// function handleDrawEndGame() {
//     // Hide draw confirmation modal
//     elements.drawConfirmModal.classList.remove('active');
    
//     // End game with draw
//     endGame('draw');
// }

// // End game
// function endGame(winner) {
//     // Stop timers
//     stopTimer('human');
//     stopTimer('ai');
    
//     // Set game over flag
//     gameData.gameOver = true;
    
//     // Set winner
//     gameData.winner = winner;
    
//     // Update points
//     if (winner === 'human') {
//         gameData.humanPoints += 20;
//     } else if (winner === 'ai') {
//         gameData.aiPoints += 20;
//     }
    
//     // Update points display
//     updatePointsDisplay();
    
//     // Show game over modal
//     if (winner === 'draw') {
//         elements.winnerText.textContent = 'تعادل!';
//     } else if (winner === 'human') {
//         elements.winnerText.textContent = 'لقد فزت!';
//     } else if (winner === 'ai') {
//         elements.winnerText.textContent = 'لقد خسرت!';
//     }
    
//     elements.finalScore.textContent = `النتيجة النهائية: ${gameData.humanPoints} - ${gameData.aiPoints}`;
//     elements.gameOverModal.classList.add('active');
// }

// // Reset game
// function resetGame() {
//     // Hide game over modal
//     elements.gameOverModal.classList.remove('active');
    
//     // Initialize game
//     initGame();
// }

// // Reset board only
// function resetBoardOnly() {
//     // Reset board
//     gameData.board = Array(9).fill(null);
    
//     // Reset placed words
//     gameData.placedWords = [];
    
//     // Reset board cells
//     elements.boardCells.forEach(cell => {
//         cell.classList.remove('human-cell', 'ai-cell', 'correct-cell', 'incorrect-cell');
//         cell.innerHTML = '';
//         cell.style.backgroundColor = '';
//     });
    
//     // Reset game state
//     gameData.gameOver = false;
//     gameData.winner = null;
//     gameData.takeOverOpportunity = false;
//     gameData.aiAnsweredCorrectly = true;
//     gameData.humanAnsweredCorrectly = true;
//     gameData.selectedWord = '';
//     gameData.waitingForPlacement = false;
//     gameData.consecutiveTurns = 0;
//     gameData.isDrawn = false;
//     gameData.waitingForChallengeType = false;
//     gameData.aiIsResponding = false;
//     gameData.humanIsResponding = false;
//     gameData.aiSelectedChallengeType = '';
//     gameData.customChallengeActive = false;
//     gameData.currentCustomChallenge = null;
//     gameData.humanLostTurn = false;
    
//     // Start with human player
//     gameData.currentPlayer = 'human';
    
//     // Show word selection for human player
//     showWordSelection();
// }

// // Update points display
// function updatePointsDisplay() {
//     elements.aiPointsValue.textContent = `$${gameData.aiPoints}`;
//     elements.humanPointsValue.textContent = `$${gameData.humanPoints}`;
// }

// // Randomize challenge
// function randomizeChallenge(player) {
//     const challengeTypes = ['مضاد', 'مفرد', 'جمع', 'معنى'];
//     const randomType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    
//     if (player === 'ai') {
//         gameData.aiChallenge = randomType;
//         elements.aiNeedType.textContent = randomType;
//     } else if (player === 'human') {
//         gameData.humanChallenge = randomType;
//         elements.humanNeedType.textContent = randomType;
//     }
// }

// // Show custom challenge modal
// function showCustomChallengeModal() {
//     // Reset form
//     elements.challengeWordInput.value = '';
//     elements.challengeTypeSelect.value = 'مضاد';
//     elements.optionInputs.forEach(input => input.value = '');
//     elements.correctOptionRadios[0].checked = true;
//     elements.challengePointsInput.value = '5';
    
//     // Show modal
//     elements.customChallengeModal.classList.add('active');
// }

// // Hide custom challenge modal
// function hideCustomChallengeModal() {
//     // Hide modal
//     elements.customChallengeModal.classList.remove('active');
// }

// // Create custom challenge
// function createCustomChallenge() {
//     // Get form values
//     const word = elements.challengeWordInput.value.trim();
//     const type = elements.challengeTypeSelect.value;
//     const options = Array.from(elements.optionInputs).map(input => input.value.trim()).filter(value => value !== '');
//     const correctOptionIndex = Array.from(elements.correctOptionRadios).findIndex(radio => radio.checked);
//     const correctOption = options[correctOptionIndex] || '';
//     const points = parseInt(elements.challengePointsInput.value) || 5;
    
//     // Validate form
//     if (word === '' || options.length < 2 || correctOption === '') {
//         alert('يرجى ملء جميع الحقول المطلوبة');
//         return;
//     }
    
//     // Create challenge object
//     const challenge = {
//         word,
//         type,
//         options,
//         correctOption,
//         points: Math.min(points, 20) // Limit points to 20
//     };
    
//     // Add challenge to custom challenges
//     gameData.customChallenges.push(challenge);
    
//     // Set current custom challenge
//     gameData.currentCustomChallenge = challenge;
    
//     // Hide modal
//     hideCustomChallengeModal();
    
//     // Start custom challenge
//     startCustomChallenge();
// }

// // Start custom challenge
// function startCustomChallenge() {
//     // Set custom challenge active flag
//     gameData.customChallengeActive = true;
    
//     // Show challenge to AI
//     showCustomChallengeToAI();
// }

// // Show custom challenge to AI
// function showCustomChallengeToAI() {
//     // Get current custom challenge
//     const challenge = gameData.currentCustomChallenge;
    
//     // Clear word grid
//     elements.wordGrid.innerHTML = '';
    
//     // Update challenge title and text
//     elements.challengeTitle.textContent = `تحدي مخصص للاعب الآخر`;
//     elements.challengeText.textContent = `ما هو ${challenge.type} كلمة "${challenge.word}"؟`;
    
//     // Add options to grid
//     challenge.options.forEach(option => {
//         const optionItem = document.createElement('div');
//         optionItem.classList.add('word-item', 'challenge-option');
//         optionItem.textContent = option;
//         elements.wordGrid.appendChild(optionItem);
//     });
    
//     // Set AI is responding flag
//     gameData.aiIsResponding = true;
    
//     // AI responds to challenge after a delay
//     setTimeout(aiRespondToCustomChallenge, 2000);
// }

// // AI responds to custom challenge
// function aiRespondToCustomChallenge() {
//     // Get current custom challenge
//     const challenge = gameData.currentCustomChallenge;
    
//     // Get all challenge options
//     const optionItems = elements.wordGrid.querySelectorAll('.challenge-option');
    
//     // Determine if AI answers correctly based on difficulty
//     const answersCorrectly = Math.random() < gameData.aiDifficulty;
    
//     // Find correct and incorrect options
//     let correctOptionItem = null;
//     let incorrectOptionItems = [];
    
//     optionItems.forEach(item => {
//         if (item.textContent === challenge.correctOption) {
//             correctOptionItem = item;
//         } else {
//             incorrectOptionItems.push(item);
//         }
//     });
    
//     if (answersCorrectly) {
//         // AI answers correctly
//         correctOptionItem.classList.add('correct');
        
//         // Update game status
//         elements.statusMessage.textContent = 'إجابة صحيحة!';
        
//         // AI gets points
//         gameData.aiPoints += challenge.points;
//         gameData.humanPoints = Math.max(0, gameData.humanPoints - challenge.points);
        
//         // Update points display
//         updatePointsDisplay();
        
//         // Reset AI is responding flag
//         gameData.aiIsResponding = false;
        
//         // Reset custom challenge active flag
//         gameData.customChallengeActive = false;
        
//         // Continue with normal game flow after a delay
//         setTimeout(() => {
//             // Continue with current player's turn
//             showWordSelection();
//         }, 1500);
//     } else {
//         // AI answers incorrectly
//         const randomIncorrectOption = incorrectOptionItems[Math.floor(Math.random() * incorrectOptionItems.length)];
//         randomIncorrectOption.classList.add('incorrect');
//         correctOptionItem.classList.add('correct');
        
//         // Update game status
//         elements.statusMessage.textContent = 'إجابة خاطئة!';
        
//         // Human gets points
//         gameData.humanPoints += challenge.points;
        
//         // Update points display
//         updatePointsDisplay();
        
//         // Reset AI is responding flag
//         gameData.aiIsResponding = false;
        
//         // Reset custom challenge active flag
//         gameData.customChallengeActive = false;
        
//         // Continue with normal game flow after a delay
//         setTimeout(() => {
//             // Continue with current player's turn
//             showWordSelection();
//         }, 1500);
//     }
// }

// // Accept custom challenge
// function acceptCustomChallenge() {
//     // Hide modal
//     elements.customChallengeAcceptModal.classList.remove('active');
    
//     // Start custom challenge
//     startCustomChallenge();
// }

// // Decline custom challenge
// function declineCustomChallenge() {
//     // Hide modal
//     elements.customChallengeAcceptModal.classList.remove('active');
    
//     // Reset custom challenge active flag
//     gameData.customChallengeActive = false;
    
//     // Continue with normal game flow
//     showWordSelection();
// }

// // Initialize the game when the page loads
// document.addEventListener('DOMContentLoaded', () => {
//     // Show introduction screen
//     elements.introScreen.style.display = 'flex';
//     elements.gameContainer.style.display = 'none';
// });
