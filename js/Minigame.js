let score = 0;
let greenClicks = 0;
let gameActive = false;
const maxGreenClicks = 3;
const requiredRedClicks = 10;
let redClicks = 0;

function startGame() {
    score = 0;
    greenClicks = 0;
    redClicks = 0;
    gameActive = true;
    document.getElementById('score').innerText = score;
    spawnBoxes();
    cycleBoxes();
}

function spawnBoxes() {
    const gameArea = document.getElementById('gameArea');

    // Clear existing green boxes
    const existingGreenBoxes = document.querySelectorAll('.greenBox');
    existingGreenBoxes.forEach(box => box.remove());

    // Create 5 green boxes
    for (let i = 0; i < 5; i++) {
        const greenBox = document.createElement('div');
        greenBox.className = 'greenBox';
        greenBox.style.position = 'absolute';
        greenBox.style.width = '50px';
        greenBox.style.height = '50px';
        greenBox.style.backgroundColor = 'green';
        greenBox.style.display = 'none';
        greenBox.style.cursor = 'pointer';
        gameArea.appendChild(greenBox);

        greenBox.onclick = function() {
            greenClicks++;
            if (greenClicks > maxGreenClicks) {
                gameOver('lose');
            } else {
                hideBoxes();
            }
        };
    }

    // Set red box click behavior
    const clickBox = document.getElementById('clickBox');
    clickBox.onclick = function() {
        redClicks++;
        score++;
        document.getElementById('score').innerText = score;
        if (redClicks >= requiredRedClicks) {
            gameOver('win');
        } else {
            hideBoxes();
        }
    };
}

function cycleBoxes() {
    if (!gameActive) return;

    moveBoxes();
    showBoxes();

    setTimeout(() => {
        hideBoxes();
        if (gameActive) {
            cycleBoxes();
        }
    }, 3000);  // Boxes appear for 3 seconds
}

function moveBoxes() {
    const gameArea = document.getElementById('gameArea');
    const clickBox = document.getElementById('clickBox');
    const greenBoxes = document.querySelectorAll('.greenBox');

    const maxX = gameArea.clientWidth - clickBox.offsetWidth;
    const maxY = gameArea.clientHeight - clickBox.offsetHeight;

    // Move red box
    clickBox.style.left = Math.floor(Math.random() * maxX) + 'px';
    clickBox.style.top = Math.floor(Math.random() * maxY) + 'px';

    // Move green boxes
    greenBoxes.forEach(box => {
        box.style.left = Math.floor(Math.random() * maxX) + 'px';
        box.style.top = Math.floor(Math.random() * maxY) + 'px';
    });
}

function showBoxes() {
    document.getElementById('clickBox').style.display = 'block';
    const greenBoxes = document.querySelectorAll('.greenBox');
    greenBoxes.forEach(box => box.style.display = 'block');
}

function hideBoxes() {
    document.getElementById('clickBox').style.display = 'none';
    const greenBoxes = document.querySelectorAll('.greenBox');
    greenBoxes.forEach(box => box.style.display = 'none');
}

function gameOver(result) {
    gameActive = false;
    hideBoxes();
    if (result === 'win') {
        alert("You win! Congratulations!");
    } else if (result === 'lose') {
        alert("You lost! Too many clicks on green boxes.");
    }
}

// Optionally stop the game after a set time
setTimeout(function() {
    if (gameActive) {
        gameOver('lose');
    }
}, 3000);  // Stop the game after 30 seconds
