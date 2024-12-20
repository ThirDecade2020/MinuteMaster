let taskDurations = {
    easy: [60, 120, 120, 360, 120, 60, 60], // Task durations in seconds for easy difficulty
    medium: [120, 240, 240, 720, 240, 120, 120], // Task durations in seconds for medium difficulty
    hard: [180, 360, 360, 1080, 360, 180, 180] // Task durations in seconds for hard difficulty
};

let tasks = [
    "Read Instructions Aloud", // First task in the list
    "Pseudo-test-code Aloud", // Second task in the list
    "Pseudo-function-code Aloud", // Third task in the list
    "Function-code-translation Aloud", // Fourth task in the list
    "Test-code-translation Aloud", // Fifth task in the list
    "Break & Debug Aloud", // Sixth task in the list
    "Space-time-solution-complexity Aloud" // Seventh task in the list
];

let totalSeconds = 900; // Initializes the total countdown time to 900 seconds (15 minutes)
let timerInterval; // Variable to store the interval ID for the timer
let currentTaskIndex = 0; // Index to track the current task being performed
let taskTimeRemaining = taskDurations['easy'][0]; // Initializes remaining time for the first task at easy difficulty

const timeDisplay = document.getElementById('time'); // References the time display element
const difficultySelect = document.getElementById('difficulty'); // References the difficulty selection dropdown
const taskList = document.getElementById('tasks'); // References the task list unordered list
const currentTaskDisplay = document.getElementById('current-task'); // References the current task display element

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60); // Calculates the number of minutes from total seconds
    let remainingSeconds = seconds % 60; // Calculates remaining seconds after minutes are accounted for
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`; // Returns formatted time as mm:ss
}

function updateTaskList(difficulty) {
    taskList.innerHTML = ''; // Clears the existing task list
    let durations = taskDurations[difficulty]; // Retrieves the task durations based on selected difficulty
    tasks.forEach((task, index) => { // Iterates through each task
        let li = document.createElement('li'); // Creates a new list item for the task
        li.textContent = `${task} - ${(durations[index] / 60).toFixed(2)} min`; // Sets the list item's text with duration in minutes
        taskList.appendChild(li); // Appends the list item to the task list
    });
}

function startTimer() {
    if (!timerInterval) { // Checks if the timer is not already running
        timerInterval = setInterval(() => { // Sets up the timer to run at intervals
            if (totalSeconds > 0 && currentTaskIndex < tasks.length) { // Checks if there is time left and tasks remaining
                totalSeconds--; // Decrements total seconds remaining
                taskTimeRemaining--; // Decrements time remaining for the current task

                timeDisplay.textContent = formatTime(totalSeconds); // Updates the time display with formatted time

                if (taskTimeRemaining <= 0) { // Checks if the time for the current task has run out
                    currentTaskIndex++; // Moves to the next task
                    if (currentTaskIndex < tasks.length) { // Checks if there are more tasks remaining
                        taskTimeRemaining = taskDurations[difficultySelect.value][currentTaskIndex]; // Sets time remaining for the next task
                        currentTaskDisplay.textContent = `Task ${currentTaskIndex + 1}: ${tasks[currentTaskIndex]}`; // Updates the current task display
                    }
                }
            } else {
                clearInterval(timerInterval); // Stops the timer if no time or tasks remain
                timerInterval = null; // Resets the timer interval variable
            }
        }, 1000); // Runs the interval every 1000 milliseconds
    }
}

function pauseTimer() {
    clearInterval(timerInterval); // Stops the timer by clearing the interval
    timerInterval = null; // Resets the timer interval variable
}

function resetTimer() {
    clearInterval(timerInterval); // Stops the timer
    timerInterval = null; // Resets the timer interval variable

    const selectedDifficulty = difficultySelect.value; // Gets the currently selected difficulty level
    totalSeconds = selectedDifficulty === 'medium' ? 1800 : selectedDifficulty === 'hard' ? 2700 : 900; // Sets total seconds based on difficulty

    currentTaskIndex = 0; // Resets the current task index to the first task
    taskTimeRemaining = taskDurations[selectedDifficulty][0]; // Resets remaining time for the first task based on difficulty

    timeDisplay.textContent = formatTime(totalSeconds); // Updates the time display with the formatted total time
    currentTaskDisplay.textContent = `Task 1: ${tasks[0]}`; // Resets the current task display to the first task
    updateTaskList(selectedDifficulty); // Updates the task list based on the selected difficulty
}

document.getElementById('start').addEventListener('click', startTimer); // Adds event listener to start button
document.getElementById('pause').addEventListener('click', pauseTimer); // Adds event listener to pause button
document.getElementById('reset').addEventListener('click', resetTimer); // Adds event listener to reset button

difficultySelect.addEventListener('change', (event) => { // Adds event listener for changes in difficulty selection
    const selectedDifficulty = event.target.value; // Gets the new selected difficulty
    totalSeconds = selectedDifficulty === 'medium' ? 1800 : selectedDifficulty === 'hard' ? 2700 : 900; // Sets total seconds based on new difficulty
    taskTimeRemaining = taskDurations[selectedDifficulty][0]; // Resets task time remaining for the first task
    timeDisplay.textContent = formatTime(totalSeconds); // Updates the time display
    currentTaskIndex = 0; // Resets the current task index to the first task
    currentTaskDisplay.textContent = `Task 1: ${tasks[0]}`; // Resets the current task display
    updateTaskList(selectedDifficulty); // Updates the task list for the new difficulty
});

updateTaskList('easy'); // Initializes the task list with the easy difficulty tasks

