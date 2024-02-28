const slideOut = document.querySelector("#classic-slide-out");
const slideIn = document.querySelector("#classic-slide-in");

const ajaxHandlerSignUp = function (route, method, data) {
    $.ajax({
        url: route,
        method: method,
        data: data,
        dataType: "json",
        contentType: false,
        processData: false,
        beforeSend: function () {
            $(".loader").toggleClass("d-block d-none");
        },
        afterSend: function () {
            $(".loader").toggleClass("d-none d-block");
        },
        timeout: 60000,
        success: (data) => {
            if (data.status) {
                console.log(data);
                slideOut.classList.replace("d-block", "d-none");
                slideIn.classList.replace("d-none", "d-block");
                $("#backend-error").html(
                    `<p class='successBg white boldSeven fontSize14px rounded-1 p-2'>${data.message}</p>`
                );
            } else {
                console.log(data.message);
                $(data.message).each((index, content) => {
                    $.each(content, (key, value) => {
                        $("#backend-error").html(
                            `<p class='errorMsgBg white boldSeven fontSize14px rounded-1 p-2'>${value}</p>`
                        );
                        console.log(value.message);
                    });
                });
            }
            $(".loader").toggleClass("d-none d-block");
        },
        error: (jqXHR, textStatus, error) => {
            if (textStatus === "timeout") {
                $("#backend-error").html(
                    `<p class='errorMsgBg white boldSeven fontSize14px rounded-1 p-2'>Error Connecting to our servers, please try again...</p>`
                );
            }
            console.log(error, jqXHR);
        },
    });
    return false;
};

const ajaxHandlerLogin = function (route, method, data, redirect) {
    $.ajax({
        url: route,
        method: method,
        data: data,
        dataType: "json",
        contentType: false,
        processData: false,
        beforeSend: function () {
            $(".loader").toggleClass("d-block d-none");
        },
        afterSend: function () {
            $(".loader").toggleClass("d-none d-block");
        },
        timeout: 60000,
        success: (data) => {
            if (data.status) {
                // alert("HEloolwee");
                console.log(data);
                location.href = redirect;
                $("#backend-error").html(
                    `<p class='successBg white boldSeven fontSize14px rounded-1 p-2'>${data.message}</p>`
                );
            } else {
                console.log(data.message);
                $("#backend-error").html(
                    `<p class='errorMsgBg white boldSeven fontSize14px rounded-1 p-2'>${data.message}</p>`
                );
                // $(data.message).each((index, content) => {
                //     $.each(content, (key, value) => {
                //         $("#backend-error").html(
                //             `<p class='errorMsgBg white boldSeven fontSize14px rounded-1 p-2'>${value}</p>`
                //         );
                //         console.log(value.message);
                //     });
                // });
            }
            $(".loader").toggleClass("d-none d-block");
        },
        error: (jqXHR, textStatus, error) => {
            if (textStatus === "timeout") {
                $("#backend-error").html(
                    `<p class='errorMsgBg white boldSeven fontSize14px rounded-1 p-2'>Error Connecting to our servers, please try again...</p>`
                );
            }
            console.log(error, jqXHR);
        },
    });
};

const ajaxUploadHandler = function (route, method, data, loader, backEndError) {
    $.ajax({
        url: route,
        method: method,
        data: data,
        dataType: "json",
        contentType: false,
        processData: false,
        beforeSend: function () {
            $(loader).toggleClass("d-block d-none");
        },
        afterSend: function () {
            $(loader).toggleClass("d-none d-block");
        },
        timeout: 60000,
        success: (data) => {
            if (data.status) {
                // alert("HEloolwee");
                $(backEndError).html(
                    `<p class='successBg white boldSeven fontSize14px rounded-1 p-2'>${data.message}</p>`
                );
            } else {
                console.log(data.message);
                $(data.message).each((index, content) => {
                    $.each(content, (key, value) => {
                        $(backEndError).html(
                            `<p class='errorMsgBg white boldSeven fontSize14px rounded-1 p-2'>${value.message}</p>`
                        );
                        console.log(value.message);
                    });
                    // console.log(data.message.error);
                });
                $(backEndError).html(
                    `<p class='errorMsgBg white boldSeven fontSize14px rounded-1 p-2'>${data.message}</p>`
                );
            }
            $(loader).toggleClass("d-none d-block");
        },
        error: (jqXHR, textStatus, error) => {
            if (textStatus === "timeout") {
                $("#backend-error").html(
                    `<p class='errorMsgBg white boldSeven fontSize14px rounded-1 p-2'>Error Connecting to our servers, please try again...</p>`
                );
            }
            console.log(error, jqXHR);
        },
    });
};

let accordion = document.getElementsByClassName("accordion");
let i;

for (let i = 0; i < accordion.length; i++) {
    accordion[i].addEventListener("click", function (event) {
        this.classList.toggle("active");
        let panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
            panel.style.padding = "0";
        } else {
            panel.style.maxHeight = `${panel.scrollHeight}%`;
            panel.style.padding = "12px 18px";
        }
    });
}

// const createBTN = document.querySelector("#create-btn");

// createBTN.addEventListener("click", function (event) {
//     // alert("yesyes");
//     slideOut.classList.replace("d-block", "d-none");
//     slideIn.classList.replace("d-none", "d-block");
// });

// Auth
const loginForm = document.querySelector("#login-form");

$("#login-form").validate({
    rules: {
        email: {
            required: true,
        },
        password: {
            required: true,
            minlength: 6,
        },
    },
    messages: {
        email: {
            required: "Please enter your email",
            email: "Please enter a valid email address",
        },
        password: {
            required: "Please enter a password",
            minlength: "Your password must be at least 6 characters long",
        },
    },
    submitHandler: function () {
        const data = new FormData(loginForm);
        data.append("_token", CSRF_TOKEN);
        ajaxHandlerLogin("/log-in", "POST", data, "/dashboard");

        return false;
    },
});

