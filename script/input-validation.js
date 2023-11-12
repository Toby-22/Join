let password1 = ""; // Variable zum Speichern des ersten eingegebenen Passworts

/**
 * This function is used to check if the required input elements are valid.
 * @returns true if valid, false otherwise.
 */
export function validateRequiredElements() {
  const elements = getRequiredElements();
  let status = 0;

  elements.forEach((element) => {
    let elementType = element.dataset.inputType;
    if (elementType === "checkbox") {
      if (!requiredCheckbox(element)) return status++;
    } else if (!requiredInput(element)) status++;
  });

  if (status > 0) return false;
  return true;
}

/**
 * This function is used to change the message of the input elements, if they are required.
 * @param {Element} element - input element to check if it is required.
 * @returns true if input has value, false otherwise.
 */
function requiredInput(element) {
  const msg = getErrorContainer(element, "input");
  const isEmpty = emptyValue(element);

  msg.hidden = !isEmpty;
  msg.innerText = isEmpty ? "This field is required" : "";
  setOutlineStyle(element, isEmpty);

  if (isEmpty) return false;
  return true;
}

/**
 * This function is used to set a outline to the required checkboxes
 * @param {*} element - input element to set required outline
 * @returns true, if the element is required and checked, false otherwise.
 */
function requiredCheckbox(element) {
  const required = element.dataset.inputRequired === "true";
  const isChecked = element.checked && required;

  if (isChecked) return true;

  const checkboxContainer = element.closest('[data-container="checkbox"]');
  const checkbox = checkboxContainer.querySelector(
    '[name="checkbox-container"]'
  );

  setOutlineStyle(checkbox, !isChecked);
  element.addEventListener("change", () => {
    setOutlineStyle(checkbox, isChecked);
  });
  return false;
}

/**
 * This function is used to validate the input value of the email input element (like the attribute: type="email").
 * It also checks if the input is required and sets a custom error message.
 * The input fields must have a data attribute (data-input-type="email").
 */
export async function validateEmail() {
  const emailFields = document.querySelectorAll('[data-input-type="email"]');
  const loginMessage = document.querySelector("#error_message");

  emailFields.forEach((element) => {
    const msg = getErrorContainer(element, "input");

    element.addEventListener("input", () => {
      displayErrorMessage(loginMessage, true, "dontMatch");
      const isValid = emailRegex.test(element.value);
      const isRequired = (element.dataset.inputRequired = "true");
      const requiredMessage = isRequired ? "This field is required" : "";
      const isEmpty = emptyValue(element);

      msg.hidden = isEmpty || isValid;
      msg.innerText =
        !isValid && isEmpty ? requiredMessage : "Invalid email address";
    });
  });
}

/**
 * This function is used to validate the lenght of the input value of the password input element (like the attribute: minLength="").
 * It also checks if the password is required and sets a custom error message.
 * The input fields must have a data attribute (data-input-type="password").
 */
export async function validatePassword() {
  const passwordFields = getPasswordFields();
  const loginMessage = document.querySelector("#error_message");

  passwordFields.forEach((element) => {
    const msg = getErrorContainer(element, "input");

    element.addEventListener("input", () => {
      displayErrorMessage(loginMessage, true, "dontMatch");
      const isValid = element.value.length >= minPasswordLength;
      const isEmpty = emptyValue(element);
      const isRequired = (element.dataset.inputRequired = "true");
      const requiredMessage = isRequired ? "This field is required" : "";

      msg.hidden = isEmpty || isValid;
      msg.innerText =
        !isValid && isEmpty
          ? requiredMessage
          : "Password must be at least 8 characters long";
    });
  });
}

/**
 * this function check if both password entrys are equal
 * @returns boolean
 */
export function validatePasswordComplince(){
  const passwordFields = getPasswordFields();
  let passwords = [];
  passwordFields.forEach(element => {
    passwords.push(element.value);
  });
  return(passwords[0] == passwords[1])
}


/**
 * This function is used to add a eventlistener to change the password visibility.
 * The input fields must have a data attribute (data-input-type="password").
 */
