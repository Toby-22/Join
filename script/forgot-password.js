import {
  validateEmail,
  emptyInputFields,
  getUserByEmail,
  displayErrorMessage,
} from "./input-validation.js";

// =================================================================
window.addEventListener("DOMContentLoaded", initForgotPassword);

function initForgotPassword() {
  includeHTML();
  initInputValidation();
  initSendMailEvent();
}

/**
 * This function is used to initialize the validation if the input fields.
 */
function initInputValidation() {
  validateEmail();
}

/**
 * This function is called when the user/guest forgot the password and wants to send a mail wich resets the password.
 */
function initSendMailEvent() {
  const sentMailBtn = document.querySelector("#send_mail_btn");

  sentMailBtn.addEventListener("click", (e) => {
    e.preventDefault();
    submitForgotPassword();
  });
}

/**
 * This function is called when the user wants to submit the form and wants to get a email to reset the password.
 * @returns false, if required elements are missing
 */
async function submitForgotPassword() {
  const loginMessage = document.querySelector("#error_message");

  let datas = await loadData("contacts");
  let contact = JSON.parse(datas);

  const email = document.querySelector("#email_input").value;
  const user = getUserByEmail(email, contact);

  if (!user) return displayErrorMessage(loginMessage, false, "noUser");
  handleForgotPassword(email);
}

/**
 * This function is called to handle the forgot password functionality.
 * @param {string} email - email of the user.
 */
function handleForgotPassword(email) {
  // sends the reset page to the email address.
  // sendMail(email);

  emptyInputFields();
  window.location.href = "login.html";
}

/**
 * This function is called to send the reset page to the email address.
 * @param {string} email - email of the user.
 */
function sendMail(email) {
  // send post inquiry to the backend php server
  fetch("./send-mail.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `recipient=${email}`,
  })
    .then((response) => response.text())
    .then((data) => {
      // Here you can process the response of the php server, f.e. showing a success message.
      console.log(data);
    })
    .catch((error) => {
      console.warn(
        "There was an error processing the response from the server"
      );
      console.error("Error:", error);
    });
}
