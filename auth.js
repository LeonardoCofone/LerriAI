var CLIENT_ID = "692895314861-lmsub53tc5mdso1g7rkb6gop098safoe.apps.googleusercontent.com";
var API_URL = "https://api.lerriai.com/api/register";
var API_LOGIN_URL = "https://api.lerriai.com/api/login";
var googleLoaded = false;

function showNotification(message, type) {
    type = type || "info";
    var notification = document.getElementById("notification");
    var notificationText = document.getElementById("notificationText");
    var icon = notification.querySelector("i");

    if (!notification || !notificationText) return;

    notification.classList.remove("error", "success", "info", "show");

    icon.className = "";
    if (type === "error") {
        icon.className = "fas fa-exclamation-circle";
    } else if (type === "success") {
        icon.className = "fas fa-check-circle";
    } else {
        icon.className = "fas fa-info-circle";
    }

    notificationText.textContent = message;
    notification.classList.add(type, "show");

    setTimeout(function() {
        notification.classList.remove("show");
    }, 5000);
}

function showLoading(show) {
    if (show === undefined) show = true;
    var loading = document.getElementById("loadingIndicator");
    if (loading) {
        if (show) {
            loading.classList.add("active");
        } else {
            loading.classList.remove("active");
        }
    }
}

function disableForm(formId, disable) {
    if (disable === undefined) disable = true;
    var form = document.getElementById(formId);
    if (!form) return;
    
    var inputs = form.querySelectorAll("input, button, select");
    inputs.forEach(function(input) {
        input.disabled = disable;
    });
}

function validateName(name) {
    if (!name || name.trim().length < 2) {
        showNotification("Name must be at least 2 characters", "error");
        return false;
    }
    return true;
}

function validatePassword(password) {
    if (!password || password.length < 6) {
        showNotification("Password must be at least 6 characters", "error");
        return false;
    }
    return true;
}

function validateEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification("Invalid email", "error");
        return false;
    }
    return true;
}

function showPopupNotification(message) {
    var notif = document.createElement("div");
    notif.className = "popup-notification";
    notif.textContent = message;
    document.body.appendChild(notif);

    setTimeout(function() {
        notif.classList.add("show");
    }, 10);

    setTimeout(function() {
        notif.classList.remove("show");
        setTimeout(function() {
            notif.remove();
        }, 400);
    }, 2500);
}

function checkOnboardingAndRedirect(email) {
    var controller = new AbortController();
    var timeoutId = setTimeout(function() {
        controller.abort();
    }, 5000);

    fetch("https://api.lerriai.com/api/check-onboarding?email=" + encodeURIComponent(email), {
        signal: controller.signal
    })
    .then(function(response) {
        clearTimeout(timeoutId);
        return response.json();
    })
    .then(function(onboardingStatus) {
        if (onboardingStatus.completed) {
            window.location.href = "pwa/index.html";
        } else {
            window.location.href = "onboarding.html";
        }
    })
    .catch(function(error) {
        clearTimeout(timeoutId);
        window.location.href = "onboarding.html";
    });
}

function waitForGoogle(callback, maxAttempts) {
    maxAttempts = maxAttempts || 50;
    var attempts = 0;
    
    function check() {
        if (typeof google !== "undefined" && google.accounts && google.accounts.oauth2) {
            googleLoaded = true;
            callback();
        } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(check, 100);
        } else {
            showNotification("Failed to load Google. Please refresh the page.", "error");
            showLoading(false);
            disableForm("registerForm", false);
        }
    }
    check();
}

