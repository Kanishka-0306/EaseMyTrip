import { signUpHtml, loginHtml } from "./signup.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupTrigger = document.getElementById("openSignup");
  const loginTrigger = document.getElementById("openLogin");
  const signupContainer = document.querySelector(".placingSignUp");
  const passContainer = document.querySelector(".placingSignUpPass");

  // ----- SIGNUP -----
  signupTrigger.addEventListener("click", () => {
    signupContainer.innerHTML = signUpHtml();

    const closeBtn = document.getElementById("close-sign-up-form");
    closeBtn.addEventListener("click", () => (signupContainer.innerHTML = ""));

    const signupForm = document.getElementById("signupForm");
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;

      const res = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        alert("Signup successful!");
        localStorage.setItem("userEmail", email);
        signupContainer.innerHTML = "";
        location.reload();
      } else {
        alert(await res.text());
      }
    });
  });

  // ----- LOGIN -----
  loginTrigger.addEventListener("click", () => {
    passContainer.innerHTML = loginHtml();

    const closeBtn = document.getElementById("close-login-form");
    closeBtn.addEventListener("click", () => (passContainer.innerHTML = ""));

    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        alert("Login successful!");
        localStorage.setItem("userEmail", email);
        passContainer.innerHTML = "";
        location.reload();
      } else {
        alert(await res.text());
      }
    });
  });
});
