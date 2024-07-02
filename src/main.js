
let game = {
    state: "menu",
    score: 0,
    highscore: 0,
    questionIndex: null,
    optionIndex: null,
};

let $score, $highscore;
let $status;
let $answers;

$(function() {
    $score = $("#score");
    $highscore = $("#highscore");
    $status = $("#status");
    $answers = $("#answers .answer");

    $("#new-game").click((e) => {
        newGame();
    });

    $answers.click(function (e) {
        checkAnswer($(this).data("index"));
    });

    newGame();
});

function newGame() {
    game.state = "question";
    game.score = 0;
    game.highscore = 0;

    renderStatus();

    nextQuestion();
}

function renderStatus() {
    $score.text(game.score);
    $highscore.text(game.highscore);
    $status.text("");
}

function nextQuestion() {
    let lastQuestionIndex = game.questionIndex;
    while (lastQuestionIndex == game.questionIndex) {
        game.questionIndex = Math.floor(Math.random() * questions.length);
    }

    let question = questions[game.questionIndex];
    shuffle(question.options);
    game.optionIndex = Math.floor(Math.random() * question.options.length);

    renderQuestion(question);
}

function checkAnswer(index) {
    let correct = index == game.optionIndex;

    $answers.eq(game.optionIndex).addClass("correct");

    if (!correct) {
        game.score = 0;
        $answers.eq(index).addClass("wrong");
    } else {
        game.score++;
        game.highscore = Math.max(game.score, game.highscore);
    }

    $status.text(correct ? "😄" : "😔");

    $answers.addClass("disable-clicks");

    window.setTimeout(() => {
        $answers.removeClass("disable-clicks correct wrong");
        
        nextQuestion();
        renderStatus();
    }, correct ? 1250 : 3000);
}

function renderQuestion(question) {
    let correctOption = question.options[game.optionIndex];
    
    $("#question").text(correctOption.value);

    $answers.each((i, e) => {
        $(e)
            .text("")
            .css({
                backgroundColor: "inherit",
                fontSize: "inherit",
                fontFamily: "inherit",
            })
        ;

        let option = question.options[i];
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
                        fontSize: "2em",
                        fontFamily: "Grundschrift",
                    })
                ;
                break;
            default:
                alert("Unknown question type: " + option.type);
                break;
        }
    });
}

function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
}
