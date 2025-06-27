// Event Listener For Window Load
window.addEventListener("load", function () {
  setTimeout(loaded, 2500);

  function loaded() {
    var load = document.getElementById("loader");
    load.style.left = "-100%";
    load.style.borderRight = "100px solid #D1193E";
    load.style.visibility = "hidden";
  }
});

// Event Listener For Document Load
document.addEventListener("DOMContentLoaded", function () {
  // Initialize New LoveLetterPuzzle Class
  new LoveLetterPuzzle();
});

// Love Letter Class
class LoveLetterPuzzle {
  // Class Constructor
  constructor() {
    // Puzzle Data Properties
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
        messageTitle: "Perfect Peace...",
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

    // Puzzle Message Properties
    this.transitionMessages = [
      {
        title: "Ready for the Next One?",
        text: "Each picture tells a story. Let’s rebuild another memory together.",
      },
      {
        title: "Deeper into Us...",
        text: "Every piece brings us closer. Let’s solve the next one hand in hand.",
      },
      {
        title: "Don’t Stop Now ❤️",
        text: "There’s beauty in every broken piece — you’re doing great!",
      },
      {
        title: "Almost There...",
        text: "Another memory waits to be pieced back together. Let’s do it.",
      },
    ];
    
    // Basic Properties
    this.currentPuzzleState = [];
    this.selectedPiece = null;
    this.hintTimeout = null;
    this.currentPuzzle = 0;
    this.hintDelay = 5000;
    this.init();
  }

  // Initialize Base Functions
  init() {
    this.updateProgress();
    this.createPuzzle();
    this.setupEventListeners();
  }

  // Create Puzzle Function
  createPuzzle() {
    clearTimeout(this.hintTimeout);

    const nextButton = document.getElementById("nextButton");
    const toggleButton = document.getElementById("toggleButton");
    const puzzleBoard = document.getElementById("puzzleBoard");

    toggleButton.disabled = true;
    nextButton.disabled = true;
    puzzleBoard.innerHTML = "";
    puzzleBoard.classList.remove("correct");

    const { rows, cols } = this.puzzlesData[this.currentPuzzle];
    const totalPieces = rows * cols;

    this.currentPuzzleState = this.shufflePuzzle(
      Array.from({ length: totalPieces }, (_, i) => i + 1)
    );

    puzzleBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    this.currentPuzzleState.forEach((number, index) => {
      const piece = document.createElement("div");
      piece.className = "puzzle-piece";
      piece.dataset.number = number;
      piece.dataset.index = index;

      const puzzleNumber = this.currentPuzzle + 1;
      piece.style.backgroundImage = `url('assets/puzzle${puzzleNumber}/${number}.png')`;
      piece.style.backgroundSize = "cover";
      piece.style.backgroundPosition = "center";
      piece.style.backgroundRepeat = "no-repeat";
      piece.style.backgroundRepeat = "no-repeat";

      const label = document.createElement("span");
      label.className = "piece-label";
      label.textContent = number;
      label.style.display = "none";
      piece.appendChild(label);

      piece.addEventListener("click", () =>
        this.handlePieceClick(piece, index)
      );
      puzzleBoard.appendChild(piece);
    });

    this.hintTimeout = setTimeout(() => {
      toggleButton.disabled = false;
    }, this.hintDelay);

    this.updateProgress();
  }

  // Auto Solve Puzzle Function
  autoSolvePuzzle() {
    const { solution } = this.puzzlesData[this.currentPuzzle];
    this.currentPuzzleState = [...solution];

    const pieces = document.querySelectorAll(".puzzle-piece");
    const puzzleNumber = this.currentPuzzle + 1;

    pieces.forEach((piece, index) => {
      const correctNumber = solution[index];

      piece.style.backgroundImage = `url('assets/puzzle${puzzleNumber}/${correctNumber}.png')`;
      piece.querySelector(".piece-label").textContent = correctNumber;
      piece.classList.remove("selected");
      piece.dataset.number = correctNumber;
    });

    this.checkCompletion();
  }

  // Shuffle Puzzle Function
  shufflePuzzle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Handle Puzzle Piece Click Function
  handlePieceClick(piece, index) {
    if (piece.classList.contains("correct")) return;

    document.querySelectorAll(".puzzle-piece").forEach((p) => {
      p.classList.remove("selected");
    });

    if (this.selectedPiece === null) {
      this.selectedPiece = index;
      piece.classList.add("selected");
    } else if (this.selectedPiece === index) {
      this.selectedPiece = null;
    } else {
      this.swapPieces(this.selectedPiece, index);
      this.selectedPiece = null;
      this.checkCompletion();
    }
  }