//Admin Auth
const adminLoginForm = document.querySelector("#login-form-admin");

$("#login-form-admin").validate({
    rules: {
        email: {
            required: true,
        },
        password: {
            required: true,
            minlength: 6,
        },
    },
    messages: {
        email: {
            required: "Please enter your email",
            email: "Please enter a valid email address",
        },
        password: {
            required: "Please enter a password",
            minlength: "Your password must be at least 6 characters long",
        },
    },
    submitHandler: function () {
        const data = new FormData(adminLoginForm);
        data.append("_token", CSRF_TOKEN);
        ajaxHandlerLogin("/log-in-admin", "POST", data, "/admin");
        return false;
    },
});

// Auth
const quizLoginForm = document.querySelector("#login-form-quiz");

$("#login-form-quiz").validate({
    rules: {
        email: {
            required: true,
        },
    },
    messages: {
        email: {
            required: "Please enter your email",
            email: "Please enter a valid email address",
        },
    },
    submitHandler: function () {
        const data = new FormData(quizLoginForm);
        const pathname = window.location.pathname;
        const parts = pathname.split("/");
        const value = parts[parts.length - 1];
        data.append("_token", CSRF_TOKEN);
        data.append("password", value);
        ajaxHandlerLogin("/log-in-quiz", "POST", data, "/test-dashboard");
        return false;
    },
});

const signUpForm = document.querySelector("#sign-up-form");

$("#sign-up-form").validate({
    rules: {
        "first-name": {
            required: true,
        },
        "last-name": {
            required: true,
        },
        email: {
            required: true,
        },
        password: {
            required: true,
            minlength: 6,
        },
        "confirm-password": {
            required: true,
            equalTo: "#password",
        },
        "check-term": {
            required: true,
        },
    },
    messages: {
        "first-name": {
            required: "Please enter your first name",
            minlength: "Name must be at least 2 characters",
        },
        "last-name": {
            required: "Please enter your last name",
            minlength: "Name must be at least 2 characters",
        },
        email: {
            required: "Please enter your email",
            email: "Please enter a valid email address",
        },
        password: {
            required: "Please enter a password",
            minlength: "Your password must be at least 6 characters long",
        },
        "confirm-password": {
            required: "Please enter your password again",
            equalTo: "Passwords do not match",
        },
        "check-term": {
            required: "Please agree to the terms and conditions",
        },
    },
    submitHandler: function () {
        const data = new FormData(signUpForm);
        data.append("_token", CSRF_TOKEN);
        ajaxHandlerSignUp("/sign-up", "POST", data);
        return false;
    },
});

const pickLabels = document.getElementsByClassName("pick-label");

for (let i = 0; i < pickLabels.length; i++) {
    pickLabels[i].addEventListener("click", function (event) {
        document
            .getElementById("continue-link")
            .classList.replace("d-none", "d-block");
        const data = new FormData();
        data.append("_token", CSRF_TOKEN);
        data.append("accountType", pickLabels[i].children[0].value);
        $.ajax({
            url: "/account-type",
            method: "POST",
            data: data,
            dataType: "json",
            contentType: false,
            processData: false,
            timeout: 60000,
            success: (data) => {
                if (data.status) {
                    return console.log(data);
                }
            },
            error: (jqXHR, textStatus, error) => {
                if (textStatus === "timeout") {
                    console.log(textStatus);
                }
                console.log(error, jqXHR);
            },
        });
        console.log(pickLabels[i].children[0].value);
    });
}

const questionUpload = document.querySelector("#question-upload");

$("#question-upload").validate({
    rules: {
        question: {
            required: true,
        },
        answer: {
            required: true,
        },
        type: {
            required: true,
        },
        projectID: {
            required: true,
        },
        category: {
            required: true,
        },
    },
    messages: {
        question: {
            required: "Please insert a Question",
        },
        answer: {
            required: "You must insert an Answer",
        },
        type: {
            required: "Please enter your email",
        },
        projectID: {
            required: "Please pick a projectID",
        },
        category: {
            required: "Please pick a category",
        },
    },
    submitHandler: function () {
        const data = new FormData(questionUpload);
        data.append("_token", CSRF_TOKEN);
        ajaxUploadHandler(
            "/quesion-upload",
            "POST",
            data,
            "#loader",
            "#backend-error"
        );
        return false;
    },
});

const sessionUpload = document.querySelector("#session-upload");

$("#session-upload").validate({
    rules: {
        email: {
            required: true,
        },
        projectID: {
            required: true,
        },
    },
    messages: {
        email: {
            required: "Please insert an Email Address",
        },
        projectID: {
            required: "You must insert an Answer",
        },
    },
    submitHandler: function () {
        const data = new FormData(sessionUpload);
        data.append("_token", CSRF_TOKEN);
        ajaxUploadHandler(
            "/session-upload",
            "POST",
            data,
            "#loader-session",
            "#backend-error-session"
        );
        return false;
    },
});

const questionBulkUpload = document.querySelector("#question-upload-bulk");

$("#question-upload-bulk").validate({
    rules: {
        file: {
            required: true,
        },
    },
    messages: {
        file: {
            required: "Please insert a file",
        },
    },
    submitHandler: function () {
        const data = new FormData(questionBulkUpload);
        data.append("_token", CSRF_TOKEN);
        ajaxUploadHandler(
            "/import-excel",
            "POST",
            data,
            "#loader-two",
            "#backend-error-two"
        );
        return false;
    },
});

// console.log(navigator.userAgentData);
