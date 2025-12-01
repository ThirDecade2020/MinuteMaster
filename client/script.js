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
    if (taskName === "Break & Debug Aloud") return "break-debug";
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
    if (!text || typeof text !== 'string') {
        return '';
    }
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function extractCodeAndComplexity(markdown) {
    // Returns an array of { code: '...', complexity: '...' }
    const codeBlocks = [];
    const regex = /```(?:\w+)?\n([\s\S]*?)```/g;
    let match;
    while ((match = regex.exec(markdown)) !== null) {
        const code = match[1].trim();
        // Extract Time/Space Complexity below code if exists
        let afterCode = markdown.slice(regex.lastIndex);
        let complexityMatch = afterCode.match(/Time Complexity:[^\n]*(\n|$)[\s\S]*?Space Complexity:[^\n]*/i);
        let complexity = complexityMatch ? complexityMatch[0].trim() : '';
        codeBlocks.push({ code, complexity });
    }
    // fallback: if no code blocks, use entire markdown as code
    if (codeBlocks.length === 0) codeBlocks.push({ code: markdown, complexity: '' });
    return codeBlocks;
}

async function handleCheat(taskIndex) {
    const li = taskList.children[taskIndex];
    const solutionContainer = li.querySelector('.solution-container');

    if (solutionContainer.innerHTML.trim() !== '') {
        solutionContainer.innerHTML = '';
        return;
    }

    const taskStyle = getTaskStyle(tasks[taskIndex]);

    if (taskStyle === "meta") {
        solutionContainer.innerHTML = `<pre><code>Read the question out loud dummy. Cheating is more applicable to the next tasks.</code></pre>`;
        return;
    }

    solutionContainer.innerHTML = 'Fetching solution...';

    try {
        const apiUrl = window.API_CONFIG ? window.API_CONFIG.API_URL : 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/solve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                taskName: tasks[taskIndex],
                challengeQuestion: challengeInput.value,
                suggestedSolution: suggestedInput.value,
                taskStyle: taskStyle
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || !data.solution) {
            throw new Error('No solution received from server');
        }

        const solutions = extractCodeAndComplexity(data.solution);

        solutionContainer.innerHTML = '';
        solutions.forEach(s => {
            if (s.code) {
                solutionContainer.innerHTML += `<pre><code>${escapeHtml(s.code)}</code></pre>`;
            }
            if (s.complexity) {
                solutionContainer.innerHTML += `<div class="complexity">${escapeHtml(s.complexity)}</div>`;
            }
        });
    } catch (err) {
        solutionContainer.innerHTML = `<div style="color: red; padding: 10px;">Error: ${escapeHtml(err.message || 'Failed to fetch solution')}</div>`;
        console.error('Error fetching solution:', err);
    }
}

// Timer functions
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

