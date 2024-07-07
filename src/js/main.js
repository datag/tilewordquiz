import { questions } from "./questions.js";

const game = {
    score: 0,
    highscore: 0,
    questionIndex: null,
    optionIndex: null,
};

let $answers;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audio = {
    correct: null,
    wrong: null,
    highscore: null,
};
Object.keys(audio).forEach(sample => loadAudio(sample));

$(function() {
    $answers = $("#answers .answer");

    $("#new-game").click((e) => newGame());

    const isTouchDevice = "ontouchstart" in document.documentElement;
    $answers.on(isTouchDevice ? "touchstart" : "mousedown", (e) => {
        e.preventDefault();

        checkAnswer($(e.target).data("index"));
    });

    newGame();
});

function newGame() {
    game.score = 0;
    game.highscore = 0;

    renderStatus();

    nextQuestion();
}

function renderStatus() {
    $("#score")
        .text(game.score)
        .toggleClass("is-highscore", game.highscore > 0  && game.score > game.highscore);

    const highscore = Math.max(game.score, game.highscore);
    $("#highscore-info")
        .html(`(Highscore: <span class="score">${highscore}</span>)`)
        .toggle(game.highscore > 0 && game.highscore >= game.score);
}

function nextQuestion() {
    const lastQuestionIndex = game.questionIndex;
    while (lastQuestionIndex == game.questionIndex) {
        game.questionIndex = Math.floor(Math.random() * questions.length);
    }

    const question = questions[game.questionIndex];
    shuffle(question.options);
    game.optionIndex = Math.floor(Math.random() * question.options.length);

    renderQuestion(question);
}

function checkAnswer(index) {
    const correct = index == game.optionIndex;
    const timeout = correct ? 750 : 3500;
    const $status = $("#status");
    let emoji;

    $answers.eq(game.optionIndex).addClass("correct");

    if (!correct) {
        emoji = "😔";
        game.highscore = game.score;
        game.score = 0;
        $answers.eq(index).addClass("wrong");
        playAudio(audio.wrong);
    } else {
        game.score++;
        $("#score")
            .animate({ opacity: .25 }, 75)
            .animate({ opacity: 1 }, 175);
        if (game.highscore > 0 && game.score == game.highscore + 1) {
            emoji = "😸";
            playAudio(audio.highscore);
        } else {
            emoji = "😄";
            playAudio(audio.correct);
        }
    }

    $status.text(emoji);

    $answers.addClass("disable-clicks");

    renderStatus();

    window.setTimeout(() => {
        $status.text("");
        $answers.removeClass("disable-clicks correct wrong");
        
        nextQuestion();
    }, timeout);
}

function renderQuestion(question) {
    const correctOption = question.options[game.optionIndex];
    
    $("#question").text(correctOption.value);

    $answers.each((i, e) => {
        const option = question.options[i];
        const css = {
            backgroundColor: "inherit",
        };
        let text = "";

        switch (question.type) {
            case "color":
                css.backgroundColor = option.option;
                break;
            case "emoji":
            case "symbol":
            case "alphanumeric":
                text = option.option;
                break;
            default:
                console.error("Unknown question type", option.type);
                return;
        }

        $(e)
            .text(text)
            .removeClass((index, className) => (className.match(/\btype-\S+/g) || []).join(' '))
            .addClass(`type-${question.type}`)
            .css(css)
        ;
    });

    $("#note").toggle(!!question.note);
    $("#note .note-text").text(question.note ? question.note : "");
}

function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}

function loadAudio(sample) {
    const file = `/assets/audio/${sample}.ogg`;
    fetch(file)
        .then(response => response.arrayBuffer())
        .then(data => audioContext.decodeAudioData(data))
        .then(decodedData => {
            audio[sample] = decodedData;
        })
        .catch(error => console.error("Error loading audio file:", file, error));
}

function playAudio(buffer) {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
}
