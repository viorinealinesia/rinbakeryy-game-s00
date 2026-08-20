/* =================================
   RINBAKERY GAME
================================= */


/* DATA KUE */

const cakes = [

    {
        name: "Strawberry Cake",
        icon: "🍓",
        price: 25000
    },

    {
        name: "Chocolate Cake",
        icon: "🍫",
        price: 30000
    },

    {
        name: "Cupcake",
        icon: "🧁",
        price: 15000
    },

    {
        name: "Donut",
        icon: "🍩",
        price: 12000
    },

    {
        name: "Croissant",
        icon: "🥐",
        price: 18000
    },

    {
        name: "Macaron",
        icon: "🍥",
        price: 20000
    },

    {
        name: "Cheesecake",
        icon: "🍰",
        price: 28000
    },

    {
        name: "Cookie",
        icon: "🍪",
        price: 10000
    }

];


const customers = [

    {
        name: "Maya",
        avatar: "👩🏻"
    },

    {
        name: "Alya",
        avatar: "👩🏼"
    },

    {
        name: "Naya",
        avatar: "👩🏻‍🦰"
    },

    {
        name: "Rani",
        avatar: "👩🏽"
    },

    {
        name: "Dina",
        avatar: "👩🏻"
    }

];


/* VARIABLES */

let score = 0;

let money = 0;

let lives = 3;

let time = 10;

let maxTime = 10;

let currentOrder;

let gameRunning = false;

let timer;

let sound = true;

let best =
    Number(
        localStorage.getItem(
            "rinBakeryBest"
        )
    ) || 0;


/* ELEMENT */

const menu =
    document.getElementById(
        "menu"
    );

const scoreEl =
    document.getElementById(
        "score"
    );

const moneyEl =
    document.getElementById(
        "money"
    );

const livesEl =
    document.getElementById(
        "lives"
    );

const bestEl =
    document.getElementById(
        "best"
    );

const timeEl =
    document.getElementById(
        "time"
    );

const timerBar =
    document.getElementById(
        "timerBar"
    );

const orderText =
    document.getElementById(
        "orderText"
    );

const customerName =
    document.getElementById(
        "customerName"
    );

const customerAvatar =
    document.getElementById(
        "customerAvatar"
    );

const message =
    document.getElementById(
        "message"
    );

const startScreen =
    document.getElementById(
        "startScreen"
    );

const gameOver =
    document.getElementById(
        "gameOver"
    );

const startBtn =
    document.getElementById(
        "startBtn"
    );

const restartBtn =
    document.getElementById(
        "restartBtn"
    );

const finalScore =
    document.getElementById(
        "finalScore"
    );

const record =
    document.getElementById(
        "record"
    );

const soundBtn =
    document.getElementById(
        "soundBtn"
    );


bestEl.textContent = best;


/* =================================
   🎵 AUDIO ENGINE
================================= */

let audioContext = null;

let musicTimer = null;

let musicPlaying = false;

let musicIndex = 0;


/* MELODI */

const melody = [

    261.63,
    329.63,
    392.00,
    523.25,

    392.00,
    329.63,
    293.66,
    349.23,

    440.00,
    523.25,
    440.00,
    392.00,

    329.63,
    392.00,
    440.00,
    523.25

];


const bass = [

    130.81,
    164.81,
    196.00,
    174.61

];


/* INIT AUDIO */

function initAudio() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }

}


/* =================================
   🎹 PLAY NOTE
================================= */

function playNote(
    frequency,
    duration = .3,
    volume = .03,
    type = "sine"
) {

    if (!audioContext)
        return;

    const now =
        audioContext.currentTime;

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();


    oscillator.type =
        type;


    oscillator.frequency.value =
        frequency;


    gain.gain.setValueAtTime(
        .001,
        now
    );


    gain.gain.exponentialRampToValueAtTime(
        volume,
        now + .03
    );


    gain.gain.exponentialRampToValueAtTime(
        .001,
        now + duration
    );


    oscillator.connect(
        gain
    );


    gain.connect(
        audioContext.destination
    );


    oscillator.start(
        now
    );


    oscillator.stop(
        now + duration
    );

}


/* =================================
   🎵 START MUSIC
================================= */

function startMusic() {

    if (!sound)
        return;


    initAudio();


    if (musicPlaying)
        return;


    musicPlaying = true;


    musicIndex = 0;


    musicTimer =
        setInterval(

            () => {

                if (
                    !musicPlaying ||
                    !gameRunning
                )
                    return;


                const note =
                    melody[
                        musicIndex %
                        melody.length
                    ];


                playNote(
                    note,
                    .28,
                    .025,
                    "sine"
                );


                if (
                    musicIndex % 2 === 0
                ) {

                    playNote(

                        bass[
                            (
                                musicIndex /
                                2
                            ) %
                            bass.length
                        ],

                        .45,

                        .012,

                        "triangle"

                    );

                }


                if (
                    musicIndex % 8 === 7
                ) {

                    playNote(

                        note * 2,

                        .15,

                        .012,

                        "sine"

                    );

                }


                musicIndex++;

            },

            320

        );

}


/* =================================
   STOP MUSIC
================================= */

function stopMusic() {

    musicPlaying = false;

    clearInterval(
        musicTimer
    );

    musicTimer = null;

}


/* =================================
   SOUND EFFECT
================================= */

function effect(
    frequency,
    duration = .1,
    type = "sine"
) {

    if (!sound)
        return;


    initAudio();


    playNote(
        frequency,
        duration,
        .05,
        type
    );

}


