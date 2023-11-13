import { addPasswordEye, validatePassword } from "./input-validation.js";

// =================================================================
window.addEventListener("DOMContentLoaded", initResetPassword);

/**
 * it inits the reset password site
 */
function initResetPassword() {
  includeHTML();
  initInputValidation();
  initResetEvent();
}

/**
 * inits the input field validation
 */
function initInputValidation() {
  addPasswordEye();
  validatePassword();
}

/**
 * inits the reset event
 */
function initResetEvent() {
  const continueBtn = document.querySelector("#continue_btn");

  continueBtn.addEventListener("click", (e) => {
    e.preventDefault();
    submitNewPassword();
  });
}

/**
 * it submits a new password
 */
async function submitNewPassword() {
  const loginMessage = document.querySelector("#error_message");

  let datas = await loadData("contacts");
  let contact = JSON.parse(datas);

  handleForgotPassword(email);
}
