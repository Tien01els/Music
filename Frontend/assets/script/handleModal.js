function handleModal() {
    const btnUploadModal = document.querySelector(".btn-upload-modal");
    const modal = document.querySelector(".js-modal");
    const modalClose = document.querySelector(".js-modal-close");
    const modalContainer = document.querySelector(".js-modal-container");

    btnUploadModal.onclick = () => {
        modal.classList.add("open");
    };

    function hideModal() {
        modal.classList.remove("open");
    }

    modalClose.addEventListener("click", hideModal);
    modal.addEventListener("click", hideModal);

    modalContainer.addEventListener("click", function (event) {
        event.stopPropagation();
    });
}
handleModal();

function handleContainerMusic() {
    const btnPlaylist = document.querySelector(".btn-playlist");
    const containerMusic = document.querySelector("#container-music");
    const containerMusicDown = document.querySelector("#container-music .btn-down");
    const controls = document.querySelector("#controls");
    btnPlaylist.onclick = () => {
        containerMusic.classList.add("open");
        controls.classList.add("open");
    };

    function hideContainerMusic() {
        containerMusic.classList.remove("open");
        controls.classList.remove("open");
    }

    containerMusicDown.addEventListener("click", hideContainerMusic);
}
handleContainerMusic();
