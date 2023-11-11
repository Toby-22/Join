import {
  addPasswordEye,
  validateEmail,
  validatePassword,
  emptyInputFields,
  getUserByEmail,
  displayErrorMessage,
  validateRequiredElements,
} from "./input-validation.js";

// =================================================================
window.addEventListener("DOMContentLoaded", initLogin);

function initLogin() {
  localStorage.clear();
  includeHTML();
  initInputValidation();
  initLoginEvents();
}

// This function is used to initialize the validation if the input fields.
function initInputValidation() {
  addPasswordEye();
  validateEmail();
  validatePassword();
}

/**
 * This function is called when the user/guest wants to login with email and password.
 * It also sets a timeout for the user after a wrong login attempt.
 */
function initLoginEvents() {
  const userLogin = document.querySelector("#user_login_btn");
  const guestLogin = document.querySelector("#guest_login_btn");

  guestLogin.addEventListener("click", (e) => {
    e.preventDefault();
    submitGuestLogin();
  });

  userLogin.addEventListener("click", (e) => {
    e.preventDefault();
    submitUserLogin();
  });
}

/**
 * This function is called when the guest wants to submit the form and wants to login.
 */
async function submitGuestLogin() {
  const email = document.querySelector("#email_input");

  let datas = await loadData("contacts");
  let contact = JSON.parse(datas);

  email.value = "guest@mail.com";
  const user = getUserByEmail(email.value, contact);

  if (!user || !checkCredentials(user)) {
    console.error("Sorry, there is problem with the guest account.");
    return false;
  } else {
    handleSuccessfulLogin(user[0]);
  }
}

/**
 * This function is called when the user wants to submit the form and wants to login.
 */
async function submitUserLogin() {
  const loginMessage = document.querySelector("#error_message");
  attemptedLogin = true;

  const requiredElements = validateRequiredElements();
  if (!requiredElements) return;

  let datas = await loadData("contacts");
  let contact = JSON.parse(datas);
  const email = document.querySelector("#email_input").value;
  const user = getUserByEmail(email, contact);

  if (user.length <= 0)
    return displayErrorMessage(loginMessage, false, "noUser");

  const disabled = user[0].disabled;
  if (disabled) return displayErrorMessage(loginMessage, false, "noUser");
  if (!checkCredentials(user))
    return displayErrorMessage(loginMessage, false, "dontMatch");
  handleSuccessfulLogin(user[0]);
}

/**
 * This function handles the further process if the login was successfully.
 * @param {Object} user - array of the user data returned from the server.
 */
async function handleSuccessfulLogin(user) {
  const url = `dashboard.html?id=${user.id}`;
  localStorage.setItem("alreadyLoggin", false); // added from BR

  const userCookie = await getCookie("join_user-id");
  if (userCookie) updateCookie("join_user-id", user.id);
  else setCookie("join_user-id", user.id); // the stored user id must be checked on each site.

  rememberMeLogin("join_rmb-lgn", user.id);
  emptyInputFields();
  window.location.href = url;
  //window.location.href = '../dashboard.html';
}

/**
 * This function is called to check the the button is clicked.
 * @param {string} name - name of the cookie
 * @param {number} userID - user ID
 * @returns if rememberMe isn't checked.
 */
async function rememberMeLogin(name, userID) {
  const rememberMe = document.querySelector("#remember_me");
  if (!rememberMe.checked) return;

  const cookieToken = await getCookie(name);
  if (cookieToken) return isRememberMeValid(name, userID);

  const token = await calculateToken(userID, "remember");
  const oneWeek = 7 * 24 * 60 * 60 * 1000; // in milliseconds
  setCookie(name, token, oneWeek);
}

/**
 * This function is called to check if the remeber me cookie is found and valid.
 * @param {string} name - name of the cookie.
 * @param {string} userID - user ID.
 * @returns false if cookie isn't found, true if cookie is found and valid.
 */
async function isRememberMeValid(name, userID) {
  const cookieToken = getCookie(name);
  if (!cookieToken) return false;

  const calculatedToken = await calculateToken(userID, "remember");
  return cookieToken === calculatedToken;
}

/**
 * This function is used to calculate the token to store it in the cookie.
 * You first have to import the CryptoJS library in your file.
 * @param {string} userID - user Id from the backend.
 * @param {string} key - stored key from the backend.
 * @returns {string} hashedData - returns the hashed data
 */
async function calculateToken(userID, key) {
  let datas = await loadData("tokens");
  let tokens = JSON.parse(datas);
  const secretKey = tokens[key]; // Secret key for calculation

  const dataToHash = userID + secretKey;
  const hashedData = CryptoJS.SHA256(dataToHash);
  return hashedData.toString();
}

/**
 * This function is used to check if the Credentials are valid.
 * @param {object} user - user object from the backend.
 * @returns true, if password and email match, false otherwise.
 */
function checkCredentials(user) {
  const emailInput = document.querySelector("#email_input");
  const passwordInput = document.querySelector("#password_input");

  if (user[0].name === "Guest") {
    // Only needed for the guest
    emailInput.value = "guest@mail.com";
    passwordInput.value = "guestlogin";
  }

  return (
    emailInput.value === user[0].email &&
    passwordInput.value === user[0].password
  );
}
