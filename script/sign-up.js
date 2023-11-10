import {
  addPasswordEye,
  validateEmail,
  validatePassword,
  emptyInputFields,
  emptyValue,
  getUserByEmail,
  displayErrorMessage,
  validateRequiredElements,
} from "./input-validation.js";

// =================================================================
window.addEventListener("DOMContentLoaded", initSignup);

function initSignup() {
  includeHTML();
  initInputValidation();
  initSignupEvent();
}

// This function is used to initialize the validation if the input fields.
function initInputValidation() {
  addPasswordEye();
  validateEmail();
  validatePassword();
}

/**
 * This function is called when the user/guest wants to sign up with email and password.
 */
function initSignupEvent() {
  const signUpBtn = document.querySelector("#sign_up_btn");

  signUpBtn.addEventListener("click", (e) => {
    e.preventDefault();
    submitSignUp();
  });
}

/**
 * This function is called when the user wants to submit the form and wants to signup.
 */
async function submitSignUp() {
  const loginMessage = document.querySelector("#error_message");
  attemptedLogin = true;

  if (!validateRequiredElements()) return false;

  let datas = await loadData("contacts");
  let contact = JSON.parse(datas);
  const email = document.querySelector("#email_input").value;
  const user = getUserByEmail(email, contact);

  if (!checkCredentials)
    return displayErrorMessage(loginMessage, false, "confirmPasswords");
  if (user.length > 0)
    return displayErrorMessage(loginMessage, false, "exists");

  handleSuccessfulSignUp(contact);
}

/**
 * This function handles the further process if the login was successfully.
 * @param {Object} user - array of the user data returned from the server.
 */
async function handleSuccessfulSignUp(contact) {
  let userData = getInputValues(contact);
  contact.push(userData);
  storeData("contacts", contact);

  emptyInputFields();
  window.location.href = "../login.html";
}

function getInputValues(contact) {
  const nameInput = document.querySelector("#name_input");
  const emailInput = document.querySelector("#email_input");
  const passwordInput = document.querySelector("#password_input");
  let initialValue;

  const id = generateUniqueUserID(contact);
  if (nameInput.value.trim() === "")
    initialValue = generateInitials(emailInput.value);
  else initialValue = generateInitials(nameInput.value);

  let user = {
    name: nameInput.value,
    phone: "",
    email: emailInput.value,
    password: passwordInput.value,
    id: id,
    disabled: false,
    color: generateRandomNumber(1, 15),
    initials: initialValue,
  };
  return user;
}

/**
 * This function is used to generate the initials.
 * @param {string} name - name or email to generate the initials.
 * @returns
 */
function generateInitials(name) {
  const cleanedValue = name.replace(/[^A-Za-z\s@]/g, "").trim();
  const parts = cleanedValue.split(/[\s@]+/);
  let initials = "";

  for (const part of parts) {
    if (part && !isNaN(part.charAt(0))) {
      for (const char of part) {
        if (!isNaN(char)) continue;
        initials += char.toUpperCase();
        break;
      }
    } else if (part) {
      initials += part.charAt(0).toUpperCase();
    }
  }

  return initials;
}

/**
 * This function is used to check if the credentials are valid
 * @returns true if valid, false otherwise
 */
function checkCredentials() {
  const passwordInput = document.querySelector("#password_input");
  const confirmPassword = document.querySelector("#confirm_password_input");

  if (emptyValue(passwordInput) || emptyValue(confirmPassword)) return;
  if (passwordInput.value !== confirmPassword.value) return false;
  return true;
}
