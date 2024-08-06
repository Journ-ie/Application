document.addEventListener("DOMContentLoaded", function() {
    const signInForm = document.getElementById("sign-in-form");
    const registerForm = document.getElementById("register-form");

    document.getElementById("create-account-btn").addEventListener("click", function() {
        signInForm.style.display = "none";
        registerForm.style.display = "block";
    });

    document.getElementById("already-have-account-btn").addEventListener("click", function() {
        registerForm.style.display = "none";
        signInForm.style.display = "block";
    });
});
