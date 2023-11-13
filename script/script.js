/**
 * --- Table of contents ---
 * 1. General functions
 * 2. Formatting/Validating functions
 * 3. Login functions
 * 4. User badge functions
 */

// General functions =================================================================
/**
 * This async function is used to include the html templates in the current page.
 */
async function includeHTML() {
  const includeElements = document.querySelectorAll("[data-include-html]");

  for (const element of includeElements) {
    const file = element.getAttribute("data-include-html");
    const resp = await fetch(file);

    if (!resp.ok) {
      console.warn("Couldn't find template");
    } else {
      element.innerHTML = await resp.text();
      disclaimer();
    }
  }
}

/**
 * This async function is used to store the payload with a SERVER_TOKEN on the server.
 * @param {string} key - key to store the value in.
 * @param {string} value - value yu want to store in the key.
 * @param {string} STORAGE_TOKEN - storage token must be imported from the server.
 */
async function storeData(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };

  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

/**
 * This async function is used to retrieve the storage token from the server and return it back to the client as a string.
 * @param {string} key - key of the stored object on the server.
 * @returns {Object} object - returns the value of the key or error if the key is not found.
 */
async function loadData(key) {
  // const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  // return fetch(url).then((res) => res.json());

  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      if (res.data) return res.data.value;
      throw `Could not find data with key "${key}".`;
    });
}

/**
 * This function is used to search for a specific cookie in the storage.
 * @param {string} cookieName - name of the cookie to search for.
 * @returns {string} cookie - if true, return value of the cookie, else undirected value,
 */
function getCookie(cookeName) {
  const name = cookeName + "=";
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    if (cookie.indexOf(name) === 0) return cookie.substring(name.length);
  }
  return "";
}

/**
 * This function is used to create a new cookie.
 * @param {string} name - name of the cookie.
 * @param {*} value - any value to be stored in the cookie.
 * @param {number} expiry - number of milliseconds that the cookie should be valid before being removed.
 */
function setCookie(name, value, expiry) {
  let cookieString = name + "=" + value + ";";

  if (expiry) {
    let now = new Date();
    let timeOut = new Date(now.getTime() + expiry);
    cookieString += " expires=" + timeOut.toGMTString() + ";";
  }

  document.cookie = cookieString;
}

/**
 * This function is use to update the stored cookie.
 * @param {string} name - name of the cookie.
 * @param {*} value - any value to be stored in the cookie,
 * @param {number} expiry - number of seconds the cookie should be valid before being removed.
 */
function updateCookie(name, value, expiry) {
  const cookie = getCookie(name);
  if (!cookie) deleteCookie(name);
  setCookie(name, value, expiry);
}

/**
 * This function is used to delete a cookie from the storage.
 * @param {string} name - name of the cookie to be deleted.
 */
function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Formatting/Validating functions =================================================================
/**
 * This function is used to formate the first character of a String to upper case.
 * Use this if you can't / doesn't want to use the css attribute (text-format: capitalize).
 * @param {string} word - word you want to formate.
 * @returns {string} word - formatted word.
 */
function changeFirstLetterToUppercase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * This function is used to format the amount to a specific length.
 * @param {number} amount - amount you want to change.
 * @param {number} num - number for which you want to set the amount.
 * @returns {number} amount - formatted amount length.
 */
function formatAmount(amount, num) {
  return amount.toFixed(num);
}

/**
 * This function is used to replace the decimal point with a decimal comma.
 * @param {string} num - number you want to change.
 * @returns {string} number - formatted number with a decimal comma.
 */
function replaceDotWithComma(num) {
  return num.replace(".", ",");
}

/**
 * This function is used to check if the value is a string.
 * @param {*} value - value to validate
 * @returns {boolean} true, if the value is a string, false otherwise.
 * @throws - throws error if false.
 */
function validateString(value) {
  if (typeof value !== "string")
    return console.error("The value must be a string");
  return value;
}

// Login/Sign up functions =============================================================
/**
 * This function is used to generate a random and unique user id.
 * It also checks if the id is already in the database and generates a new id.
 * @param {string[]} userIDs - array of strings with the existing user ids.
 * @returns {string} unique random user id.
 */
