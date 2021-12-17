import { URL } from "./URL.js";
import { mainApp } from "./main.js";
import getUser from "./GetUser.js";

const imgBreak =
    "https://previews.123rf.com/images/kannaa123rf/kannaa123rf1607/kannaa123rf160700027/60173072-abstract-musical-background-with-vinyl-record-album-lp-disc-black-notes-isolated-on-white-backdrop-v.jpg";

const listNewSong = document.querySelector(".song-new-list");
const playlistTop = document.querySelector(".playlist-top");

const home = {
    index: 0,
    handleEvents: function () {
        const _this = this;
        //Lắng nghe click vào list new song
        if (listNewSong)
            listNewSong.onclick = (e) => {
                const songNew = e.target.closest(".song-new");
                const songNewId = songNew.querySelector(".link").value;
                mainApp.setPlaylistSong(songNewId, "new");
            };
        if (playlistTop)
            playlistTop.onclick = (e) => {
                const songTop = e.target.closest(".content-playlist-top");
                const songTopId = songTop.querySelector(".link").value;
                mainApp.setPlaylistSong(songTopId, "top");
            };
    },
    getNewMusic: function () {
        const api = URL + "/music/new";
        $.get(api).done((datas) => {
            let indexSong = 0;
            let htmls = "";
            datas.reverse();
            datas.forEach((data) => {
                ++indexSong;
                htmls += `
                    <div class="col text-center s-col-full mt-32 song-new">
                        <div class="song-new-img" style='background: url(${data.image}) top center / cover no-repeat;'>
                            <div class="song-new-text">
                                <div class="song-new-name">${data.name}</div>
                                <input type="hidden" class="link" value="${data._id}">
                            </div>
                            ${indexSong < 3 ? '<span class="badge new">NEW</span>' : ""}
                        </div>
                    </div>`;
            });
            listNewSong.innerHTML = htmls;
            listNewSong.classList.remove("slick-initialized");
            $(document).ready(function () {
                $(".song-new-list").slick({
                    slidesToShow: 4,
                    infinite: true,
                    autoplay: true,
                    autoplaySpeed: 1000,
                    prevArrow: "<button type='button' class='slick-prev pull-left slick-arrows'><i class='ri-arrow-left-line'></i></button>",
                    nextArrow: "<button type='button' class='slick-next pull-right slick-arrows'><i class='ri-arrow-right-line'></i></button>",
                });
            });
        });
    },
    getTopMusic: function (page) {
        const api = URL + "/music/top";
        $.get(api, { page }).done((datas) => {
            getUser().then((user) => {
                let indexSong = (parseInt(user.pageCurrent) - 1) * 5;
                let htmls = "";

                if (datas.length > 0) {
                    datas.forEach((data) => {
                        ++indexSong;
                        htmls += `
                            <div class="container-playlist-top" data-index="${indexSong}">
                                <div class="content-playlist-top">
                                    <div class="top-prefix">
                                        <span class="top-number">${indexSong}</span>
                                    </div>
                                    <div class="top-thumb">
                                        <div class="top-image" style="background: url(${data.image}) top center / cover no-repeat;"></div>
                                        <div class="top-thumb-active"></div>
                                    </div>
                                    <div class="top-title">
                                        <span class="top-name">${data.name}</span>
                                        <span class="top-performer">Hello</span>
                                    </div>
                                   <input type="hidden" class="link" value="${data._id}">
                                </div>
                                <div class="content-playlist-time-top">
                                    <span></span>
                                </div>
                                <div class="content-playlist-option-top">
                                
                                </div>
                            </div>`;
                    });
                    playlistTop.innerHTML = htmls;
                }
            });
        });
    },
    start: function () {
        //Lắng nghe xử lí các sự kiện trong dom
        this.handleEvents();
    },
};

home.start();

const btnUser = document.querySelector("#header .list-btn .btn-user");
const subnavUser = document.querySelector(".subnav-user");
btnUser.onclick = () => {
    subnavUser.classList.toggle("active");
};

export const mainHome = home;
