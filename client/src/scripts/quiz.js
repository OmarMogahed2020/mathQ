"use strict";

let count = 0;
let currentQuestionNumber = 0;
let corrects = 0;

document.getElementById("submit").addEventListener("click", async () => {
    const res = await fetch("/quiz/play");
    const html = await res.text();

    count = document.getElementById("count").value;

    document.open();
    document.write(html);
    document.close();

    for (let i = 0; i < 4; i++) {
        document
            .getElementById(`choice-${i + 1}`)
            .addEventListener("click", answer);
    }

    document.getElementById("result-button").hidden = true
    createQuestion();
});

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function evaluateByHTML(corrects, base) {
    const ratio = corrects / base;
    let color = "green";
    let word = "EXCELLENT!"

    if (ratio === 1) {
        return `<span style="color: ${color};">${word}</span>`;
    } else if (ratio > 0.7) {
        word = "Good";
    } else if (ratio > 0.5) {
        word = "Fine";
    } else if (ratio === 0.5) {
        word = "Not the best time, try again";
        color = "yellow";
    } else {
        word = "Try again, don't give up";
        color = "red";
    }

    return `<span style="color: ${color};">${word}</span>`;
}

function createQuestion() {
    if (currentQuestionNumber > Number(count) - 1) {
        setChoicesDisabled();
        document.getElementById("question-text").innerText = "Done!";
        document.getElementById("choices-box").remove();
        document.getElementById("question-counter").remove();
        document.getElementById("result-button").hidden = false;
        document.getElementById("result-button").addEventListener("click", (e) => {
            const parent = e.target.parentNode;
            const element = document.createElement("div");
            element.innerHTML = `<div>${evaluateByHTML(corrects, count)} ${corrects} out of ${count}</div>`
            element.style.fontSize = "30px";
            element.style.textAlign = "center";
            parent.appendChild(element);
            e.target.remove();
        });
        return;
    }

    const question = document.getElementById("question-text");
    const counter = document.getElementById("question-counter");
    question.innerText = `${randomInt(1, 50)} + ${randomInt(1, 50)}`;
    counter.innerText = `${++currentQuestionNumber} / ${count}`;

    const correctAnswer = eval(question.innerText);
    const whereWillItBe = randomInt(0, 3);

    for (let i = 0; i < 4; i++) {
        btn = document.getElementById(`choice-${i + 1}`);
        if (i === whereWillItBe) {
            btn.innerText = `${correctAnswer}`;
        } else {
            btn.innerText = `${randomInt(1, 100)}`;
        }
    }
}

function setChoicesDisabled(state = true) {
    try {
        for (let i = 0; i < 4; i++) {
            document.getElementById(`choice-${i + 1}`).disabled = state;
        }
    } catch (e) { }
}

function answer(event) {
    const oldColor = event.target.style.backgroundColor;
    if (
        event.target.innerText ==
        eval(document.getElementById("question-text").innerText)
    ) {
        event.target.style.backgroundColor = "green";
        corrects++;
    } else {
        event.target.style.backgroundColor = "red";
    }

    setChoicesDisabled();
    setTimeout(() => {
        event.target.style.backgroundColor = oldColor;
        createQuestion();
        setChoicesDisabled(false);
    }, 500);
}