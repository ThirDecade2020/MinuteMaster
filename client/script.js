let taskDurations = {
    easy: [60, 120, 120, 360, 120, 60, 60],
    medium: [120, 240, 240, 720, 240, 120, 120],
    hard: [180, 360, 360, 1080, 360, 180, 180]
};

let tasks = [
    "Read Instructions Aloud",
    "Pseudo-test-code Aloud",
    "Pseudo-function-code Aloud",
    "Function-code-translation Aloud",
    "Test-code-translation Aloud",
    "Break & Debug Aloud",
    "Space-time-solution-complexity Aloud"
];

let totalSeconds = 900;
let timerInterval;
let currentTaskIndex = 0;
let taskTimeRemaining = taskDurations['easy'][0];

const timeDisplay = document.getElementById('time');
const difficultySelect = document.getElementById('difficulty');
const taskList = document.getElementById('tasks');
const currentTaskDisplay = document.getElementById('current-task');

const challengeInput = document.getElementById('challenge-question');
const suggestedSolutionInput = document.getElementById('suggested-solution');

// Fetch cheat solution from backend API
async function fetchCheatSolution(taskName) {
    const challengeQuestion = challengeInput.value.trim();
    const suggestedSolution = suggestedSolutionInput.value.trim();

    if (!challengeQuestion) {
        return "Please paste the challenge question above to get a solution.";
    }

    try {
        const response = await fetch("http://localhost:3000/api/solve", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                taskName,
                challengeQuestion,
                suggestedSolution
            })
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data.solution || "No solution returned from the AI.";
    } catch (error) {
        console.error("Error fetching solution:", error);
        return "Error fetching solution. Check console for details.";
    }
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function updateTaskList(difficulty) {
    taskList.innerHTML = '';
    let durations = taskDurations[difficulty];

    tasks.forEach((task, index) => {
        const li = document.createElement('li');

        // Task title
        const taskTitle = document.createElement('span');
        taskTitle.textContent = `${task} - ${(durations[index] / 60).toFixed(2)} min`;
        li.appendChild(taskTitle);

        // Cheat button
        const cheatBtn = document.createElement('button');
        cheatBtn.textContent = 'Cheat';
        cheatBtn.style.marginLeft = '10px';
        li.appendChild(cheatBtn);

        // Solution container (hidden by default)
        const solutionDiv = document.createElement('div');
        solutionDiv.style.display = 'none';
        solutionDiv.style.marginTop = '5px';
        solutionDiv.style.padding = '8px';
        solutionDiv.style.backgroundColor = '#f0f0f0';
        solutionDiv.style.borderRadius = '4px';
        li.appendChild(solutionDiv);

        // Cheat button click handler
        cheatBtn.addEventListener('click', async () => {
            if (solutionDiv.style.display === 'none') {
                solutionDiv.textContent = "Loading...";
                solutionDiv.style.display = 'block';
                cheatBtn.textContent = 'Hide';
                const solution = await fetchCheatSolution(task);
                solutionDiv.textContent = solution;
            } else {
                solutionDiv.style.display = 'none';
                cheatBtn.textContent = 'Cheat';
            }
        });

        taskList.appendChild(li);
    });
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(() => {
            if (totalSeconds > 0 && currentTaskIndex < tasks.length) {
                totalSeconds--;
                taskTimeRemaining--;

                timeDisplay.textContent = formatTime(totalSeconds);

                if (taskTimeRemaining <= 0) {
                    currentTaskIndex++;
                    if (currentTaskIndex < tasks.length) {
                        taskTimeRemaining = taskDurations[difficultySelect.value][currentTaskIndex];
                        currentTaskDisplay.textContent = `Task ${currentTaskIndex + 1}: ${tasks[currentTaskIndex]}`;
                    }
                }
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;

    const selectedDifficulty = difficultySelect.value;
    totalSeconds = selectedDifficulty === 'medium' ? 1800 : selectedDifficulty === 'hard' ? 2700 : 900;

    currentTaskIndex = 0;
    taskTimeRemaining = taskDurations[selectedDifficulty][0];

    timeDisplay.textContent = formatTime(totalSeconds);
    currentTaskDisplay.textContent = `Task 1: ${tasks[0]}`;
    updateTaskList(selectedDifficulty);
}

document.getElementById('start').addEventListener('click', startTimer);
document.getElementById('pause').addEventListener('click', pauseTimer);
document.getElementById('reset').addEventListener('click', resetTimer);

difficultySelect.addEventListener('change', (event) => {
    const selectedDifficulty = event.target.value;
    totalSeconds = selectedDifficulty === 'medium' ? 1800 : selectedDifficulty === 'hard' ? 2700 : 900;
    taskTimeRemaining = taskDurations[selectedDifficulty][0];
    timeDisplay.textContent = formatTime(totalSeconds);
    currentTaskIndex = 0;
    currentTaskDisplay.textContent = `Task 1: ${tasks[0]}`;
    updateTaskList(selectedDifficulty);
});

// Initialize task list
updateTaskList('easy');

