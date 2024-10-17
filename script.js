const startButton = document.querySelector('#starting');
const restartButton = document.querySelector('#restarting');
const gridSizeSelect = document.querySelector("#grid-size");
const movesElement = document.querySelector("#moves");
const timeElement = document.querySelector("#time");
const winModal = document.querySelector(".win");
const finalMovesElement = document.getElementById('final-moves');
const finalTimeElement = document.getElementById('final-time');
const highScoreElement = document.getElementById('high-score');
const playAgainButton = document.getElementById('play-again');
const gameContainer = document.querySelector('.container');

let gridSize = '3x2';
let cards = [];
let firstCard = null;
let secondCard = null;
let moves = 0;
let timer;
let seconds = 0;
let highScore = Infinity;
let timerStarted = false;

// List of emojis
const emojiList = ["😀", "😂", "😎", "😍", "🥳", "🤩", "😇", "🤠", "😜", "😸", "🦄", "🐍", "🐙", "🍕", "🎉", "🚀", "⚽️", "🎸", "🎮", "🎁","👛","🏀","🎹","💊","☃️","🌈","🌜","🌻","🍒","🍉","💀","👽","🐬","🐣","🎃","✏️","🔫","🍔","🌭"];

function startGame() {
    clearInterval(timer);
    seconds = 0;
    moves = 0;
    timeElement.textContent = seconds;
    movesElement.textContent = moves;
    timerStarted = false;

    const [rows, cols] = gridSize.split('x').map(Number);
    const totalCards = rows * cols;

    // Select emojis and shuffle them
    const selectedEmojis = emojiList.sort(() => 0.5 - Math.random()).slice(0, totalCards / 2);
    cards = [...selectedEmojis, ...selectedEmojis].sort(() => 0.5 - Math.random());

    // Build the grid
    gameContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gameContainer.innerHTML = '';
    cards.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = emoji;
        card.innerHTML = `
            <div class="card-front hidden">${emoji}</div>
            <div class="card-back"></div>
        `;
        card.addEventListener('click', handleCardClick);
        gameContainer.appendChild(card);
    });
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        timeElement.textContent = seconds;
    }, 1000);
}

function handleCardClick(e) {
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    const clickedCard = e.currentTarget;

    if (firstCard && secondCard) return;

    if (!clickedCard.classList.contains('flipped')) {
        clickedCard.classList.add('flipped');
        clickedCard.querySelector('.card-front').classList.remove('hidden');
        clickedCard.querySelector('.card-back').classList.add('hidden');

        if (!firstCard) {
            firstCard = clickedCard;
        } else if (clickedCard !== firstCard) {
            secondCard = clickedCard;
            moves++;
            movesElement.textContent = moves;
            checkForMatch();
        }
    }
}

function checkForMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.classList.add('vanished');
        secondCard.classList.add('vanished');
        firstCard = null;
        secondCard = null;

        if (document.querySelectorAll('.card:not(.vanished)').length === 0) {
            clearInterval(timer);
            showWinModal();
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.querySelector('.card-front').classList.add('hidden');
            firstCard.querySelector('.card-back').classList.remove('hidden');
            secondCard.querySelector('.card-front').classList.add('hidden');
            secondCard.querySelector('.card-back').classList.remove('hidden');
            firstCard = null;
            secondCard = null;
        }, 1000);
    }
}

function showWinModal() {
    finalMovesElement.textContent = moves;
    finalTimeElement.textContent = seconds;
    if (seconds < highScore) {
        highScore = seconds;
        highScoreElement.textContent = highScore;
    }
    winModal.style.display = 'block';
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
playAgainButton.addEventListener('click', () => {
    winModal.style.display = 'none';
    startGame();
});
gridSizeSelect.addEventListener('change', () => {
    gridSize = gridSizeSelect.value;
    startGame();
});
