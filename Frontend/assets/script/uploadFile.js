import { URL } from "./URL.js";
import { mainApp } from "./main.js";
import { mainHome } from "./home.js";
import getUser from "./GetUser.js";

function UploadFile(options) {
    const form = document.querySelector(options.form);
    const btnUpload = form.querySelector(".btn-upload");
    const inputs = form.querySelectorAll("input");
    btnUpload.onclick = (e) => {
        e.preventDefault();
        let value = {};
        inputs.forEach((input) => {
            if (input.type == "file") {
                Object.assign(value, {
                    [input.getAttribute("name")]: input.files[0],
                });
            } else {
                Object.assign(value, {
                    [input.getAttribute("name")]: input.value,
                });
            }
        });
        uploadMusic(value, options.configStorage);
    };
}

function uploadObjects(value) {
    getUser().then((idUser) => {
        const api = URL + "/";
        $.ajax({
            type: "POST",
            url: api,
            contentType: "application/json",
            data: JSON.stringify(value), // access in body
        })
            .done(function (data) {
                alert("Submit success");
            })
            .fail(function () {
                console.log("error");
            });
    });
}

function uploadMusic(value, config) {
    if (value["name-singer"]) uploadSinger(value["name-singer"]);

    if (value["mp3"]) uploadFileMp3({ link: value["mp3"], image: value["image"], singer: value["name-singer"], name: value["name-music"] }, config);
}

function uploadSinger(value) {
    const api = URL + "/artist/insert";
    $.post(api, { name: value })
        .done(function (data) {
            console.log(data);
        })
        .fail(function () {
            console.log("error");
        });
}

function uploadFileMp3(file, config) {
    console.log(file);

    const metadata = {
        contentType: file.link.type,
    };
    const storage = config.getStorage();
    const storageRef = config.sRef(storage, "Musics/" + file.name);
    const UploadTask = config.uploadBytesResumable(storageRef, file.link, metadata);
    UploadTask.on(
        "state-changed",
        () => {},
        (error) => {
            console.error;
        },
        () => {
            getUser().then((user) => {
                config.getDownloadURL(UploadTask.snapshot.ref).then((firebaseURL) => {
                    const api = URL + "/music/insert";
                    $.post(api, { name: file.name, link: firebaseURL, userId: user.id, singer: file.singer })
                        .done(function (data) {
                            console.log(data);
                            mainApp.songs = [];
                            // mainApp.getSongs();
                            uploadFileImage({ link: firebaseURL, image: file.image }, config);
                            mainHome.getNewMusic();
                        })
                        .fail(function () {
                            console.log("error");
                        });
                });
            });
        }
    );
}

function uploadFileImage(file, config) {
    const metadata = {
        contentType: file.image.type,
    };
    const name = file.image.name.slice(0, -4);
    const storage = config.getStorage();
    const storageRef = config.sRef(storage, "Images/" + name);
    const UploadTask = config.uploadBytesResumable(storageRef, file.image, metadata);
    UploadTask.on(
        "state-changed",
        () => {},
        (error) => {
            console.error;
        },
        () => {
            config.getDownloadURL(UploadTask.snapshot.ref).then((firebaseURL) => {
                const api = URL + "/music/update/firebaseLink";
                $.ajax({
                    type: "PATCH",
                    url: api,
                    contentType: "application/json",
                    data: JSON.stringify({ link: file.link, image: firebaseURL }), // access in body
                })
                    .done(function (data) {
                        console.log(data);
                    })
                    .fail(function () {
                        console.log("error");
                    });
            });
        }
    );
}

export default UploadFile;