function initRegisterForm() {
    var userName = "";
    var userPassword = "";
    var userLanguage = "it";

    var form = document.getElementById("registerForm");
    var googleBtn = document.getElementById("google-login-btn");
    var languageSelect = document.getElementById("languageSelect");
    var termsCheckbox = document.getElementById("termsCheckbox");

    if (!form || !googleBtn) return;

    var savedEmail = localStorage.getItem("user_email");
    if (savedEmail) {
        showLoading(true);
        checkOnboardingAndRedirect(savedEmail);
        return;
    }

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        if (termsCheckbox && !termsCheckbox.checked) {
            showPopupNotification("You must accept the Terms of Service and Privacy Policy.");
            return;
        }
        
        userName = document.getElementById("nameInput").value.trim();
        userPassword = document.getElementById("passwordInput").value;
        userLanguage = languageSelect.value;

        if (!validateName(userName)) return;
        if (!validatePassword(userPassword)) return;

        disableForm("registerForm", true);
        showLoading(true);

        waitForGoogle(function() {
            startGoogleAuth(userName, userPassword, userLanguage);
        });
    });
}

function startGoogleAuth(userName, userPassword, userLanguage) {
    var tokenClient = google.accounts.oauth2.initCodeClient({
        client_id: CLIENT_ID,
        scope: [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/calendar.readonly',
            'https://www.googleapis.com/auth/gmail.send'
        ].join(" "),
        ux_mode: "popup",
        redirect_uri: "postmessage",
        callback: function(response) {
            if (!response || !response.code) {
                showNotification("Error during Google authentication", "error");
                disableForm("registerForm", false);
                showLoading(false);
                return;
            }

            var payload = {
                name: userName,
                password: userPassword,
                oauth_code: response.code
            };

            fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            .then(function(res) {
                return res.json();
            })
            .then(function(data) {
                showLoading(false);

                if (data.success) {
                    localStorage.setItem("user_email", data.email);
                    localStorage.setItem("user_name", data.name);
                    localStorage.setItem("user_language", userLanguage);

                    fetch("https://api.lerriai.com/api/set-language", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: data.email, language: userLanguage })
                    });

                    showNotification("Welcome, " + data.name + "!", "success");

                    setTimeout(function() {
                        checkOnboardingAndRedirect(data.email);
                    }, 1500);

                } else if (data.redirect) {
                    showNotification("Account already exists", "error");
                    setTimeout(function() {
                        window.location.href = data.redirect;
                    }, 2000);
                } else {
                    showNotification(data.error || "Registration error", "error");
                    disableForm("registerForm", false);
                }
            })
            .catch(function(error) {
                showNotification("Server connection error", "error");
                showLoading(false);
                disableForm("registerForm", false);
            });
        }
    });

    tokenClient.requestCode();
}

function initLoginForm() {
    var loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    var savedEmail = localStorage.getItem("user_email");
    if (savedEmail) {
        showLoading(true);
        checkOnboardingAndRedirect(savedEmail);
        return;
    }

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        var email = document.getElementById("loginEmail").value.trim();
        var password = document.getElementById("loginPassword").value;

        if (!validateEmail(email)) return;
        if (!validatePassword(password)) return;

        disableForm("loginForm", true);
        showLoading(true);

        fetch(API_LOGIN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password })
        })
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            showLoading(false);

            if (data.success) {
                localStorage.setItem("user_email", email);
                localStorage.setItem("user_name", data.name);

                showNotification("Welcome back, " + data.name + "!", "success");

                setTimeout(function() {
                    checkOnboardingAndRedirect(email);
                }, 1000);
            } else {
                showNotification(data.error || "Incorrect email or password", "error");
                disableForm("loginForm", false);
            }
        })
        .catch(function(error) {
            showNotification("Server connection error", "error");
            showLoading(false);
            disableForm("loginForm", false);
        });
    });
}

window.addEventListener("DOMContentLoaded", function() {
    var firstInput = document.querySelector("input");
    if (firstInput) {
        firstInput.focus();
    }
    
    var togglePass = document.getElementById("togglePass");
    var passwordInput = document.getElementById("passwordInput") || document.getElementById("loginPassword");
    
    if (togglePass && passwordInput) {
        togglePass.addEventListener("click", function() {
            var type = passwordInput.type === "password" ? "text" : "password";
            passwordInput.type = type;
            togglePass.classList.toggle("fa-eye");
            togglePass.classList.toggle("fa-eye-slash");
        });
    }

    if (document.getElementById("registerForm")) {
        initRegisterForm();
    }

    if (document.getElementById("loginForm")) {
        initLoginForm();
    }
});
