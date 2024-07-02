const questions = [
    {
        type: "color",
        options: [
            { value: "Rot", option: "#ff0000" },
            { value: "Grün", option: "#00ff00" },
            { value: "Blau", option: "#0000ff" },
            { value: "Gelb", option: "#ffff00" },
        ],
    },
    {
        type: "color",
        options: [
            { value: "Rot", option: "#ff0000" },
            { value: "Lila", option: "#ff00ff" },
            { value: "Gelb", option: "#ffff00" },
            { value: "Schwarz", option: "#000000" },
        ],
    },
    {
        type: "emoji",
        options: [
            { value: "Hund", option: "🐶" },
            { value: "Katze", option: "🐱" },
            { value: "Maus", option: "🐭" },
            { value: "Fuchs", option: "🦊" },
        ],
    },
    {
        type: "emoji",
        options: [
            { value: "Herz", option: "❤️" },
            { value: "Sonne", option: "☀️" },
            { value: "Regenschirm", option: "☂️" },
            { value: "Mond", option: "🌙" },
        ],
    },
    {
        type: "color",
        options: [
            { value: "Orange", option: "#ffa500" },
            { value: "Pink", option: "#ffc0cb" },
            { value: "Türkis", option: "#40e0d0" },
            { value: "Braun", option: "#a52a2a" },
        ],
    },
    {
        type: "emoji",
        options: [
            { value: "Eule", option: "🦉" },
            { value: "Pinguin", option: "🐧" },
            { value: "Delfin", option: "🐬" },
            { value: "Wal", option: "🐋" },
        ],
    },
    {
        type: "color",
        options: [
            { value: "Violett", option: "#8a2be2" },
            { value: "Silber", option: "#c0c0c0" },
            { value: "Olivgrün", option: "#808000" },
            { value: "Hellblau", option: "#add8e6" },
        ],
    },
    {
        type: "emoji",
        options: [
            { value: "Elefant", option: "🐘" },
            { value: "Giraffe", option: "🦒" },
            { value: "Krokodil", option: "🐊" },
            { value: "Zebra", option: "🦓" },
        ],
    },
    {
        type: "emoji",
        options: [
            { value: "Feuer", option: "🔥" },
            { value: "Blitz", option: "⚡" },
            { value: "Schneeflocke", option: "❄️" },
            { value: "Regenbogen", option: "🌈" },
        ],
    },
    {
        type: "emoji",
        options: [
            { value: "Rakete", option: "🚀" },
            { value: "UFO", option: "🛸" },
            { value: "Teleskop", option: "🔭" },
            { value: "Satellit", option: "🛰️" },
        ],
    },
    {
        type: "number",
        options: [
            { value: "Eins", option: "1" },
            { value: "Zwei", option: "2" },
            { value: "Drei", option: "3" },
            { value: "Vier", option: "4" },
        ],
    },
    {
        type: "number",
        options: [
            { value: "Fünf", option: "5" },
            { value: "Sechs", option: "6" },
            { value: "Sieben", option: "7" },
            { value: "Acht", option: "8" },
        ],
    },
    {
        type: "number",
        options: [
            { value: "Neun", option: "9" },
            { value: "Zehn", option: "10 "},
            { value: "Elf", option: "11" },
            { value: "Zwölf", option: "12" },
        ],
    },
    {
        type: "symbol",
        options: [
            { value: "Plus", option: "+" },
            { value: "Minus", option: "-" },
            { value: "Mal", option: "⋅" },
            { value: "Geteilt", option: ":" },
        ],
    },
    {
        type: "symbol",
        options: [
            { value: "Ist-gleich", option: "=" },
            { value: "Kleiner-als", option: "<" },
            { value: "Größer-als", option: ">" },
            { value: "Ungleich", option: "≠" },
        ],
    },
    {
        type: "emoji",
        options: [
            { value: "Lampe", option: "💡" },
            { value: "Besen", option: "🧹" },
            { value: "Sofa", option: "🛋️" },
            { value: "Bett", option: "🛏️" },
        ],
    },
    {
        type: "emoji",
        options: [
            { value: "Fernseher", option: "📺" },
            { value: "Telefon", option: "📞" },
            { value: "Computer", option: "💻" },
            { value: "Wecker", option: "⏰" },
        ],
    },
    {
        type: "emoji",
        options: [
            { value: "Glücklich", option: "😊" },
            { value: "Traurig", option: "😢" },
            { value: "Wütend", option: "😠" },
            { value: "Erschrocken", option: "😱" },
        ],
    },
    {
        type: "emoji",
        options: [
            { value: "Lachend", option: "😂" },
            { value: "Denkend", option: "🤔" },
            { value: "Verliebt", option: "😍" },
            { value: "Zwinkernd", option: "😉" },
        ],
    },
    {
        type: "emoji",
        options: [
            { value: "Umarmend", option: "🤗" },
            { value: "Küssend", option: "😘" },
            { value: "Cool", option: "😎" },
            { value: "Schlafend", option: "😴" },
        ],
    },
    {
        type: "emoji",
        options: [
            { value: "Apfel", option: "🍎" },
            { value: "Banane", option: "🍌" },
            { value: "Trauben", option: "🍇" },
            { value: "Erdbeere", option: "🍓" },
        ],
    },
    {
        type: "emoji",
        options: [
            { value: "Pizza", option: "🍕" },
            { value: "Hamburger", option: "🍔" },
            { value: "Hotdog", option: "🌭" },
            { value: "Sandwich", option: "🥪" },
        ],
    },
    {
        type: "emoji",
        options: [
            { value: "Baum", option: "🌳" },
            { value: "Blume", option: "🌸" },
            { value: "Kaktus", option: "🌵" },
            { value: "Blatt", option: "🍃" },
        ],
    },
    {
        type: "emoji",
        options: [
            { value: "Sonne", option: "☀️" },
            { value: "Mond", option: "🌙" },
            { value: "Wolke", option: "☁️" },
            { value: "Regenbogen", option: "🌈" },
        ],
    },
    {
        type: "emoji",
        options: [
            { value: "Berg", option: "⛰️" },
            { value: "Meer", option: "🌊" },
            { value: "Insel", option: "🏝️" },
            { value: "Wüste", option: "🏜️" },
        ],
    },
];
