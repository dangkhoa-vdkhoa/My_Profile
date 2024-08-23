let score = 0;
let gameActive = false;
let cycles = 0;
const maxCycles = 50;
const requiredRedClicks = 20;
let selectedImageIndex = Math.floor(Math.random() * 3);

function startGame() {
    // Show the game description modal if it hasn't been shown before
    const modalShown = localStorage.getItem('modalShown');
    if (!modalShown) {
        const modal = document.getElementById('gameDescriptionModal');
        const span = document.getElementsByClassName('close')[0];

        modal.style.display = 'block';

        span.onclick = function() {
            modal.style.display = 'none';
            localStorage.setItem('modalShown', 'true');
            initializeGame();
        };

        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
                localStorage.setItem('modalShown', 'true');
                initializeGame();
            }
        };
    } else {
        initializeGame();
    }
}

function initializeGame() {
    score = 0;
    cycles = 0;
    gameActive = true;
    document.getElementById('score').innerText = score;
    document.getElementById('cycleCount').innerText = cycles;
    showImages();
    spawnBoxes();
    cycleBoxes();
}

function spawnBoxes() {
    const gameArea = document.getElementById('gameArea');
    const images = ["image1", "image2", "image3"];
    const greenImage = images[selectedImageIndex];
    const redImages = images.filter((img, index) => index !== selectedImageIndex);

    // Clear existing green boxes
    const existingGreenBoxes = document.querySelectorAll('.greenBox');
    existingGreenBoxes.forEach(box => box.remove());

    // Set the click box (target) with the selected image
    const clickBox = document.getElementById('clickBox');
    clickBox.style.backgroundImage = `url(${document.getElementById(greenImage).src})`;
    clickBox.style.backgroundSize = 'cover';
    clickBox.onclick = function() {
        score++;
        document.getElementById('score').innerText = score;

        if (score >= requiredRedClicks) {
            gameOver('win');
        }
    };

    // Create 5 green boxes with the remaining two images
    for (let i = 0; i < 5; i++) {
        const greenBox = document.createElement('div');
        greenBox.className = 'greenBox';
        greenBox.style.position = 'absolute';
        greenBox.style.width = '50px';
        greenBox.style.height = '50px';
        greenBox.style.display = 'none';
        greenBox.style.cursor = 'pointer';
        greenBox.style.backgroundImage = `url(${document.getElementById(redImages[i % 2]).src})`;
        greenBox.style.backgroundSize = 'cover';
        gameArea.appendChild(greenBox);

        greenBox.onclick = function() {
            gameOver('lose');
        };
    }

    // Hide the unused images below the "Mini Game" title
    hideImages(greenImage);
}

function hideImages(selectedImage) {
    const images = ["image1", "image2", "image3"];
    images.forEach(image => {
        document.getElementById(image).style.display = image === selectedImage ? 'inline-block' : 'none';
    });
}

function showImages() {
    const images = ["image1", "image2", "image3"];
    images.forEach(image => {
        document.getElementById(image).style.display = 'inline-block';
    });
}

function cycleBoxes() {
    if (!gameActive) return;

    moveBoxes();
    showBoxes();
    cycles++;
    document.getElementById('cycleCount').innerText = cycles;

    // Change the selected image every 10 cycles
    if (cycles % 10 === 0) {
        selectedImageIndex = Math.floor(Math.random() * 3);
        spawnBoxes();  // Re-spawn boxes with the new images
    }

    let cycleSpeed = 2000;  // Default speed

    if (score >= 15) {
        cycleSpeed = 500;  // Fastest speed
    } else if (score >= 10) {
        cycleSpeed = 1000;  // Medium speed
    } else if (score >= 5) {
        cycleSpeed = 1500;  // Slow speed
    }

    setTimeout(() => {
        hideBoxes();

        if (gameActive) {
            if (cycles >= maxCycles && score < requiredRedClicks) {
                gameOver('limit');
            } else {
                cycleBoxes();  // Continue cycling with adjusted speed
            }
        }
    }, cycleSpeed);
}

function moveBoxes() {
    const gameArea = document.getElementById('gameArea');
    const clickBox = document.getElementById('clickBox');
    const greenBoxes = document.querySelectorAll('.greenBox');

    const maxX = gameArea.clientWidth - clickBox.offsetWidth;
    const maxY = gameArea.clientHeight - clickBox.offsetHeight;

    // Move red box (target)
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
        alert("You lost! You clicked on a wrong box.");
    } else if (result === 'limit') {
        alert("Bạn đã thua 'Giới hạn 50 vòng mỗi lượt'.");
    }
}
