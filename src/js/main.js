import { questions } from "./questions.js";
import { AiQuestion } from "./ai.js";
import { Settings } from "./settings.js";

let config;

const game = {
    score: 0,
    highscore: 0,
    questionIndex: null,
    optionIndex: null,
    variantIndex: null,
    fetchedQuestion: null,
};

let $answers;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audio = {
    correct: null,
    wrong: null,
    highscore: null,
};
Object.keys(audio).forEach(sample => loadAudio(sample));

$(async function() {
    $answers = $("#answers .answer");

    $("#new-game").click((e) => newGame());

    $("#settings").click((e) => {
        $("#settingsPanel").toggle();
    });

    $("#setting-temperature").on("input", (e) => {
        $("#setting-temperature-value-label").text($(e.target).val());
    });

    $("#setting-topic-generate").click(async (e) => {
        if (!config.openAiApiKey) {
            // FIXME: ...
            alert('Set an API key first and apply settings, then try again.');
            return;
        }

        let topics = await AiQuestion.generateTopics(10);
        if (!topics.error) {
            console.log(topics);
            $("#setting-topic").val(topics.data.topics.join(", "));
        } else {
            alert(topics.error);
        }
    });

    $("#apply-settings").click((e) => {
        config.useAi = $("#setting-useAi").prop("checked");
        config.openAiApiKey = $("#setting-openAiApiKey").val() || null;
        config.language = $("#setting-language").val();
        config.topic = $("#setting-topic").val() || null;
        config.temperature = +$("#setting-temperature").val();

        Settings.saveSettings(config);
        $("#settingsPanel").hide();

        initSettings();

        newGame();
    });

    const isTouchDevice = "ontouchstart" in document.documentElement;
    $answers.on(isTouchDevice ? "touchstart" : "mousedown", (e) => {
        e.preventDefault();

        checkAnswer($(e.target).data("index"));
    });

    initSettings();

    newGame();
});

function initSettings() {
    config = Settings.loadSettings();
    console.table(config);

    AiQuestion.setApiKey(config.openAiApiKey);

    $("#setting-useAi").prop("checked", config.useAi);
    $("#setting-openAiApiKey").val(config.openAiApiKey || null);
    $("#setting-language").val(config.language);
    $("#setting-topic").val(config.topic || null);
    $("#setting-topic-generate").prop("disabled", !config.openAiApiKey);
    $("#setting-temperature")
        .val(config.temperature)
        .trigger("input");
}

function newGame() {
    game.score = 0;
    game.highscore = 0;

    $answers.add("#new-game")
        .addClass("disable-clicks");

    renderStatus();

    game.fetchedQuestion = fetchNextQuestion();
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

async function fetchNextQuestion() {
    if (config.useAi) {
        const topics = config.topic ? config.topic.split(",") : null;
        const topic = config.topic ? randomElement(topics).trim() : null;
        const result = await AiQuestion.generateQuestion(config.language, topic, config.temperature);
        // TODO: Check question for repeated emojis and retry, if any
        if (result.error) {
            console.error(result.error);
            return {
                type: "emoji",
                options: [
                    {value: "ERROR", option: "⚠️"},
                    {value: "ERROR", option: "⚠️"},
                    {value: "ERROR", option: "⚠️"},
                    {value: "ERROR", option: "⚠️"},
                ],
                note: result.error,
            };
        }
        return result.data;
    } else {
        const lastQuestionIndex = game.questionIndex;
        if (questions.length > 1) {
            while (lastQuestionIndex == game.questionIndex) {
                game.questionIndex = randomIndex(questions);
            }
        } else {
            game.questionIndex = 0;

        }
        return questions[game.questionIndex];
    }
}

async function nextQuestion() {
    const question = await game.fetchedQuestion;

    $("#status").text("");
    $answers.add("#new-game")
        .removeClass("disable-clicks correct wrong");

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
        game.highscore = Math.max(game.score, game.highscore);
        game.score = 0;
        $answers.eq(index).addClass("wrong");
        playAudio(audio.wrong);
    } else {
        game.score++;
        document.getElementById('score').animate([
            { opacity: 1 },
            { opacity: 0.25 },
            { opacity: 1 },
        ], {
            duration: 250, // 75ms for the first step and 175ms for the second step
            easing: 'linear',
        });
        if (game.highscore > 0 && game.score == game.highscore + 1) {
            emoji = randomElement(["😸", "🥳", "🤩"]);
            playAudio(audio.highscore);
        } else {
            emoji = randomElement(["😄", "👍", "🌞"]);
            playAudio(audio.correct);
        }
    }

    $status.text(emoji);

    $answers.add("#new-game")
        .addClass("disable-clicks");

    renderStatus();

    game.fetchedQuestion = fetchNextQuestion();

    window.setTimeout(() => {
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

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
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
