import { addPasswordEye, validatePassword } from "./input-validation.js";

// =================================================================
window.addEventListener("DOMContentLoaded", initResetPassword);

function initResetPassword() {
  includeHTML();
  initInputValidation();
  initResetEvent();
}

function initInputValidation() {
  addPasswordEye();
  validatePassword();
}

function initResetEvent() {
  const continueBtn = document.querySelector("#continue_btn");

  continueBtn.addEventListener("click", (e) => {
    e.preventDefault();
    submitNewPassword();
  });
}

async function submitNewPassword() {
  const loginMessage = document.querySelector("#error_message");

  let datas = await loadData("contacts");
  let contact = JSON.parse(datas);

  // const email = document.querySelector("#email_input").value;
  // const user = getUserByEmail(email, contact);

  // if (!user) return displayErrorMessage(loginMessage, false, "noUser");
  handleForgotPassword(email);
}
