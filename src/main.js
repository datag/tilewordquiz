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
};
["correct", "wrong"].forEach(sample => loadAudio(sample));

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
    $("#score").text(game.score);
    $("#highscore").text(game.highscore);
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

    $answers.eq(game.optionIndex).addClass("correct");

    if (!correct) {
        game.score = 0;
        $answers.eq(index).addClass("wrong");
        playAudio(audio.wrong);
    } else {
        game.score++;
        game.highscore = Math.max(game.score, game.highscore);
        playAudio(audio.correct);
    }

    const $status = $("#status");
    $status.text(correct ? "😄" : "😔");

    $answers.addClass("disable-clicks");

    window.setTimeout(() => {
        $status.text("");
        $answers.removeClass("disable-clicks correct wrong");
        
        nextQuestion();
        renderStatus();
    }, correct ? 1000 : 3000);
}

function renderQuestion(question) {
    const correctOption = question.options[game.optionIndex];
    
    $("#question").text(correctOption.value);

    $answers.each((i, e) => {
        // reset element
        $(e)
            .text("")
            .css({
                backgroundColor: "inherit",
                fontSize: "inherit",
                fontFamily: "inherit",
                padding: "inherit",
            })
        ;

        const option = question.options[i];
        switch (question.type) {
            case "color":            
                $(e).css({
                    backgroundColor: option.option,
                });
                break;
            case "emoji":
            case "symbol":
                $(e)
                    .text(option.option)
                    .css({fontSize: "2em"})
                ;
                break;
            case "number":            
                $(e)
                    .text(option.option)
                    .css({
                        fontSize: "2.2em",
                        fontFamily: "Grundschrift",
                        padding: "8px 0 0px 0",     // offset for Grundschrift
                    })
                ;
                break;
            default:
                console.error("Unknown question type", option.type);
                break;
        }
    });
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
    const file = `./assets/${sample}.ogg`;
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
