window.addEventListener("load", function () {
  setTimeout(loaded, 2500);

  function loaded() {
    var load = document.getElementById("loader");
    load.style.left = "-100%";
    load.style.borderRight = "100px solid #D1193E";
    load.style.visibility = "hidden";
  }
});

class LoveLetterPuzzle {
  constructor() {
    this.currentPuzzle = 0;
    this.puzzlesData = [
      {
        rows: 2,
        cols: 2,
        solution: Array.from({ length: 4 }, (_, i) => i + 1),
        messageTitle: "Where It All Began...",
        messageText:
          "Do you remember our first date? The way you smiled made my heart skip a beat, and I knew right then that you were someone special. That moment changed my life forever.",
      },
      {
        rows: 3,
        cols: 3,
        solution: Array.from({ length: 9 }, (_, i) => i + 1),
        messageTitle: "Magic in the Air...",
        messageText:
          "Under the starlit sky, when our lips first met, time seemed to stop. That kiss was the beginning of a love story I never want to end. You tasted like happiness and forever.",
      },
      {
        rows: 4,
        cols: 4,
        solution: Array.from({ length: 16 }, (_, i) => i + 1),
        messageText:
          "From spontaneous road trips to quiet movie nights, every adventure is better with you by my side. You turn ordinary moments into extraordinary memories.",
      },
      {
        rows: 5,
        cols: 5,
        solution: Array.from({ length: 25 }, (_, i) => i + 1),
        messageTitle: "Perfect Peace...",
        messageText:
          "Those slow Sunday mornings in your arms are my favorite kind of paradise. Coffee tastes better, the sun shines brighter, and life feels complete when I wake up next to you.",
      },
      {
        rows: 6,
        cols: 6,
        solution: Array.from({ length: 36 }, (_, i) => i + 1),
        messageTitle: "My Promise to You...",
        messageText:
          "This is my promise: to love you through every season, to be your partner in every dream, and to choose you every single day. You are my always and forever.",
      },
    ];

    this.currentPuzzleState = [];
    this.selectedPiece = null;
    this.init();
  }

  init() {
    this.updateProgress();
    this.createPuzzle();
    this.setupEventListeners();
  }

  updateProgress() {
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");
    const progress = ((this.currentPuzzle + 1) / this.puzzlesData.length) * 100;

    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Puzzle ${this.currentPuzzle + 1} of ${
      this.puzzlesData.length
    }`;
  }

  createPuzzle() {
    const nextButton = document.getElementById("nextButton");
    const puzzleBoard = document.getElementById("puzzleBoard");

    // Disable Message and Next Button
    nextButton.disabled = true;

    // Clear previous puzzle
    puzzleBoard.innerHTML = "";

    // Create shuffled numbers for puzzle pieces
    const { rows, cols } = this.puzzlesData[this.currentPuzzle];
    const totalPieces = rows * cols;

    this.currentPuzzleState = this.shufflePuzzle(
      Array.from({ length: totalPieces }, (_, i) => i + 1)
    );

    puzzleBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    // Create puzzle pieces
    this.currentPuzzleState.forEach((number, index) => {
      const piece = document.createElement("div");
      piece.className = "puzzle-piece";
      piece.dataset.number = number;
      piece.dataset.index = index;

      const puzzleNumber = this.currentPuzzle + 1;
      piece.style.backgroundImage = `url('assets/puzzle${puzzleNumber}/${number}.jpg')`;
      piece.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
      piece.style.backgroundPosition = `
      ${((number - 1) % cols) * (100 / (cols - 1))}%
      ${Math.floor((number - 1) / cols) * (100 / (rows - 1))}%
    `;
      piece.style.backgroundRepeat = "no-repeat";

      piece.addEventListener("click", () =>
        this.handlePieceClick(piece, index)
      );
      puzzleBoard.appendChild(piece);
    });

    this.updateProgress();
  }

  shufflePuzzle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  handlePieceClick(piece, index) {
    if (piece.classList.contains("correct")) return;

    // Remove previous selection
    document.querySelectorAll(".puzzle-piece").forEach((p) => {
      p.classList.remove("selected");
    });

    if (this.selectedPiece === null) {
      // Select first piece
      this.selectedPiece = index;
      piece.classList.add("selected");
    } else if (this.selectedPiece === index) {
      // Deselect if clicking same piece
      this.selectedPiece = null;
    } else {
      // Swap pieces
      this.swapPieces(this.selectedPiece, index);
      this.selectedPiece = null;
      this.checkCompletion();
    }
  }

  swapPieces(index1, index2) {
    // Swap in state array
    [this.currentPuzzleState[index1], this.currentPuzzleState[index2]] = [
      this.currentPuzzleState[index2],
      this.currentPuzzleState[index1],
    ];

    // Update DOM
    const pieces = document.querySelectorAll(".puzzle-piece");
    const puzzleNumber = this.currentPuzzle + 1;

    // Swap the background images visually
    const img1 = this.currentPuzzleState[index1];
    const img2 = this.currentPuzzleState[index2];

    pieces[
      index1
    ].style.backgroundImage = `url('assets/puzzle${puzzleNumber}/${img1}.png')`;
    pieces[
      index2
    ].style.backgroundImage = `url('assets/puzzle${puzzleNumber}/${img2}.png')`;

    // Optional animation
    pieces[index1].style.transform = "scale(1.1)";
    pieces[index2].style.transform = "scale(1.1)";

    setTimeout(() => {
      pieces[index1].style.transform = "";
      pieces[index2].style.transform = "";
    }, 200);
  }

  checkCompletion() {
    const solution = this.puzzlesData[this.currentPuzzle].solution;
    const isComplete = this.currentPuzzleState.every(
      (num, index) => num === solution[index]
    );

    if (isComplete) {
      this.completePuzzle();
    }
  }

  completePuzzle() {
    // Mark all pieces as correct
    document.querySelectorAll(".puzzle-piece").forEach((piece) => {
      piece.classList.add("correct");
    });

    // Show message after animation
    setTimeout(() => {
      this.showMessage();
    }, 1000);
  }

  showMessage() {
    const messageTitle = document.getElementById("messageTitle");
    const messageText = document.getElementById("messageText");
    const nextButton = document.getElementById("nextButton");

    nextButton.disabled = false;

    const currentPuzzleData = this.puzzlesData[this.currentPuzzle];

    messageTitle.textContent = currentPuzzleData.messageTitle;
    messageText.textContent = currentPuzzleData.messageText;
  }

  nextPuzzle() {
    this.currentPuzzle++;

    if (this.currentPuzzle >= this.puzzlesData.length) {
      this.showFinalLetter();
    } else {
      this.updateProgress();
      this.createPuzzle();
    }
  }

  showFinalLetter() {
    const puzzleContainer = document.getElementById("puzzleContainer");
    const finalLetter = document.getElementById("finalLetter");

    puzzleContainer.style.display = "none";
    finalLetter.classList.add("show");
  }

  setupEventListeners() {
    const nextButton = document.getElementById("nextButton");
    nextButton.addEventListener("click", () => this.nextPuzzle());
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new LoveLetterPuzzle();
});