  // Swap Puzzle Piece Function
  swapPieces(index1, index2) {
    [this.currentPuzzleState[index1], this.currentPuzzleState[index2]] = [
      this.currentPuzzleState[index2],
      this.currentPuzzleState[index1],
    ];

    const pieces = document.querySelectorAll(".puzzle-piece");
    const puzzleNumber = this.currentPuzzle + 1;

    const img1 = this.currentPuzzleState[index1];
    const img2 = this.currentPuzzleState[index2];

    pieces[index1].style.backgroundImage = `url('assets/puzzle${puzzleNumber}/${img1}.png')`;
    pieces[index2].style.backgroundImage = `url('assets/puzzle${puzzleNumber}/${img2}.png')`;

    pieces[index1].querySelector(".piece-label").textContent = img1;
    pieces[index2].querySelector(".piece-label").textContent = img2;

    pieces[index1].style.transform = "scale(1.1)";
    pieces[index2].style.transform = "scale(1.1)";
    setTimeout(() => {
      pieces[index1].style.transform = "";
      pieces[index2].style.transform = "";
    }, 200);
  }

  // Check Completion Function
  checkCompletion() {
    const solution = this.puzzlesData[this.currentPuzzle].solution;
    const isComplete = this.currentPuzzleState.every(
      (num, index) => num === solution[index]
    );

    if (isComplete) {
      this.completePuzzle();
    }
  }

  // Complete Puzzle Function
  completePuzzle() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.toggleLabels(false);
    
    const puzzleBoard = document.getElementById("puzzleBoard");
    const pieces = document.querySelectorAll(".puzzle-piece");
    
    puzzleBoard.classList.add("correct");

    pieces.forEach(piece => {
      piece.classList.add("correct");
      piece.style.pointerEvents = "none";
    });

    setTimeout(() => {
      this.showMessage();
    }, 1000);
  }

  // Update Progress Function
  updateProgress() {
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");
    const progress = ((this.currentPuzzle + 1) / this.puzzlesData.length) * 100;

    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${this.currentPuzzle + 1} of ${
      this.puzzlesData.length
    }`;
  }

  // Toggle Labels Function
  toggleLabels(show = true) {
    const labels = document.querySelectorAll(".piece-label");
    labels.forEach((label) => {
      label.style.display = show ? "block" : "none";
    });
  }

  // Show Message Function
  showMessage() {
    const toggleButton = document.getElementById("toggleButton");
    const nextButton = document.getElementById("nextButton");
    const messageTitle = document.getElementById("messageTitle");
    const messageText = document.getElementById("messageText");

    toggleButton.disabled = true;
    nextButton.disabled = false;

    const currentPuzzleData = this.puzzlesData[this.currentPuzzle];

    messageTitle.textContent = currentPuzzleData.messageTitle;
    messageText.textContent = currentPuzzleData.messageText;
  }

  // Next Puzzle Function
  nextPuzzle() {
    this.currentPuzzle++;

    if (this.currentPuzzle >= this.puzzlesData.length) {
      this.showFinalLetter();
    } else {
      this.updateProgress();
      this.createPuzzle();
      this.transitionMessage();
    }
  }

  // Transition Message Function
  transitionMessage() {
    const { title, text } = this.transitionMessages[this.currentPuzzle - 1];

    const messageTitle = document.getElementById("messageTitle");
    const messageText = document.getElementById("messageText");
    const nextButton = document.getElementById("nextButton");

    messageTitle.textContent = title;
    messageText.textContent = text;
    nextButton.disabled = true;
  }

  // Show Final Letter Function
  showFinalLetter() {
    const gameContainer = document.getElementById("gameContainer");
    const finalLetter = document.getElementById("finalLetter");

    gameContainer.style.display = "none";
    finalLetter.classList.add("show");
  }

  // Set Up Event Listeners
  setupEventListeners() {
    const nextButton = document.getElementById("nextButton");
    const playButton = document.getElementById("playButton");
    const toggleButton = document.getElementById("toggleButton");
    const solveButton = document.getElementById("solveButton");

    nextButton.addEventListener("click", () => this.nextPuzzle());
    
    playButton.addEventListener("click", () => {
      document.getElementById("menuContainer").classList.remove("show");
      document.getElementById("gameContainer").classList.add("show");
      this.createPuzzle();
    });

    toggleButton.addEventListener("click", () => {
      const anyVisible = document.querySelector(".piece-label")?.style.display !== "none";
      this.toggleLabels(!anyVisible);
    });

    solveButton.addEventListener("click", () => {
      this.autoSolvePuzzle();
    });
  }
}
