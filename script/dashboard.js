// =================================================================================================
window.addEventListener("DOMContentLoaded", initDashboard);

/**
 * initialized the dashbaord
 */
async function initDashboard() {
  await includeHTML();
  setActiveTab();
  setBadgeInitial();
  initWelcome();
  initDashboardElements();
}

/**
 * initialized the dashbaord elements
 */
async function initDashboardElements() {
  await loadTasksfromBackend();

  const tasksInBoard = countTasksInBoard(tasks);
  const todo = countTasksInSection(tasks, "section", "To do");
  const todoUrgent = countTasksInSection(tasks, "priority", "urgent");
  const inProgress = countTasksInSection(tasks, "section", "In progress");
  const awaitFeedback = countTasksInSection(tasks, "section", "Await feedback");
  const done = countTasksInSection(tasks, "section", "Done");

  changeFieldsOnTop(tasksInBoard, inProgress, awaitFeedback);
  changeFieldsOnMiddle(todoUrgent);
  sort(); // added from BR
  renderDate(); // added from BR
  changeFieldsOnBottom(todo, done);
}

/**
 * loads tasks from backend
 */
async function loadTasksfromBackend() {
  let datas = await loadData("tasks");
  tasks = JSON.parse(datas);
}

/**
 * counts task in a dashbaord section
 * @param {string} data 
 * @param {number} key 
 * @param {string} sectionName 
 * @returns 
 */
function countTasksInSection(data, key, sectionName) {
  let count = 0;
  validateString(key);
  validateString(sectionName);

  for (const item of data) if (item[key] === sectionName) count++;
  return count;
}

/**
 * counts tasks in the board
 * @param {string} data 
 * @returns 
 */
function countTasksInBoard(data) {
  let count = 0;
  for (let i = 0; i < data.length; i++) count++;
  return count;
}

/**
 * updates the card number
 * @param {number} rowElements 
 * @param {number} numbers 
 */
function updateCardNumbers(rowElements, numbers) {
  rowElements.forEach((rowElement, i) => {
    const numElement = rowElement.querySelector(".card-num");
    if (numElement) numElement.textContent = numbers[i].toString();
  });
}

/**
 * change the fields to top
 * @param {number} todo 
 * @param {number} inProgress 
 * @param {number} awaitFeedback 
 */
function changeFieldsOnTop(todo, inProgress, awaitFeedback) {
  const topRow = document.querySelectorAll('[data-field="top-row"]');
  const nums = [todo, inProgress, awaitFeedback];
  updateCardNumbers(topRow, nums);
}

/**
 * changes the fiels to middle
 * @param {number} todo 
 */
function changeFieldsOnMiddle(todo) {
  const middleRow = document.querySelectorAll('[data-field="middle-row"]');
  const nums = [todo];
  updateCardNumbers(middleRow, nums);
}

/**
 * changes the filds to bottom
 * @param {number} todo 
 * @param {number} done 
 */
function changeFieldsOnBottom(todo, done) {
  const bottomRow = document.querySelectorAll('[data-field="bottom-row"]');
  const nums = [todo, done];
  updateCardNumbers(bottomRow, nums);
}

/**
 * sorts task at prio an date
 */
function sort() {
  tasks.sort((a, b) => {
    if (a.priority < b.priority) {
      return 1;
    } else if (a.priority > b.priority) {
      return -1;
    } else {
      return a.dueDate - b.dueDate;
    }
  });
}

/**
 * changes the unixtimestamp and rendert the date to month, day and year
 * @returns 
 */
function getDate() {
  const unixTimeStamp = tasks[0].dueDate;
  const date = new Date(unixTimeStamp);
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const formattedDate = `${month} ${day}, ${year}`;
  return formattedDate;
}

/**
 * render date
 */
function renderDate() {
  document.querySelector(".deadline-date").textContent = getDate();
}

/**
 * renders the welcome screen
 */
async function initWelcome() {
  const isLogin = localStorage.getItem("alreadyLoggin") === "true";
  const { elements, userName } = await storageManagement();
  if (userName == null) {
    renderGreeting(elements, "", "");
  } else {
    renderGreeting(elements, userName, ",");
  }
  if (isLogin === false) {
    greetingsAnimation();
  } else {
    document.querySelector(".overlay").classList.add("d-none");
  }
}

/**
 * loads name and passes it on
 * @returns json
 */
async function storageManagement() {
  localStorage.setItem("alreadyLoggin", true);
  const userID = getCookie("join_user-id");
  let contacts = await loadContactsFromServer();
  const userName = findUserById(userID, contacts);
  const elements = document.querySelectorAll(".greeting-font");
  return { elements, userName };
}

/**
 * search name by id   
 * @param {number} id 
 * @param {number} contacts 
 * @returns string
 */
function findUserById(id, contacts) {
  const user = contacts.find((contact) => contact.id === id);
  return user ? user.name : null;
}

/**
 * welcome animation using CSS
 */
function greetingsAnimation() {
  const overlayClass = document.querySelector(".overlay").classList;
  setTimeout(function () {
    overlayClass.add("hidden");
  }, 1250);
  setTimeout(function () {
    overlayClass.add("end");
  }, 2000);
}

/**
 * renders welcom
 */
function renderGreeting(elements, loginID, space) {
  elements.forEach((element) => {
    element.innerHTML = `<span>${greetingCurrentTime()}${space}<br><b class="greeting-user">${loginID}</b></span>`;
  });
}

/**
 * greets on current time
 * @returns string
 */
function greetingCurrentTime() {
  let hour = new Date().getHours();
  let greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return greeting;
}