function generateUniqueUserID(userIDs) {
  let id;

  do {
    id = "";
    for (let i = 0; i < IDLength; i++) {
      const index = Math.floor(Math.random() * characters.length);
      id += characters.charAt(index);
    }
  } while (userIDs.includes(id));
  return id;
}

/**
 * Checks whether a user ID exists in an array.
 * @param {string} id - ID you want to check.
 * @param {string[]} userIDs - array of the user IDs in the database.
 * @returns {boolean} - true, if the ID is available, false otherwise.
 */
function findUserID(id, userIDs) {
  return !userIDs.includes(id);
}

/**
 * This function is used to generate a random Number between the start and end parameters.
 * @param {number} startNumber - start of the random number.
 * @param {number} endNumber - end of the random number.
 * @returns {number} - random number.
 */
function generateRandomNumber(startNumber, endNumber) {
  const randomDecimal = Math.random();
  const randomNumber =
    Math.floor(randomDecimal * (endNumber - startNumber + 1)) + startNumber;
  return randomNumber;
}

/**
 * Closes modal box.
 */
function closeModalBox() {
  showTaskForm = "";
  if (currentSearchedTasks.length == 0) {
    renderBoard(tasks);
  }
  if (currentSearchedTasks.length != 0) {
    renderBoard(currentSearchedTasks);
  }
  document.getElementById("modal-bg").classList.add("d-none");
  renderPage();
}

// User badge functions =================================================================

/**
 * generates contact circle icon with initials
 */
function renderCircleIconWithInitials(contactId, parentDivId, circleId) {
  let contact = contacts.filter((c) => c.id == contactId)[0];
  document.getElementById(parentDivId).innerHTML =
    generateCircleIconHTML(circleId);
  addCircleInitial(contact, circleId);
}

/**
 * generates the circle icon
 * @param {number} circleId 
 * @returns html
 */
function generateCircleIconHTML(circleId) {
  return /*html*/ `
    <div id="${circleId}" class="circle"></div>
  `;
}

/**
 * loads the contacts from the server
 * @returns array of contacts
 */
async function loadContactsFromServer() {
  let datas = await loadData("contacts");
  contacts = JSON.parse(datas);
  return contacts;
}

/**
 * adds color and initials to the circle
 */
function addCircleInitial(contact, id) {
  // the initials are no longer created, its now taken from contacts.initials
  const circle = document.getElementById(id); //the initials are created and added when contact is made
  circle.textContent = contact.initials;
  circle.style.backgroundColor = `var(--profile-color-${contact.color})`;
}

/**
 * convert unix date to local date string
 */
function dateToIsoString(unixTimeStamp) {
  let date = new Date(unixTimeStamp);
  let isoDatum = date.toLocaleDateString();
  return isoDatum;
}

/**
 * returns the changed date from format dd-mm-yyyy to yyyy-mm-dd
 * @param {date} date
 * @returns
 */
function changeIsoDateInYYYYMMDD(date) {
  let splittDate = date.split(".");
  let correctedMonth = "";
  let correctedDay = "";

  if (splittDate[1].length == 1) {
    correctedMonth = "0" + splittDate[1];
  } else {
    correctedMonth = splittDate[1];
  }

  if (splittDate[0].length == 1) {
    correctedDay = "0" + splittDate[0];
  } else {
    correctedDay = splittDate[0];
  }

  let newDate = splittDate[2] + "-" + correctedMonth + "-" + correctedDay;

  return newDate;
}

/**
 * Load Tasks from Backend, tranform the data in JSON and save in the variable tasks
 */
async function loadTasksfromBackend() {
  let datas = await loadData("tasks");
  tasks = JSON.parse(datas);
}

/**
 * set the disclaimer
 */
function disclaimer() {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split("=");
    if (cookie[0] !== "join_user-id") {
      linkToIndex();
      navdisabled();
    }
  }
}

/**
 * disabale the navigation
 */
function navdisabled() {
  const nav = document.querySelector(".nav-btn-container");
  const header = document.querySelector(".mobile-header-content");
  if (nav && header) {
    nav.style.display = "none";
    header.style.display = "none";
  }
}

/**
 * link to the index
 */
function linkToIndex() {
  const links = document.querySelectorAll('a[href="./dashboard.html"]');
  for (let i = 0; i < links.length; i++) {
    links[i].setAttribute("href", "./index.html");
  }
}
