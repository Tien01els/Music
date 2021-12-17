/*
    1/ Render song
    2/ Play/ pause/ seek
    3/ CD rotate
    4/ Next/ prev
    5/ Random
    6/ Next/ Repeat when ened
    7/ Active songs
    8/ Scroll active song into view
    9/ Play song when click
*/

import { URL } from "./URL.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import UploadFile from "./uploadFile.js";
import getUser from "./GetUser.js";
import { mainHome } from "./home.js";

//constant
const PlAY_STORAGE_KEY = "PLAYER";

//Get Elements
const main = document.querySelector("#main");
const audio = document.querySelector("#audio");
const progress = document.querySelector("#progress");
const playlist = document.querySelector("#container-music .playlist");
const songName = document.querySelectorAll(".song-name");
const songPerformer = document.querySelectorAll(".song-performer");
const contentDiscImage = document.querySelector("#container-music .content-disc img");
const controlsDisc = document.querySelector(".controls-disc");
const controlsDiscImage = document.querySelector(".controls-disc img");
const btnTogglePlay = document.querySelector(".btn-toggle-play");
const timeSongCurrent = document.querySelector(".controls-time-song .time-left");
const timeSongTotal = document.querySelector(".controls-time-song .time-right");
const skipForward = document.querySelector(".btn-skip-forward");
const skipBack = document.querySelector(".btn-skip-back");
const shuffle = document.querySelector(".btn-shuffle");
const repeat = document.querySelector(".btn-repeat");
const btnContentPlay = document.querySelector("#container-music .btn-content-toggle");
const discTop = document.querySelector(".container-play-top .content-disc-top img");

const imgBreak =
    "https://previews.123rf.com/images/kannaa123rf/kannaa123rf1607/kannaa123rf160700027/60173072-abstract-musical-background-with-vinyl-record-album-lp-disc-black-notes-isolated-on-white-backdrop-v.jpg";

