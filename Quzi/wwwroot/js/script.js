/**
 * Premium Quiz App - Core Logic
 * Handles localStorage persistence, UI rendering, and animations.
 */

// --- Global State ---
let questions = JSON.parse(localStorage.getItem('quiz_questions')) || [];
let currentQuestionIndex = 0;
let selectedAnswers = {}; // Map of index to selected option

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    const isAdminPage = document.getElementById('add-question-form');
    const isQuizPage = document.getElementById('quiz-ui');

    if (isAdminPage) {
        initAdminPage();
    } else if (isQuizPage) {
        initQuizPage();
    }
});

// --- Admin Panel Logic ---
function initAdminPage() {
    const form = document.getElementById('add-question-form');
    const questionsList = document.getElementById('questions-list');
    const qCount = document.getElementById('q-count');

    // Render initial list
    renderAdminList();

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newQuestion = {
            id: Date.now(),
            text: document.getElementById('q-text').value,
            options: {
                A: document.getElementById('opt-a').value,
                B: document.getElementById('opt-b').value,
                C: document.getElementById('opt-c').value,
                D: document.getElementById('opt-d').value
            },
            correct: document.getElementById('correct-opt').value,
            class: document.getElementById('q-class').value,
            solution: document.getElementById('solution-text').value
        };

        questions.push(newQuestion);
        localStorage.setItem('quiz_questions', JSON.stringify(questions));
        
        form.reset();
        renderAdminList();
    });
}

function renderAdminList() {
    const container = document.getElementById('questions-list');
    const countLabel = document.getElementById('q-count');
    const noMsg = document.getElementById('no-questions-msg');

    if (questions.length === 0) {
        noMsg.classList.remove('d-none');
        container.innerHTML = '';
        container.appendChild(noMsg);
        countLabel.textContent = '0';
        return;
    }

    noMsg.classList.add('d-none');
    countLabel.textContent = questions.length;
    
    container.innerHTML = questions.map((q, idx) => `
        <div class="question-list-item d-flex justify-content-between align-items-start">
            <div>
                <span class="badge bg-primary mb-2">Q${idx + 1}</span>
                <span class="badge bg-secondary mb-2">Class ${q.class || 'N/A'}</span>
                <p class="fw-bold mb-1">${q.text}</p>
                <small class="text-muted">Options: A: ${q.options.A} | B: ${q.options.B} | C: ${q.options.C} | D: ${q.options.D}</small>
                <div class="mt-1 text-success small fw-bold">Correct: ${q.correct}</div>
            </div>
            <button onclick="deleteQuestion(${q.id})" class="btn btn-outline-danger btn-sm border-0">
                <i class="bi bi-trash3-fill"></i>
            </button>
        </div>
    `).join('');
}

function deleteQuestion(id) {
    if (confirm('Are you sure you want to delete this question?')) {
        questions = questions.filter(q => q.id !== id);
        localStorage.setItem('quiz_questions', JSON.stringify(questions));
        renderAdminList();
    }
}

// --- Quiz Logic ---
function initQuizPage() {
    const quizUI = document.getElementById('quiz-ui');
    const noData = document.getElementById('no-quiz-data');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const toggleSol = document.getElementById('toggle-solution');

    if (questions.length === 0) {
        noData.classList.remove('d-none');
        quizUI.classList.add('d-none');
        return;
    }

    quizUI.classList.remove('d-none');
    renderQuestion();

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            transitionQuestion(1);
        } else {
            showResults();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            transitionQuestion(-1);
        }
    });

    toggleSol.addEventListener('click', () => {
        const solBox = document.getElementById('solution-box');
        const isShown = solBox.classList.toggle('show');
        toggleSol.innerHTML = isShown 
            ? '<i class="bi bi-eye-slash"></i> Hide Solution' 
            : '<i class="bi bi-lightbulb"></i> Show Solution';
    });
}

function renderQuestion() {
    const q = questions[currentQuestionIndex];
    const progressText = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar');
    const qText = document.getElementById('q-display-text');
    const optionsList = document.getElementById('options-list');
    const solContent = document.getElementById('solution-content');
    const solBox = document.getElementById('solution-box');
    const toggleSol = document.getElementById('toggle-solution');

    // Reset solution box
    solBox.classList.remove('show');
    toggleSol.innerHTML = '<i class="bi bi-lightbulb"></i> Show Solution';

    // Update Progress
    progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;

    // Update Question
    qText.textContent = q.text;
    solContent.innerHTML = `<strong>Correct Answer: ${q.correct}</strong><br>${q.solution}`;

    // Render Options
    optionsList.innerHTML = Object.entries(q.options).map(([key, value]) => `
        <div class="option-card ${selectedAnswers[currentQuestionIndex] === key ? 'selected' : ''}" 
             onclick="selectOption('${key}')">
            <div class="option-prefix">${key}</div>
            <div class="option-text">${value}</div>
        </div>
    `).join('');

    // Update Buttons
    document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
    const nextBtn = document.getElementById('next-btn');
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.innerHTML = 'Finish <i class="bi bi-check-all"></i>';
        nextBtn.classList.replace('btn-primary-premium', 'btn-success');
    } else {
        nextBtn.innerHTML = 'Next <i class="bi bi-arrow-right"></i>';
        nextBtn.classList.replace('btn-success', 'btn-primary-premium');
    }
}

function selectOption(key) {
    if (selectedAnswers[currentQuestionIndex]) return; // Prevent multiple selections

    const q = questions[currentQuestionIndex];
    selectedAnswers[currentQuestionIndex] = key;
    
    const cards = document.querySelectorAll('.option-card');
    cards.forEach(card => {
        const cardKey = card.querySelector('.option-prefix').textContent;
        if (cardKey === key) {
            if (key === q.correct) {
                card.classList.add('correct');
            } else {
                card.classList.add('wrong');
            }
        } else if (cardKey === q.correct) {
            // Highlight the correct one anyway if user got it wrong
            card.classList.add('correct');
        }
    });

    // Automatically move to next question after 1.5 seconds
    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            transitionQuestion(1);
        } else {
            showResults();
        }
    }, 1500);
}

function transitionQuestion(direction) {
    const card = document.querySelector('.quiz-card');
    card.classList.add('fade-out');
    
    setTimeout(() => {
        currentQuestionIndex += direction;
        renderQuestion();
        card.classList.remove('fade-out');
        card.classList.add('fade-in');
        
        setTimeout(() => {
            card.classList.remove('fade-in');
        }, 300);
    }, 300);
}

function showResults() {
    const quizUI = document.getElementById('quiz-ui');
    let score = 0;
    
    questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct) {
            score++;
        }
    });

    quizUI.innerHTML = `
        <div class="text-center py-5">
            <i class="bi bi-trophy-fill display-1 text-warning mb-4"></i>
            <h1 class="fw-bold mb-3">Quiz Completed!</h1>
            <p class="text-muted fs-4 mb-4">You scored <strong>${score}</strong> out of <strong>${questions.length}</strong></p>
            <div class="d-flex justify-content-center gap-3">
                <button onclick="location.reload()" class="btn btn-primary-premium btn-premium">
                    <i class="bi bi-arrow-clockwise"></i> Retake Quiz
                </button>
                <a href="admin.html" class="btn btn-outline-premium btn-premium">
                    <i class="bi bi-gear-fill"></i> Manage Questions
                </a>
            </div>
        </div>
    `;
}

// Global scope for onclick handlers
window.deleteQuestion = deleteQuestion;
window.selectOption = selectOption;
