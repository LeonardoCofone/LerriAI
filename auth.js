const CLIENT_ID = "692895314861-lmsub53tc5mdso1g7rkb6gop098safoe.apps.googleusercontent.com";
const API_URL = "http://localhost:3000/api/register";
const API_LOGIN_URL = "http://localhost:3000/api/login";

function showNotification(message, type = "info") {
    const notification = document.getElementById("notification");
    const notificationText = document.getElementById("notificationText");
    const icon = notification.querySelector("i");

    if (!notification || !notificationText) return;

    notification.classList.remove("error", "success", "info", "show");

    icon.className = "";
    if (type === "error") icon.className = "fas fa-exclamation-circle";
    else if (type === "success") icon.className = "fas fa-check-circle";
    else icon.className = "fas fa-info-circle";

    notificationText.textContent = message;
    notification.classList.add(type, "show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 5000);
}

function showLoading(show = true) {
    const loading = document.getElementById("loadingIndicator");
    if (loading) {
        loading.classList.toggle("active", show);
    }
}

function disableForm(formId, disable = true) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    const inputs = form.querySelectorAll("input, button, select");
    inputs.forEach(input => input.disabled = disable);
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification("Invalid email", "error");
        return false;
    }
    return true;
}

if (document.getElementById("registerForm")) {
    let userName = "";
    let userPassword = "";
    let userLanguage = "it";

    const form = document.getElementById("registerForm");
    const googleBtn = document.getElementById("google-login-btn");
    const languageSelect = document.getElementById("languageSelect");

    const savedEmail = localStorage.getItem("user_email");
    if (savedEmail) {
        (async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/check-onboarding?email=${encodeURIComponent(savedEmail)}`);
                const onboardingStatus = await response.json();
                
                if (onboardingStatus.completed) {
                    window.location.href = "pwa/index.html";
                } else {
                    window.location.href = "onboarding.html";
                }
            } catch (error) {
                console.error("Error checking onboarding:", error);
                window.location.href = "onboarding.html";
            }
        })();
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        userName = document.getElementById("nameInput").value.trim();
        userPassword = document.getElementById("passwordInput").value;
        userLanguage = languageSelect.value;

        if (!validateName(userName)) return;
        if (!validatePassword(userPassword)) return;

        disableForm("registerForm", true);
        showLoading(true);
        
        googleBtn.click();
    });

    googleBtn.onclick = () => {
        if (!userName || !userPassword) {
            showNotification("Error: missing data", "error");
            return;
        }

        const tokenClient = google.accounts.oauth2.initCodeClient({
            client_id: CLIENT_ID,
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/calendar.readonly',
                'https://www.googleapis.com/auth/documents.readonly',
                'https://www.googleapis.com/auth/spreadsheets.readonly',
                'https://www.googleapis.com/auth/gmail.send'
            ].join(" "),

            ux_mode: "popup",
            redirect_uri: "postmessage",
            callback: async (response) => {
                if (!response || !response.code) {
                    showNotification("Error during Google authentication", "error");
                    disableForm("registerForm", false);
                    showLoading(false);
                    return;
                }

                const payload = {
                    name: userName,
                    password: userPassword,
                    oauth_code: response.code
                };

                try {
                    const res = await fetch(API_URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });

                    const data = await res.json();
                    showLoading(false);

                    if (data.success) {
                        localStorage.setItem("user_email", data.email);
                        localStorage.setItem("user_name", data.name);
                        localStorage.setItem("user_language", userLanguage);

                        await fetch("http://localhost:3000/api/set-language", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: data.email, language: userLanguage })
                        });

                        showNotification(`✅ Welcome, ${data.name}!`, "success");

                        // CHECK ONBOARDING
                        try {
                            const onboardingRes = await fetch(`http://localhost:3000/api/check-onboarding?email=${encodeURIComponent(data.email)}`);
                            const onboardingStatus = await onboardingRes.json();

                            if (onboardingStatus.completed) {
                                console.log("----Onboarding already completed");
                                setTimeout(() => {
                                    window.location.href = "pwa/index.html";
                                }, 1500);
                            } else {
                                console.log("----Starting onboarding");
                                setTimeout(() => {
                                    window.location.href = "onboarding.html";
                                }, 1500);
                            }
                        } catch (err) {
                            console.error("Error checking onboarding:", err);
                            window.location.href = "onboarding.html";
                        }

                    } else if (data.redirect) {
                        showNotification("Account already exists", "error");
                        setTimeout(() => {
                            window.location.href = data.redirect;
                        }, 2000);
                    } else {
                        showNotification(data.error || "Registration error", "error");
                        disableForm("registerForm", false);
                    }

                } catch (error) {
                    showNotification("Server connection error", "error");
                    showLoading(false);
                    disableForm("registerForm", false);
                }
            }
        });

        tokenClient.requestCode();
    };

}

if (document.getElementById("loginForm")) {
    const form = document.getElementById("loginForm");

    const savedEmail = localStorage.getItem("user_email");
    if (savedEmail) {
        (async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/check-onboarding?email=${encodeURIComponent(savedEmail)}`);
                const onboardingStatus = await response.json();
                
                if (onboardingStatus.completed) {
                    window.location.href = "pwa/index.html";
                } else {
                    window.location.href = "onboarding.html";
                }
            } catch (error) {
                console.error("Error checking onboarding:", error);
                window.location.href = "onboarding.html";
            }
        })();
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!validateEmail(email)) return;
        if (!validatePassword(password)) return;

        disableForm("loginForm", true);
        showLoading(true);

        try {
            const res = await fetch(API_LOGIN_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            showLoading(false);

            if (data.success) {
                localStorage.setItem("user_email", email);
                localStorage.setItem("user_name", data.name);

                showNotification(`✅ Welcome back, ${data.name}!`, "success");

                const response = await fetch(`http://localhost:3000/api/check-onboarding?email=${encodeURIComponent(email)}`);
                const onboardingStatus = await response.json();
                
                console.log("📊 Onboarding status:", onboardingStatus);
                
                if (onboardingStatus.completed) {
                    console.log("✅ User has events, going to PWA");
                    setTimeout(() => {
                        window.location.href = "pwa/index.html";
                    }, 1000);
                } else {
                    console.log("📝 User needs onboarding");
                    setTimeout(() => {
                        window.location.href = "onboarding.html";
                    }, 1000);
                }

            } else {
                showNotification(data.error || "Incorrect email or password", "error");
                disableForm("loginForm", false);
            }

        } catch (error) {
            showNotification("Server connection error", "error");
            showLoading(false);
            disableForm("loginForm", false);
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    const firstInput = document.querySelector("input");
    if (firstInput) {
        firstInput.focus();
    }
});