const app = {
    //Current index song
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    settings: {},
    //List song
    songs: [
        // {
        //     name: 'Live Devil',
        //     performer: 'Da-iCE ft. Subaru Kimura',
        //     link: './assets/music/LiveDevil.mp3',
        //     image: './assets/image/LiveDevil_TV_Size_Art.jpg'
        // },
        // {
        //     name: 'Journey Through The Decade',
        //     performer: 'Gackt',
        //     link: './assets/music/JourneyThroughTheDecade.mp3',
        //     image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6e383159-0e29-4b64-832e-6d09cdd0021e/d2ge90k-22924761-f909-4fdc-ab4f-92dbb6ae4bba.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzZlMzgzMTU5LTBlMjktNGI2NC04MzJlLTZkMDljZGQwMDIxZVwvZDJnZTkway0yMjkyNDc2MS1mOTA5LTRmZGMtYWI0Zi05MmRiYjZhZTRiYmEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.Vea5nUH72PBjv27mBH_Ey2Y5CNtC81Yib1OsbdKhEhI'
        // },
        // {
        //     name: 'Over "Quartzer"',
        //     performer: 'Shuta Sueyoshi',
        //     link: './assets/music/OverQuartzer.mp3',
        //     image: ''
        // },
        // {
        //     name: 'REAL×EYEZ',
        //     performer: 'J×Takanori Nishikawa',
        //     link: 'https://firebasestorage.googleapis.com/v0/b/music-656c2.appspot.com/o/Images%2FREALxEYEZ.mp3?alt=media&token=94075063-44b9-47ae-84ca-26daa0d4ecff',
        //     image: 'https://i1.sndcdn.com/artworks-000662588752-8lrx7z-t500x500.jpg'
        // },
        // {
        //     name: 'Anything Goes',
        //     performer: 'Maki Ohguro',
        //     link: './assets/music/AnythingGoes.mp3',
        //     image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f8e8128a-3031-4a7d-a3db-bd00361e6c93/d2ybg9z-23df0a11-3329-4810-a179-7a2886df249b.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2Y4ZTgxMjhhLTMwMzEtNGE3ZC1hM2RiLWJkMDAzNjFlNmM5M1wvZDJ5Ymc5ei0yM2RmMGExMS0zMzI5LTQ4MTAtYTE3OS03YTI4ODZkZjI0OWIuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.pexlr8s1sbdOAigw5ZPCiPsrStLhrREwiu-1fGsQXfY'
        // },
        // {
        //     name: 'W.B.X',
        //     performer: 'Aya KamikixTakuya',
        //     link: './assets/music/W.B.X.mp3',
        //     image: 'https://www.generasia.com/w/images/thumb/0/0a/w-b-xdvd.jpg/900px-w-b-xdvd.jpg'
        // },
        // {
        //     name: 'Switch On!',
        //     performer: 'Anna Tsuchiya',
        //     link: './assets/music/SwitchOn.mp3',
        //     image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f8e8128a-3031-4a7d-a3db-bd00361e6c93/d4i2kn8-b8335af7-1443-498d-b60b-4f35354d921e.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2Y4ZTgxMjhhLTMwMzEtNGE3ZC1hM2RiLWJkMDAzNjFlNmM5M1wvZDRpMmtuOC1iODMzNWFmNy0xNDQzLTQ5OGQtYjYwYi00ZjM1MzU0ZDkyMWUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.sY9KAkI7gEk2CnsGuQFaAzOhROGaMz1Abrbc9QdM3TE'
        // },
    ],
    //Get list song
    setPlaylistSong: function (id, flag) {
        const _this = this;
        const api = URL + "/music/" + id;
        $.get(api)
            .done(function (data) {
                let song = {};
                for (let key of Object.keys(data)) {
                    song[key] = data[key];
                }
                if (!song["image"]) {
                    song["image"] = imgBreak;
                }
                _this.songs.push(song);
                _this.render();
                const songNew = document.querySelector("#container-music .content-playlist:last-child");
                const oldIndex = _this.currentIndex;
                const contentPlaylist = document.querySelectorAll("#container-music .content-playlist");
                _this.currentIndex = Number(songNew.dataset.index);
                _this.loadCurrentSong();
                _this.activeSong(contentPlaylist, oldIndex, _this.currentIndex);
                audio.play();
                if (flag === "top") discTop.src = mainApp.currentSong.image;
            })
            .fail(function () {
                console.log("Error");
            });
    },
    //Render playlist
    render: function () {
        let indexSong = 0;
        const htmls = this.songs.map((song, index) => {
            ++indexSong;
            return `
            <div class="content-playlist ${index === this.currentIndex ? "active" : ""}" data-index=${index}>
                <div class="content-playlist-song">
                    <div class="song-prefix">
                        <span class="song-number">${indexSong}</span>
                    </div>
                    <div class="song-thumb">
                        <div class="song-image" style="background-image: url('${song.image ? song.image : imgBreak}');"></div>
                        <div class="song-thumb-active"></div>
                    </div>
                    <div class="song-title">
                        <span class="song-name">
                            ${song.name}
                        </span>
                        <span class="song-performer">
                            ${song.performer ? song.performer : ""}
                        </span>
                    </div>
                </div>
                <div class="content-playlist-time-song">
                    <span></span>
                </div>
                <div class="content-playlist-option-song">
                    <button class="btn btn-edit">
                    <i class="ri-edit-2-line"></i>
                    </button>
                    <button class="btn btn-delete">
                        <i class="ri-delete-bin-2-line"></i>
                    </button>
                </div>
            </div>`;
        });
        playlist.innerHTML = htmls.join("");
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    handleEvents: function () {
        const _this = this;

        const discSpin = controlsDisc.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], {
            duration: 10000,
            iterations: Infinity,
            fill: "backwards",
        });

        discSpin.pause();

        //Hành động click vào nút play hoặc pause
        btnContentPlay.onclick = () => {
            _this.playAudio();
        };

        //Hành động click vào nút play hoặc pause
        btnTogglePlay.onclick = () => {
            _this.playAudio();
        };

        //Khi bài hát chạy
        audio.onplay = () => {
            _this.isPlaying = true;
            main.classList.add("playing");
            main.classList.remove("pausing");
            discSpin.play();
        };

        //Khi bài hát đừng
        audio.onpause = () => {
            _this.isPlaying = false;
            main.classList.remove("playing");
            main.classList.add("pausing");
            discSpin.pause();
        };

        //Set giá trị cho thanh progress
        audio.addEventListener("timeupdate", _this.audioTimeUpdate);

        //Xử lí khi tua
        progress.onchange = (e) => {
            audio.removeEventListener("timeupdate", _this.audioTimeUpdate);
            const seekTime = (e.target.value * audio.duration) / 100;
            audio.currentTime = seekTime;
            audio.addEventListener("timeupdate", _this.audioTimeUpdate);
        };

        //Khi nhấn nút next thì next bài hát
        skipForward.onclick = () => {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.scrollToActiveSong();
        };

        //Khi nhấn nút prev thì prev bài hát
        skipBack.onclick = () => {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.scrollToActiveSong();
        };

        //Xử lí bật tắt random song
        shuffle.onclick = () => {
            _this.isRandom = !_this.isRandom;
            shuffle.classList.toggle("active", _this.isRandom);
        };

        //Xử lí bật tắt repeat song
        repeat.onclick = () => {
            _this.isRepeat = !_this.isRepeat;
            repeat.classList.toggle("active", _this.isRepeat);
        };

        //Next bài hát khi audio end
        audio.onended = () => {
            if (_this.isRepeat) audio.play();
            else skipForward.click();
        };

        //Lắng nghe click vào playlist
        playlist.onclick = (e) => {
            const songNotActive = e.target.closest("#container-music .content-playlist:not(.active)");
            const songOptine = e.target.closest("button");

            if (songNotActive || songOptine) {
                //Xử lí khi click vào song
                if (songNotActive && !songOptine) {
                    const oldIndex = _this.currentIndex;
                    const contentPlaylist = document.querySelectorAll("#container-music .content-playlist");
                    _this.currentIndex = Number(songNotActive.dataset.index);
                    _this.loadCurrentSong();
                    _this.activeSong(contentPlaylist, oldIndex, _this.currentIndex);
                    audio.play();
                }
                //Xử lí khi click vào btn
                if (songNotActive && songOptine) {
                }
            }
        };
    },
    loadCurrentSong: function () {
        if (this.currentSong) {
            for (let name of songName) name.textContent = this.currentSong.name;
            for (let performer of songPerformer) performer.textContent = this.currentSong.performer;
            contentDiscImage.src = this.currentSong.image;
            if (this.currentSong.image) controlsDiscImage.src = this.currentSong.image;
            audio.src = this.currentSong.link;
        } else {
            contentDiscImage.src = imgBreak;
            controlsDiscImage.src = imgBreak;
        }

        // this.render();
    },
    playAudio: function () {
        if (this.isPlaying) audio.pause();
        else audio.play();
    },
    audioTimeUpdate: function () {
        if (audio.duration) {
            const progressPercentage = Math.floor((audio.currentTime / audio.duration) * 100);
            progress.value = progressPercentage;

            const totalMinute = Math.floor(audio.duration / 60);
            const totalSecond = Math.floor(audio.duration - Math.floor(audio.duration / 60) * 60);
            timeSongTotal.textContent = app.fomartTime(totalMinute, totalSecond);

            const currentMinute = Math.floor(audio.currentTime / 60);
            const currentSecond = Math.floor(audio.currentTime - Math.floor(audio.currentTime / 60) * 60);
            timeSongCurrent.textContent = app.fomartTime(currentMinute, currentSecond);
        }
    },
    fomartTime: function (minutes, seconds) {
        if (minutes < 10) minutes = `0${minutes}`;
        if (seconds < 10) seconds = `0${seconds}`;
        return `${minutes}:${seconds}`;
    },
    nextSong: function () {
        const contentPlaylist = document.querySelectorAll("#container-music .content-playlist");
        const oldIndex = this.currentIndex;
        ++this.currentIndex;
        if (this.currentIndex >= this.songs.length) this.currentIndex = 0;
        this.activeSong(contentPlaylist, oldIndex, this.currentIndex);
        this.loadCurrentSong();
    },
    prevSong: function () {
        const contentPlaylist = document.querySelectorAll("#container-music .content-playlist");
        const oldIndex = this.currentIndex;
        --this.currentIndex;
        if (this.currentIndex < 0) this.currentIndex = this.songs.length - 1;
        this.activeSong(contentPlaylist, oldIndex, this.currentIndex);
        this.loadCurrentSong();
    },
    randomSong: function () {
        const contentPlaylist = document.querySelectorAll("#container-music .content-playlist");
        const oldIndex = this.currentIndex;
        do {
            this.currentIndex = Math.floor(Math.random() * this.songs.length);
        } while (this.currentIndex === oldIndex);
        this.activeSong(contentPlaylist, oldIndex, this.currentIndex);
        this.loadCurrentSong();
    },
    activeSong: function (contentPlaylist, oldIndex, newIndex) {
        contentPlaylist[oldIndex].classList.remove("active");
        contentPlaylist[newIndex].classList.add("active");
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            document.querySelector(".content-playlist.active").scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 300);
    },
    start: function () {
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();

        //Lắng nghe xử lí các sự kiện trong dom
        this.handleEvents();

        //loadSong
        this.loadCurrentSong();

        //Get and render playlist

        //Get Top Music
        mainHome.getTopMusic();
    },
};

app.start();
mainHome.getNewMusic();

const btnLeft = document.querySelector(".btn-left");
const btnRight = document.querySelector(".btn-right");
if (btnLeft && btnRight) {
    btnLeft.onclick = () => {
        mainHome.getTopMusic(-1);
    };
    btnRight.onclick = () => {
        mainHome.getTopMusic(1);
    };
}

UploadFile({
    form: ".modal-body",
    type: "music",
    configStorage: { getStorage, sRef, uploadBytesResumable, getDownloadURL },
});

export const mainApp = app;
