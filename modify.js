/*
1. Render song list
2. Scroll top
3. Play pause seek
4. CD rotate
*/
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdImg = $(".cd-img");
const audio = $("#audio");
const playBtn = $(".btn-play");
const player = $(".player");
const progress = $("#progress");
const pauseBtn = $(".btn-pause");
const playList = $(".playlist");

const apps = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isActive: false,
    songs: [
        {
            name: "As if it's your last",
            singer: "BlackPink",
            path: "./Music/As_if_its_your_last.mp3",
            image: "./img/As_if_its_your_last.jpg",
        },
        {
            name: "Playing with fire",
            singer: "BlackPink",
            path: "./Music/Playing_with-fire.mp3",
            image: "./img/Playing_with_fire.jpg",
        },
        {
            name: "Chạy về nơi phía anh",
            singer: "Khắc Việt x Thảo Bebe",
            path: "./Music/Chay_ve_noi_phia_anh.mp3",
            image: "./img/Chay_ve_noi_phia_anh.jpg",
        },
        {
            name: "Lối nhỏ",
            singer: "BlackPink",
            path: "./Music/Loi_nho.mp3",
            image: "./img/loi_nho.jpg",
        },
        {
            name: "ICY",
            singer: "ITZY",
            path: "./Music/ICY.mp3",
            image: "./img/ICY.jpg",
        },
        {
            name: "Love Scenario",
            singer: "iKon",
            path: "./Music/Loi_nho.mp3",
            image: "./img/Love_Scenario.jpg",
        },
        {
            name: "Next Level",
            singer: "Aespa",
            path: "./Music/Next_level.mp3",
            image: "./img/Next_level.jpg",
        },
        {
            name: "Let's not fall in love ",
            singer: "BIGBANG",
            path: "./Music/LETS_NOT_FALL_IN_LOVE.mp3",
            image: "./img/Lets_not_fall_in_love.jpg",
        },
    ],
    render: function () {
        const htmlS = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? "active" : ""}"
                data-index="${index}">
                    <div class="thum"><img src="${song.image}" alt="" class="thum-img"></div>
                    <div class="body">
                        <h3 class="author">${song.name}</h3>
                        <p class="singer-name">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>`;
        });
        playList.innerHTML = htmlS.join("");
    },
    handleEvents: function () {
        const cd = $(".cd-img");
        const cdWidth = cd.offsetWidth;
        const btnNext = $(".btn-next");
        const btnPrev = $(".btn-prev");
        const btnRepeat = $(".btn-repeat");
        const btnRandom = $(".btn-random");

        // Xử lý CD rotate
        const cdAnimate = cd.animate(
            //Tham khảo: https://developer.mozilla.org/en-US/docs/Web/API/Element/animate
            { transform: "rotate(360deg)" },
            {
                duration: 10000, //10 seconds
                iterations: Infinity,
            }
        );
        cdAnimate.pause();
        // Xử lý phóng to/thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCDWidth = cdWidth - scrollTop;
            cd.style.width = newCDWidth > 0 ? newCDWidth + "px" : 0;
            cd.style.opacity = newCDWidth / cdWidth;
        };
        // Xử lý khi click play
        playBtn.onclick = function () {
            if (apps.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };
        // Khi song được play:
        audio.onplay = function () {
            apps.isPlaying = true;
            player.classList.add("playing");
            cdAnimate.play();
        };
        // Khi song pause
        audio.onpause = function () {
            apps.isPlaying = false;
            player.classList.remove("playing");
            cdAnimate.pause();
        };
        // Khi next bài:
        btnNext.onclick = function () {
            if (apps.isRandom) {
                apps.playRandom();
            } else {
                apps.nextSong();
            }
            audio.play();
            cdAnimate.currentTime = 0;
            apps.render();
            apps.scrollToActiveSong();
        };
        // Khi pre bài
        btnPrev.onclick = function () {
            if (apps.isRandom) {
                apps.playRandom();
            } else {
                apps.preSong();
            }
            audio.play();
            cdAnimate.currentTime = 0;
            apps.render();
            apps.scrollToActiveSong();
        };
        // Repeat
        btnRepeat.onclick = function () {
            audio.load();
            audio.play();
            cdAnimate.currentTime = 0;
        };
        // Random
        btnRandom.onclick = function (e) {
            if (apps.isRandom) {
                apps.isRandom = false;
                btnRandom.classList.remove("active");
            } else {
                apps.isRandom = true;
                btnRandom.classList.add("active");
            }
        };
        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime * 100) / audio.duration);
                progress.value = progressPercent;
            }
        };
        // Xử lí khi tua
        progress.onchange = function (e) {
            const seekTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
        };
        // Next Song khi audio ended
        audio.onended = function () {
            btnNext.click();
        };
        // Click chọn đổi bài
        playList.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");
            // closest trả về element là chính nó, hoặc thẻ cha của chính nó
            // Nếu k tìm thấy thì trả về null
            if (songNode && !e.target.closest(".option")) {
                if (songNode) {
                    apps.currentIndex = Number(songNode.getAttribute("data-index"));
                    apps.loadCurrentSong();
                    audio.play();
                    apps.render();
                    // songNode.dataset.index (công dụng tương tự trên)
                }
            }
        };
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    }, // định nghĩa thuộc tính cho 1 Object, gán bằng biến currentSong
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdImg.src = this.currentSong.image;
        audio.src = this.currentSong.path;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    preSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandom: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex == this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        //Định nghĩa các thuộc tính cho Object
        this.defineProperties();

        // Render playlist
        this.render();

        // Lắng nghe Event trong DOM
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
    },
};
apps.start();
