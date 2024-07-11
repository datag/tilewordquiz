import { questions } from "./questions.js";

const game = {
    score: 0,
    highscore: 0,
    questionIndex: null,
    optionIndex: null,
    variantIndex: null,
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
    if (questions.length > 1) {
        while (lastQuestionIndex == game.questionIndex) {
            game.questionIndex = randomIndex(questions);
        }
    } else {
        game.questionIndex = 0;
    }

    const question = questions[game.questionIndex];
    shuffle(question.options);
    game.optionIndex = randomIndex(question.options);

    const option = question.options[game.optionIndex];
    game.variantIndex = Array.isArray(option.value) ? randomIndex(option.value) : null;

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

    $answers.add("#new-game")
        .addClass("disable-clicks");

    renderStatus();

    window.setTimeout(() => {
        $status.text("");
        $answers.add("#new-game")
            .removeClass("disable-clicks correct wrong");
        
        nextQuestion();
    }, timeout);
}

function renderQuestion(question) {
    const correctOption = question.options[game.optionIndex];
    
    $("#question")
        .text((game.variantIndex === null) ? correctOption.value : correctOption.value[game.variantIndex])
        .toggleClass("grundschrift", !(question.flags?.includes("no-grundschrift") ?? false))
    ;

    $answers.each((i, e) => {
        const option = question.options[i];
        const isMultiOption = (game.variantIndex !== null && Array.isArray(option.option) && option.option.length > game.variantIndex);
        const optionValue = isMultiOption ? option.option[game.variantIndex] : option.option;
        const css = {
            backgroundColor: "inherit",
        };
        let text = "";

        switch (question.type) {
            case "color":
                css.backgroundColor = optionValue;
                break;
            case "emoji":
            case "symbol":
            case "alphanumeric":
                text = optionValue;
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

function randomIndex(array) {
    return Math.floor(Math.random() * array.length);;
}

function loadAudio(sample) {
    const file = `assets/audio/${sample}.ogg`;
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
