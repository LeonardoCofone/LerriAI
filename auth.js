const CLIENT_ID = "692895314861-lmsub53tc5mdso1g7rkb6gop098safoe.apps.googleusercontent.com";
const API_REGISTER_URL = "https://api.lerriai.com/api/register";
const API_LOGIN_URL = "https://api.lerriai.com/api/login";

function showNotification(message, type = "info") {
    const notification = document.getElementById("notification");
    const notificationText = document.getElementById("notificationText");
    
    if (!notification || !notificationText) return;

    const icon = notification.querySelector("svg") || notification.querySelector("i");
    
    notification.className = "notification";
    notification.classList.add(type, "show");
    notificationText.textContent = message;

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
    const elements = form.querySelectorAll("input, button, select");
    elements.forEach(el => el.disabled = disable);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
        showNotification("Invalid email format", "error");
        return false;
    }
    return true;
}

function checkOnboardingAndRedirect(email) {
    fetch(`https://api.lerriai.com/api/check-onboarding?email=${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(status => {
            if (status.completed) {
                window.location.href = "pwa/index.html";
            } else {
                window.location.href = "onboarding.html";
            }
        })
        .catch(err => {
            console.error(err);
            window.location.href = "onboarding.html";
        });
}

document.addEventListener("DOMContentLoaded", () => {
    
    const togglePass = document.getElementById("togglePass");
    const passwordInput = document.getElementById("loginPassword") || document.getElementById("passwordInput");

    if (togglePass && passwordInput) {
        togglePass.addEventListener("click", (e) => {
            e.preventDefault(); 
            const isPassword = passwordInput.type === "password";
            passwordInput.type = isPassword ? "text" : "password";
            
            if (isPassword) {
                togglePass.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
            } else {
                togglePass.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
            }
        });
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        const savedEmail = localStorage.getItem("user_email");
        if (savedEmail) checkOnboardingAndRedirect(savedEmail);

        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById("nameInput");
            const emailInput = document.getElementById("emailInput"); 
            const passInput = document.getElementById("passwordInput");
            
            const name = nameInput ? nameInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";
            const password = passInput ? passInput.value : "";

            if (name.length < 2) return showNotification("Name too short", "error");
            if (!validateEmail(email)) return;
            if (password.length < 6) return showNotification("Password must be at least 6 chars", "error");

            showLoading(true);
            disableForm("registerForm", true);

            try {
                const res = await fetch(API_REGISTER_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                
                showLoading(false);
                disableForm("registerForm", false);

                if (data.success) {
                    localStorage.setItem("user_email", email);
                    localStorage.setItem("user_name", name);
                    showNotification("Account created!", "success");
                    setTimeout(() => window.location.href = "onboarding.html", 1000);
                } else {
                    showNotification(data.error || "Registration failed", "error");
                }
            } catch (err) {
                showLoading(false);
                disableForm("registerForm", false);
                showNotification("Server error", "error");
            }
        });

        const googleBtn = document.getElementById("google-login-btn");
        if (googleBtn && window.google) {
            googleBtn.onclick = () => {
                const client = google.accounts.oauth2.initCodeClient({
                    client_id: CLIENT_ID,
                    scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
                    ux_mode: 'popup',
                    callback: (response) => {
                        if (response.code) {
                            showLoading(true);
                            fetch(API_REGISTER_URL, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ 
                                    oauth_code: response.code,
                                    googleLogin: true 
                                })
                            })
                            .then(r => r.json())
                            .then(d => {
                                showLoading(false);
                                if (d.success) {
                                    localStorage.setItem("user_email", d.email);
                                    localStorage.setItem("user_name", d.name);
                                    checkOnboardingAndRedirect(d.email);
                                } else {
                                    showNotification(d.error || "Google login failed", "error");
                                }
                            })
                            .catch(() => {
                                showLoading(false);
                                showNotification("Connection error", "error");
                            });
                        }
                    }
                });
                client.requestCode();
            };
        }
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        const savedEmail = localStorage.getItem("user_email");
        if (savedEmail) checkOnboardingAndRedirect(savedEmail);

        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById("emailInput") || document.getElementById("loginEmail");
            const passInput = document.getElementById("loginPassword");

            const email = emailInput ? emailInput.value.trim() : "";
            const password = passInput ? passInput.value : "";

            if (!validateEmail(email)) return;
            if (!password) return showNotification("Password required", "error");

            showLoading(true);
            disableForm("loginForm", true);

            try {
                const res = await fetch(API_LOGIN_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                
                showLoading(false);
                disableForm("loginForm", false);

                if (data.success) {
                    localStorage.setItem("user_email", email);
                    localStorage.setItem("user_name", data.name);
                    showNotification("Welcome back!", "success");
                    checkOnboardingAndRedirect(email);
                } else {
                    showNotification(data.error || "Invalid credentials", "error");
                }
            } catch (err) {
                showLoading(false);
                disableForm("loginForm", false);
                showNotification("Server error", "error");
            }
        });
    }

    const firstInput = document.querySelector("input");
    if (firstInput) firstInput.focus();
});