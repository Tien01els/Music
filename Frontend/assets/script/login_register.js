import { URL } from "./URL.js";

// Change form login & register
const login = document.querySelector(".login");
const register = document.querySelector(".register");
const loginContainer = document.querySelector(".login-container");
const registerContainer = document.querySelector(".register-container");

login.onclick = function () {
    login.classList.add("active");
    loginContainer.classList.add("active");
    register.classList.remove("active");
    registerContainer.classList.remove("active");
};

register.onclick = () => {
    register.classList.add("active");
    registerContainer.classList.add("active");
    login.classList.remove("active");
    loginContainer.classList.remove("active");
};

//
const iconFormContents = document.querySelectorAll(".form-content-input i");

for (const iconFormContent of iconFormContents) {
    iconFormContent.onclick = () => {
        iconFormContent.parentElement.querySelector("label").click();
    };
}

//Click button login
const btnLogin = document.querySelector(".btn-login");

btnLogin.onclick = (event) => {
    const usernameLogin = document.querySelector("#username-login").value;
    const passwordLogin = document.querySelector("#password-login").value;
    event.preventDefault();
    const api = URL + "/account/login";
    $.post(api, {
        username: usernameLogin,
        password: passwordLogin,
    })
        .done(function () {
            location.href = "/Frontend/home.html";
        })
        .fail(function () {
            console.log("error");
        });
};

//Click button register
const btnRegister = document.querySelector(".btn-register");

btnRegister.onclick = (event) => {
    const usernameRegister = document.querySelector("#username-register").value;
    const emailRegister = document.querySelector("#email-register").value;
    const passwordRegister = document.querySelector("#password-register").value;
    event.preventDefault();
    const api = URL + "/user/insert";
    const data = JSON.stringify({
        username: usernameRegister,
        email: emailRegister,
        password: passwordRegister,
    });
    console.log(data);
    $.post(api, {
        username: usernameRegister,
        email: emailRegister,
        password: passwordRegister,
    })
        .done(function (data) {
            login.click();
        })
        .fail(function () {
            console.log("error");
        });
};
