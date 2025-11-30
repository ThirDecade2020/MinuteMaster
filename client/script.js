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
const suggestedInput = document.getElementById('suggested-solution');

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function getTaskStyle(taskName) {
    if (taskName === "Read Instructions Aloud") return "meta";
    if (taskName.includes("Pseudo")) return "pseudocode";
    if (taskName.includes("Space-time-solution")) return "iterative";
    return "code";
}

function updateTaskList(difficulty) {
    taskList.innerHTML = '';
    let durations = taskDurations[difficulty];
    tasks.forEach((task, index) => {
        let li = document.createElement('li');
        li.innerHTML = `${task} - ${(durations[index] / 60).toFixed(2)} min <button class="cheat-btn">Cheat</button><div class="solution-container"></div>`;
        taskList.appendChild(li);
    });

    const cheatButtons = document.querySelectorAll('.cheat-btn');
    cheatButtons.forEach((button, idx) => {
        button.addEventListener('click', () => handleCheat(idx));
    });
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function handleCheat(taskIndex) {
    const li = taskList.children[taskIndex];
    const solutionContainer = li.querySelector('.solution-container');

    // Toggle collapse if already shown
    if (solutionContainer.innerHTML.trim() !== '') {
        solutionContainer.innerHTML = '';
        return;
    }

    const taskStyle = getTaskStyle(tasks[taskIndex]);

    // Handle the special first task
    if (taskStyle === "meta") {
        solutionContainer.innerHTML = `<pre><code>Read the question out loud dummy. Cheating is more applicable to the next tasks.</code></pre>`;
        return;
    }

    solutionContainer.innerHTML = 'Fetching solution...';

    try {
        const response = await fetch('http://localhost:3000/api/solve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                taskName: tasks[taskIndex],
                challengeQuestion: challengeInput.value,
                suggestedSolution: suggestedInput.value,
                taskStyle: taskStyle
            })
        });

        const data = await response.json();
        solutionContainer.innerHTML = `<pre><code>${escapeHtml(data.solution)}</code></pre>`;
    } catch (err) {
        solutionContainer.textContent = 'Error fetching solution. Check console.';
        console.error(err);
    }
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

updateTaskList('easy');

