// =================================================================================================
window.addEventListener("DOMContentLoaded", initDashboard);

async function initDashboard() {
  await includeHTML();
  setActiveTab();
  setBadgeInitial();
  initWelcome();
  initDashboardElements();
}

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

async function loadTasksfromBackend() {
  let datas = await loadData("tasks");
  tasks = JSON.parse(datas);
}

function countTasksInSection(data, key, sectionName) {
  let count = 0;
  validateString(key);
  validateString(sectionName);

  for (const item of data) if (item[key] === sectionName) count++;
  return count;
}

function countTasksInBoard(data) {
  let count = 0;
  for (let i = 0; i < data.length; i++) count++;
  return count;
}

function updateCardNumbers(rowElements, numbers) {
  rowElements.forEach((rowElement, i) => {
    const numElement = rowElement.querySelector(".card-num");
    if (numElement) numElement.textContent = numbers[i].toString();
  });
}

function changeFieldsOnTop(todo, inProgress, awaitFeedback) {
  const topRow = document.querySelectorAll('[data-field="top-row"]');
  const nums = [todo, inProgress, awaitFeedback];
  updateCardNumbers(topRow, nums);
}

function changeFieldsOnMiddle(todo) {
  const middleRow = document.querySelectorAll('[data-field="middle-row"]');
  const nums = [todo];
  updateCardNumbers(middleRow, nums);
}

function changeFieldsOnBottom(todo, done) {
  const bottomRow = document.querySelectorAll('[data-field="bottom-row"]');
  const nums = [todo, done];
  updateCardNumbers(bottomRow, nums);
}

// sortiert die Tasks nach prio und dann nach datum         // added from BR
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

// wandelt unixTimeStamp um und rendert datum nach Monat, Tag und Jahr         // added from BR
function getDate() {
  const unixTimeStamp = tasks[0].dueDate;
  const date = new Date(unixTimeStamp);
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const formattedDate = `${month} ${day}, ${year}`;
  return formattedDate;
}

// render date                                                       // added from BR
function renderDate() {
  document.querySelector(".deadline-date").textContent = getDate();
}

// render welcome screen
async function initWelcome() {
  // added from BR
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

// loads name and passes it on
async function storageManagement() {
  localStorage.setItem("alreadyLoggin", true);
  const userID = getCookie("join_user-id");
  let contacts = await loadContactsFromServer();
  const userName = findUserById(userID, contacts);
  const elements = document.querySelectorAll(".greeting-font");
  return { elements, userName };
}

// search name by id                    // is not needed yet
function findUserById(id, contacts) {
  const user = contacts.find((contact) => contact.id === id);
  return user ? user.name : null;
}

// welcome animation using CSS
function greetingsAnimation() {
  const overlayClass = document.querySelector(".overlay").classList;
  setTimeout(function () {
    overlayClass.add("hidden");
  }, 1250);
  setTimeout(function () {
    overlayClass.add("end");
  }, 2000);
}

// rendert welcome
function renderGreeting(elements, loginID, space) {
  elements.forEach((element) => {
    element.innerHTML = `<span>${greetingCurrentTime()}${space}<br><b class="greeting-user">${loginID}</b></span>`;
  });
}

function greetingCurrentTime() {
  let hour = new Date().getHours();
  let greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return greeting;
}
