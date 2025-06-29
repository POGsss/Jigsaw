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
        messageTitle: "Family Meeting",
        messageText: "This was your first time here sa bahay, ininvite ka ni ate sa debut nya tru messenger tas super nervous pa ikaw and unsure if makakapunta ka nyan pero dahil sinundo ka namin wala ka nang nagawa HAHAHAH. Fastforward nung tapos na yung celebration hinatid na namin kayo and sadly di tayo tabi neto since punuan din sa car. This time din super nahihiya ikaw kaya inasar kita sa messenger and dun nalang tayo nagchat HAHAHH grabe din yung sandal mo sa pinto nun parang gusto mo nalang lumabas.",
      },
      {
        rows: 3,
        cols: 3,
        solution: Array.from({ length: 9 }, (_, i) => i + 1),
        messageTitle: "Exchange Gift",
        messageText: "I wasnt expecting na your gonna surprise me this day I thought we're just going to make a hand painting lang as part of our exchange gift for christmas. Nagbuy pa tayo nun ng materials sa SM before we go here sa bahay tas nung nasa jeep na tayo pinapabasa mo na sakin yung letter mo nun sabi ko mamaya na after natin maggawa nung painting. Yun pala kaya want mo na basahin ko kasi sinasagot mo na pala ko that time, sa sobrang happy ko that time naaksidente pako pauwi pero buti nalang nahatid na kita nun.",
      },
      {
        rows: 4,
        cols: 4,
        solution: Array.from({ length: 16 }, (_, i) => i + 1),
        messageTitle: "Our First Kiss",
        messageText: "I can still remember the feeling when our lips touched each other, super saya ko that time kasi full na full yung heart ko. Parang nung mga time na to nawala lahat ng mga problems ko hay, we also make graham that time since birthday ni mama mo yun and also end ng 2022 and swear everytime nakakakita me or nakakakain ng graham yung memory nayon na yung naaalala ko. I'm so happy lang na we both give our first kiss with each other and I always tressure it, hoping na ikaw nadin yung last.",
      },
      {
        rows: 5,
        cols: 5,
        solution: Array.from({ length: 25 }, (_, i) => i + 1),
        messageTitle: "Your Birthday!",
        messageText: "Its your birthday and tbh this time Im super concern about you, nung time na nasa sm palang me and hawak hawak yung gift ko for you wini-wish ko na agad na sana maging happy ikaw sa araw na yun. That day kasi ikaw lang magisa sa bahay nyo nun, may work pa si mama mo nun and si terrence wala din. Kaya hoping me that day na sana mafeel mo padin na birthday mo that time since compared sa previous birthday mo super dami mong bisita then nung dyaan biglang wala kaya di rin me naka ngiti dyan masyado.",
      },
      {
        rows: 6,
        cols: 6,
        solution: Array.from({ length: 36 }, (_, i) => i + 1),
        messageTitle: "Mamu's Birthday!",
        messageText: "This was mama's birthday and dahil special ka invited ka na naman, Ang ganda ng mga pictures natin dito eh nareveal kung gano ka ka inlove sakin. Super cute mo din nung time na to feeling ko part na ikaw ng family namin, lalo yung nag picture kayo nila ate sa gitna feeling sya may birthday HAHAHHA. Pero medj natakot din me nung time na naguwian na us I thought maiiwan ako sainyo muntik pa me bumalik dun sa place wala na pala sila dun buti nalang talaga nakita ako nila ate nakasabay pa me.",
      },
    ];

    // Puzzle Message Properties
    this.transitionMessages = [
      {
        title: "Keep Going!",
        text: "Congrats! you've just solve the first puzzle. But let's not celebrate too early there are still 4 puzzles left to solve. Let's try again with this one.",
      },
      {
        title: "You’re Doing Great",
        text: "Wow, I've never thought you could solve those 2 puzzle that easy. Now let's try to increase the difficulty a little more. Let's see if we can solve this next puzzle.",
      },
      {
        title: "Almost There!",
        text: "Dont stop now, I know it looks hard but look how far you've come! Im sure you'll also solve this one easily. And if you do ill promise to help you in the next one.",
      },
      {
        title: "Let's Solve This Together",
        text: "I know it looks complicated but just like I said earlier Im gonna help you with this one, Ive put some magical button below that lets you see the correct order of each pieces.",
      },
    ];
    
    // Basic Properties
    this.currentPuzzleState = [];
    this.selectedPiece = null;
    this.currentPuzzle = 0;
    this.init();
  }

  // Initialize Base Functions
  init() {
    this.createPuzzle();
    this.setupEventListeners();
  }

  // Create Puzzle Function
  createPuzzle() {
    const nextButton = document.getElementById("nextButton");
    const toggleButton = document.getElementById("toggleButton");
    const solveButton = document.getElementById("solveButton");
    const puzzleBoard = document.getElementById("puzzleBoard");

    toggleButton.disabled = true;
    nextButton.disabled = true;
    solveButton.disabled = true;
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
      piece.style.backgroundImage = `url("assets/puzzle${puzzleNumber}/${number}.png")`;
      piece.style.backgroundSize = "cover";
      piece.style.backgroundPosition = "center";
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

    if (this.currentPuzzle + 1 === this.puzzlesData.length) {
      toggleButton.disabled = false;
    } else {
      toggleButton.disabled = true;
    }
  }

  // Auto Solve Puzzle Function
  autoSolvePuzzle() {
    const { solution } = this.puzzlesData[this.currentPuzzle];
    this.currentPuzzleState = [...solution];

    const pieces = document.querySelectorAll(".puzzle-piece");
    const puzzleNumber = this.currentPuzzle + 1;

    pieces.forEach((piece, index) => {
      const correctNumber = solution[index];

      piece.style.backgroundImage = `url("assets/puzzle${puzzleNumber}/${correctNumber}.png")`;
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

    pieces[index1].style.backgroundImage = `url("assets/puzzle${puzzleNumber}/${img1}.png")`;
    pieces[index2].style.backgroundImage = `url("assets/puzzle${puzzleNumber}/${img2}.png")`;

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
    const toggleButton = document.getElementById("toggleButton");
    const pieces = document.querySelectorAll(".puzzle-piece");

    toggleButton.disabled = true;
    
    puzzleBoard.classList.add("correct");

    pieces.forEach(piece => {
      piece.classList.add("correct");
      piece.style.pointerEvents = "none";
    });

    setTimeout(() => {
      this.showMessage();
      this.updateProgress();
      this.triggerConfetti();
    }, 1000);
  }

  // Update Progress Function
  updateProgress() {
    const progressFill = document.getElementById("progressFill");
    const progressText = document.getElementById("progressText");
    const progress = ((this.currentPuzzle + 1) / this.puzzlesData.length) * 100;

    progressFill.style.width = `${progress}%`;

    if (this.currentPuzzle + 1  >= this.puzzlesData.length) {
      progressText.textContent = "Solved";
    } else {
      progressText.textContent = `${this.currentPuzzle + 2} of ${this.puzzlesData.length}`;
    }
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

    this.triggerFinalConfetti();
  }

  // Trigger Confetti Function
  triggerConfetti() {
    const duration = 1500;
    const end = Date.now() + duration;

    const colors = ["#ffffff", "#ffc756", "#d1193e"];

    const frame = () => { confetti({
        particleCount: 5,
        angle: 45,
        spread: 150,
        origin: { x: 0, y: 1 },
        colors: colors,
        scalar: 1.5,
      });

      confetti({
        particleCount: 5,
        angle: 135,
        spread: 150,
        origin: { x: 1, y: 1 },
        colors: colors,
        scalar: 1.5,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }

  // Trigger Final Confetti Function
  triggerFinalConfetti() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      origin: { y: 0 },
      colors: ["#ffffff", "#ffc756", "#d1193e"],
      scalar: 1.5,
    };

    function frame() {
      confetti({
        ...defaults,
        particleCount: 10,
        angle: 90,
        spread: 150,
        startVelocity: 30,
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    }

    frame();
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