/* CORRECT */

function correctSound() {

    effect(
        660,
        .08
    );


    setTimeout(
        () => {

            effect(
                880,
                .12
            );

        },
        80
    );

}


/* WRONG */

function wrongSound() {

    effect(
        180,
        .15,
        "sawtooth"
    );


    setTimeout(
        () => {

            effect(
                120,
                .18,
                "sawtooth"
            );

        },
        100
    );

}


/* COIN */

function coinSound() {

    effect(
        988,
        .08
    );


    setTimeout(
        () => {

            effect(
                1319,
                .12
            );

        },
        80
    );

}


/* =================================
   🎮 START GAME
================================= */

function startGame() {

    initAudio();


    score = 0;

    money = 0;

    lives = 3;


    gameRunning =
        true;


    scoreEl.textContent =
        0;

    moneyEl.textContent =
        0;

    livesEl.textContent =
        3;


    startScreen
        .classList
        .add("hidden");


    gameOver
        .classList
        .add("hidden");


    message.textContent =
        "";


    startMusic();


    newOrder();

}


/* =================================
   ORDER BARU
================================= */

function newOrder() {

    if (!gameRunning)
        return;


    clearInterval(
        timer
    );


    const customer =
        customers[
            Math.floor(
                Math.random() *
                customers.length
            )
        ];


    currentOrder =
        cakes[
            Math.floor(
                Math.random() *
                cakes.length
            )
        ];


    customerName.textContent =
        customer.name;


    customerAvatar.textContent =
        customer.avatar;


    orderText.textContent =
        currentOrder.icon +
        " " +
        currentOrder.name;


    maxTime =
        Math.max(
            4.5,
            10 -
            Math.floor(
                score / 150
            ) * .7
        );


    time = maxTime;


    renderMenu();


    startTimer();

}


/* =================================
   MENU
================================= */

function renderMenu() {

    menu.innerHTML =
        "";


    const shuffled =
        [...cakes].sort(
            () =>
                Math.random() -
                .5
        );


    shuffled.forEach(
        cake => {


            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "cake";


            button.innerHTML = `

                <div class="cake-icon">
                    ${cake.icon}
                </div>

                <div class="cake-name">
                    ${cake.name}
                </div>

                <div class="cake-price">
                    Rp ${cake.price.toLocaleString("id-ID")}
                </div>

            `;


            button.addEventListener(
                "click",
                () => {
                    chooseCake(cake);
                }
            );


            menu.appendChild(
                button
            );

        }
    );

}


/* =================================
   PILIH KUE
================================= */

function chooseCake(cake) {

    if (!gameRunning)
        return;


    if (
        cake.name ===
        currentOrder.name
    ) {


        score += 50;


        money +=
            cake.price;


        scoreEl.textContent =
            score;


        moneyEl.textContent =
            money.toLocaleString(
                "id-ID"
            );


        message.textContent =
            "✨ Pesanan benar! +50 poin";


        message.style.color =
            "#55a477";


        correctSound();


        setTimeout(
            coinSound,
            100
        );


        clearInterval(
            timer
        );


        setTimeout(
            () => {

                message.textContent =
                    "";

                newOrder();

            },
            400
        );


    } else {


        lives--;


        livesEl.textContent =
            lives;


        message.textContent =
            "❌ Itu bukan pesanan!";


        message.style.color =
            "#e47777";


        wrongSound();


        if (
            lives <= 0
        ) {

            endGame();

        }

    }

}


/* =================================
   TIMER
================================= */

function startTimer() {

    const start =
        performance.now();


    timer =
        setInterval(

            () => {


                if (!gameRunning)
                    return;


                time =
                    Math.max(

                        0,

                        maxTime -
                        (
                            performance.now()
                            -
                            start
                        ) / 1000

                    );


                timeEl.textContent =
                    time.toFixed(1);


                timerBar.style.width =
                    (
                        time /
                        maxTime *
                        100
                    ) + "%";


                if (
                    time <= 0
                ) {


                    clearInterval(
                        timer
                    );


                    lives--;


                    livesEl.textContent =
                        lives;


                    message.textContent =
                        "⏰ Waktu habis!";


                    wrongSound();


                    if (
                        lives <= 0
                    ) {

                        endGame();

                    } else {

                        setTimeout(
                            newOrder,
                            500
                        );

                    }

                }

            },

            50

        );

}


/* =================================
   GAME OVER
================================= */

function endGame() {

    if (!gameRunning)
        return;


    gameRunning =
        false;


    clearInterval(
        timer
    );


    stopMusic();


    finalScore.textContent =
        score;


    if (
        score > best
    ) {

        best =
            score;


        localStorage.setItem(
            "rinBakeryBest",
            best
        );


        bestEl.textContent =
            best;


        record.textContent =
            "🎉 HIGH SCORE BARU! 🎉";

    } else {

        record.textContent =
            "🍰 Coba kalahkan skor terbaikmu!";

    }


    gameOver
        .classList
        .remove("hidden");

}


/* =================================
   🔊 SOUND BUTTON
================================= */

soundBtn.addEventListener(
    "click",
    () => {

        sound =
            !sound;


        if (sound) {

            soundBtn.textContent =
                "🔊";


            if (gameRunning)
                startMusic();

        } else {

            soundBtn.textContent =
                "🔇";


            stopMusic();

        }

    }
);


/* =================================
   BUTTON
================================= */

startBtn.addEventListener(
    "click",
    startGame
);


restartBtn.addEventListener(
    "click",
    startGame
);