export function addPasswordEye() {
  const passwordFields = getPasswordFields();

  passwordFields.forEach((element) => {
    const icon = element
      .closest("div")
      .querySelector('[data-label-icon="eye"]');
    const updateVisibility = () => {
      const isEmpty = emptyValue(element);
      toggleEyeBtn(icon, isEmpty);
    };

    element.addEventListener("focus", () => toggleEyeBtn(icon, false));
    element.addEventListener("blur", updateVisibility);
    element.addEventListener("input", updateVisibility);
    togglePasswordVisibility(element);
  });
}

/**
 * This function is called to toggle the visibility of the password.
 * @param {Element} element - the element with type "password".
 */
function togglePasswordVisibility(element) {
  const inputContainer = closestElement(element, "input");
  const eyeButton = inputContainer.querySelector('[data-label-icon="eye"]');

  eyeButton.addEventListener("change", () => {
    const isPassword = element.type === "password";
    element.type = isPassword ? "text" : "password";
  });
}

/**
 * This function is called to get all required elements.
 * The input fields must have a data attribute (data-input-required="true" or required).
 * @returns all required elements in a NodeList.
 */
function getRequiredElements() {
  return document.querySelectorAll('[data-input-required="true"]');
}

/**
 * This function is called to get all password input elements.
 * The input fields must have a data attribute (data-input-type="password").
 * @returns all password elements in a NodeList
 */
function getPasswordFields() {
  return document.querySelectorAll('[data-input-type="password"]');
}

/**
 * This function is called to get the closest parent element (input-container) of the input element.
 * The parent element of the input fields must have a data attribute (data-container="input").
 * @param {Element} element - input element.
 * @returns the closest elemet of the input field.
 */
function closestElement(element, dataType) {
  return element.closest(`[data-container="${dataType}"]`);
}

/**
 * This function is called to get the error message container of the input element.
 * The message box must have a data attribute (name="error-message").
 * @param {Element} element - input element.
 * @returns the closest message box of the input element.
 */
function getErrorContainer(element, dataType) {
  const inputContainer = closestElement(element, dataType);
  return inputContainer.querySelector('[name="error-message"]');
}

/**
 * This function is called to check if the input element is empty.
 * @param {Element} element - input element.
 * @returns true, if the input value is empty, false otherwise.
 */
export function emptyValue(element) {
  return element.value === "";
}

/**
 * This function is called to toggle button wich changes the visibility of the value.
 * @param {Element} icon - icon element of the eye button.
 * @param {boolean} hide - boolean to set the visibility.
 */
function toggleEyeBtn(icon, hide) {
  icon.style.display = hide ? "none" : "unset";
}

/**
 * This function is called to set the outline of the input field to the error color.
 * @param {Element} element - input element.
 * @param {boolean} status - boolean to set the outline of the input field.
 */
function setOutlineStyle(element, status) {
  element.style.outline = status ? "1px solid var(--error-color)" : "";
}

/**
 * This function is called to find the user by searching for the same email address on the server.
 * The array contacts must also be imported globally.
 * @param {*} email - email value of the user.
 * @param {Array} data - array of user data.
 * @returns {boolean} user, if the email is found, false otherwise.
 */
export function getUserByEmail(email, data) {
  return data.filter((user) => user.email === email);
}

/**
 * This function is called to show a custom error message if the user login was unsuccessful, otherwise set to hidden.
 * @param {Element} loginMessage - element of the login message box.
 * @param {boolean} hidden - to hide the error message.
 * @param {string} status - the status of the error message (noUser/dontMatch).
 */
export function displayErrorMessage(loginMessage, hidden, status) {
  if (hidden) return loginMessage.setAttribute("hidden", true);
  let emailInput = document.querySelector("#email_input");
  if (emailInput.value === "") return;

  loginMessage.removeAttribute("hidden");
  switch (status) {
    case "noUser":
      return (loginMessage.textContent =
        "This user doesn't exist. Sign up first.");
    case "dontMatch":
      return (loginMessage.textContent =
        "Wrong email/password combination. Try again.");
    case "confirmPasswords":
      return (loginMessage.textContent =
        "Ups! your passwords doesn't match. Try again.");
    case "exists":
      return (loginMessage.textContent =
        "There was a problem. Please use a different email.");
  }
}

/**
 * This function is called to clear the value of the input elements.
 */
export function emptyInputFields() {
  let inputFields = document.querySelectorAll("input");
  inputFields.forEach((element) => {
    if (element.type === "checkbox") element.checked = false;
    element.value = "";
  });
}
