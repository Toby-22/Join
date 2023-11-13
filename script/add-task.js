let actualActivePriority = "medium";
let addedAssignees = [];
let isOpenContactList = false;
let addedSubtasks = [];
let contactsAlreadyLoaded = false;

/**
 * Written by WS
 * Loads all necessary functions to render the page correctly.
 */
async function renderAddTaskPage() {
  await includeHTML();
  setActiveTab();
  setBadgeInitial();

  await loadTasksfromBackend();
  await loadContactsFromServer();
  checkEditTaskId();
  setInputToday();
}

/**
 * Opens the drop down menu for the category selection
 */
function dropDownCategory() {
  const categorieField = document.getElementById("categories");

  if (categorieField.classList.contains("d-none")) {
    categorieField.classList.remove("d-none");
    renderCategoryOptions();
  } else {
    closeCategoryDropDown();
  }
}

/**
 * Renders the category options from the constant categories in the drop down menu
 */
function renderCategoryOptions() {
  const categoriesContainer = document.getElementById("categories");
  categoriesContainer.innerHTML = "";

  categories.forEach((element, index) => {
    const spanElement = document.createElement("span");
    spanElement.textContent = element;
    spanElement.id = `category-${index}`;

    spanElement.addEventListener("click", () => {
      const selectedCategory = element;
      document.getElementById("category").innerHTML = selectedCategory;
      document.getElementById("category").classList.remove("category-empty");
      closeCategoryDropDown();
    });

    categoriesContainer.appendChild(spanElement);
  });
}

/**
 * closes the categroy drop down menu
 */
function closeCategoryDropDown() {
  const categorieField = document.getElementById("categories");
  categorieField.classList.add("d-none");
}

/**
 * This function takes the information from the add-task form and creat a task
 */
async function addTask() {
  if(validateFilds()){
    let actualTask = captureProptertiesOfTask();
    tasks.push(actualTask);

    //save Data in Backend
    await storeData("tasks", tasks);
    clearForm();
    try {
      closeModalBox();
    } catch (error) {}
    window.location.href = `./board.html`;
  }
}

/**
 * returns true if a category is choosen
 * @returns boolean
 */
function validateFilds(){
  let categorieField = document.getElementById("category");
  if(actualActivePriority == ""){
    console.log("Priorität ist ein Pflichfeld")
  }else if(categorieField.innerHTML == "Select task category" || categorieField.innerHTML == "Category is required"){
    categorieField.innerHTML = "Category is required";
    categorieField.classList.add("category-empty");
  }else{
    return true;
  }
}

/**
 * Returns the properties of the task input form as a JSON obejct
 * @returns task properties as JSON object
 */
function captureProptertiesOfTask() {
  let title = document.getElementById("titel-field").value;
  let description = document.getElementById("description-field").value;
  let selectedDateISO = document.getElementById("date-field").value;
  let category = document.getElementById("category").innerHTML;

  let actualTask = {
    id: createTaskId(),
    title: title,
    description: description,
    assignee: addedAssignees,
    priority: actualActivePriority,
    dueDate: changeTimeFormatUnix(selectedDateISO),
    category: category,
    subtasks: addedSubtasks,
    section: sections[catchSectionId()],
  };
  return actualTask;
}

/**
 * the function returns the index of the section Array for the Task.
 * the index for the section comes either from the url or from the variable sectionId
 * @returns sectionId
 */
function catchSectionId() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlSectionId = urlParams.get("sectionId");
  if (urlSectionId) {
    return urlSectionId;
  } else if (sectionId == undefined) {
    sectionId = 0;
    return sectionId;
  } else {
    return sectionId;
  }
}

/**
 * Creats the task id
 * @returns taskId
 */
function createTaskId() {
  let maxId = -1;
  if (tasks.length == 0) {
    return 0;
  }
  for (let i = 0; i < tasks.length; i++) {
    let currentId = tasks[i]["id"];

    if (currentId > maxId) {
      maxId = currentId;
    }
  }
  maxId++;
  return maxId;
}

/**
 * Changes time format from ddmmyyyy in Unix formatresetPrioField
 */
function changeTimeFormatUnix(dateIsoFormat) {
  let date = new Date(dateIsoFormat);
  return date.getTime();
}

/**
 * This function highlight the activated Prio Button
 * @param {string} prioType
 */
function markPrioField(prioType) {
  if (prioType === actualActivePriority) {
    if (prioType === "urgent") {
      resetPrioButtonUrgent();
    } else if (prioType === "medium") {
      resetPrioButtonMedium();
    } else if (prioType === "low") {
      resetPrioButtonLow();
    }
    actualActivePriority = "";
  } else {
    resetPrioField();
    if (prioType === "urgent") {
      setPrioButtonUrgent();
      actualActivePriority = prioType;
    } else if (prioType === "medium") {
      setPrioButtonMedium();
      actualActivePriority = prioType;
    } else if (prioType === "low") {
      setPrioButtonLow();
      actualActivePriority = prioType;
    }
  }
}

/**
 * Resets the prio fields
 */
function resetPrioField() {
  actualActivePriority = "medium";
  resetPrioFieldHtml();
}

/**
 * resets all Contacts in the Assignee Field
 */
function resetAssigneeField() {
  let contactDiv = document.getElementById("contacts");
  contactDiv.classList.add("dnone");
  contactDiv.innerHTML = ``;
  isOpenContactList = false;
  addedAssignees = [];
}


/**
 * Render the Contacs in the Assignee Field
 */
function renderContacts() {
  event.stopPropagation();
  let contactDiv = document.getElementById("contacts");
  if (!isOpenContactList) {
    isOpenContactList = true;
    contactDiv.classList.remove("dnone");
    document.addEventListener("click", closeContactsOnClick);
  } else {
    isOpenContactList = false;
    contactDiv.classList.add("dnone");
    document.removeEventListener("click", closeContactsOnClick);
  }
  if (!contactsAlreadyLoaded) {
    contacts.forEach((element, index) => {
      showContactlist(element, index);
    });
    contactsAlreadyLoaded = true;
  }
}

/**
 * this function close the contactlist bei click anywhere
 */
function closeContactsOnClick(event) {
  let contactDiv = document.getElementById("contacts");

  if (!contactDiv.contains(event.target)) {
    isOpenContactList = false;
    contactDiv.classList.add("dnone");
    document.removeEventListener("click", closeContactsOnClick);
  }
}


/**
 * Render the Contacs in the Assignee Field in the Edit form
 */
function renderContactsinForm() {
  let contactDiv = document.getElementById("contacts");
  isOpenContactList = false;

  if (contactsAlreadyLoaded == false) {
    contacts.forEach((element, index) => {
      showContactlist(element, index);
    });
    contactsAlreadyLoaded = true;
  }
}


/**
 * extract the initials from the first and surname
 * @param {string} name
 * @returns the first letter of the first and surname as a string
 */
function extractInitials(name) {
  let names = name.split(" ");
  let firstLetter = names[0].charAt(0);
  let secondLetter = names[1].charAt(0);

  return firstLetter + secondLetter;
}

/**
 * Add selected Users to the array AddedUsers
 * @param {string} userId
 */
function addAssigneeToTask(userId) {
  let assignee = document.getElementById(userId).classList;
  assignee.toggle("selectedAssignee");
  if (assignee.contains("selectedAssignee")) {
    document.getElementById("img-" + userId).src =
      "./assets/icons/checkbox-outline-active-white.svg";
    addedAssignees.push(userId);
  } else {
    document.getElementById("img-" + userId).src =
      "./assets/icons/checkbox-outline-default.svg";
    for (let i = 0; i < addedAssignees.length; i++) {
      if (addedAssignees[i] === userId) {
        addedAssignees.splice(i, 1);
        i--;
      }
    }
  }
  showFirstAddedAssigneeInForm();
}

/**
 * Insert the first added Assignee from the AddTask Form in the Assigned to Field
 */
function showFirstAddedAssigneeInForm() {
  let userId = addedAssignees[0];
  let firstUserName = contacts.filter((t) => t["id"] == userId)[0];
  if (firstUserName == undefined) {
    document.getElementById("assignee").innerHTML = `Select contacts to assign`;
  } else {
    document.getElementById("assignee").innerHTML = `${firstUserName.name}`;
  }
}

/**
 * extract the value of the downloaded Object from the Server
 * @param {object} promiseObject
 */
async function getValueFromPromise(promiseObject) {
  try {
    const result = await promiseObject;
    tasks = result.data.value;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Change icons by click in Subtaksfield
 */
function insertSubtask() {
  let insertfield = document.getElementById("insertfield-subtask");
  renderSubtasks();
  insertfield.classList.add("activeSubtaskField");
  showIconsInSubtaskInput();
}

/**
 * Rebuild the Subtaskfield in standard look
 */
function closeSubtask() {
  let insertfield = document.getElementById("insertfield-subtask");
  renderSubtasks();
  insertfield.classList.remove("activeSubtaskField");

  insertfield.innerHTML = `
    <input type="text" id="subtask-field" placeholder="Add new subtask" onclick="insertSubtask()"/>
      <img src="./assets/icons/capa 1 dark.svg" onclick="insertSubtask()"/>
  `;
}

/**
 * Stores a newly added subtask in the array addedSubtasks
 */
function addSubtask() {
  let subtask = document.getElementById("subtask-field").value;
  if (subtask != "") {
    addedSubtasks.push({ subtask: subtask, status: 0 });
    renderSubtasks();
    document.getElementById("subtask-field").value = "";
  }
  closeSubtask();
}

/**
 * Renders the added subtasks
 */
function renderSubtasks() {
  const printSubtasksElement = document.getElementById("printSubtasks");
  printSubtasksElement.innerHTML = "";

  for (let i = 0; i < addedSubtasks.length; i++) {
    const element = addedSubtasks[i];
    showAddedSubTasks(i, element);
  }
}

/**
 * Deletes the complete form content
 */
function clearForm() {
  document.getElementById("addTaskForm").reset();
  resetPrioField();
  setPrioButtonMedium();
  actualActivePriority = "medium"; 
  resetAssigneeField();
  closeCategoryDropDown();
  addedSubtasks = [];
  contactsAlreadyLoaded = false;
  document.getElementById("printSubtasks").innerHTML = "";
  document.getElementById("assignee").innerHTML = `Select contacts to assign`;
  document.getElementById("category").innerHTML = `Select task category`;
  document.getElementById("category").classList.remove("category-empty");
}

/**
 * delete Subtaks from the variable addedSubtasks
 * @param {number} id id of the Subtask position in the variable addedSubtasks
 */
function deleteSubtask(id) {
  addedSubtasks.splice(id, 1);
  renderSubtasks();
}

/**
 * Open des Subtask to edit the text
 * @param {number} id
 */
function editSubtask(id) {
  const printSubtasksElement = document.getElementById("printSubtasks");
  closeSubtask();
  showIconsInAddedSubtask(id);
}

/**
 * change the subtask text in the variable addedSubtasks
 * @param {number} id
 */
function saveEditSubtask(id) {
  const editSubtaks = document.getElementById("edit-field").value;
  let actualStatusSubtask = addedSubtasks[id].status;
  addedSubtasks.splice(id, 1, {
    subtask: editSubtaks,
    status: actualStatusSubtask,
  });
  renderSubtasks();
}

/**
 * Add selected Users to the array AddedUsers and show it in the form
 */
function selectAssigneefromExistingTask() {
  renderContactsinForm();
  for (let id = 0; id < addedAssignees.length; id++) {
    const userId = addedAssignees[id];
    const userInformation = contacts.filter((t) => t["id"] == userId)[0];
    if (userInformation.disabled == false) {
      document.getElementById(userId).classList.add("selectedAssignee");
      document.getElementById("img-" + userId).src =
        "./assets/icons/checkbox-outline-active-white.svg";
    }
  }
  showFirstAddedAssigneeInForm();
  document.getElementById("contacts").classList.add("dnone");
}

/**
 * this funktion loads a task with the parameter taskId in the task-form.html
 * @param {number} taskId
 */
function loadTaskInAddTaskForm(taskId) {
  let task = tasks.filter((t) => t["id"] == taskId)[0];

  let id = task.id;
  let title = task.title;
  let description = task.description;
  addedAssignees = task.assignee;
  let priority = task.priority;
  let dueDate = dateToIsoString(task.dueDate);
  let category = task.category;
  addedSubtasks = task.subtasks;
  let section = task.section;

  document.getElementById("titel-field").value = title;
  document.getElementById("description-field").value = description;
  document.getElementById("date-field").value =
    changeIsoDateInYYYYMMDD(dueDate);
  document.getElementById("category").innerHTML = category;
  markPrioField(priority);
  renderSubtasks();
  selectAssigneefromExistingTask();
}

/**
 * Written by WS
 * This function checks if a task should be edit when loading the page.
 */
function checkEditTaskId() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlTaskId = urlParams.get("taskId");
  if (urlTaskId) {
    loadTaskInAddTaskForm(urlTaskId);
    let createButton = document.getElementById("create-button");
    createButton.innerHTML = "Edit Task";
    createButton.type = "button";
    createButton.onclick = saveTask;
    let cancelButton = document.getElementById("clear-button");
    cancelButton.innerHTML = "Cancel";
    cancelButton.onclick = cancelTask;
  }
}

/**
 * Written by WS
 * Cancels editing a task and links back to board.html.
 */
function cancelTask() {
  window.location.href = `./board.html`;
}

/**
 * Written by WS
 * Saves task with the current informations available in the task form.
 */
async function saveTask() {
  let currentTask = getCurrentTaskData();
  const index = tasks.findIndex((t) => t["id"] == currentTask.id);
  tasks[index] = currentTask;
  await storeData("tasks", tasks);
  cancelTask();
}

/**
 * Written by WS
 * Prepares the current available information in the task form
 * for saving them as one task in tasks.
 * @returns task in JSON format
 */
function getCurrentTaskData() {
  const urlParams = new URLSearchParams(window.location.search);
  let id = parseInt(urlParams.get("taskId"));
  let title = document.getElementById("titel-field").value;
  let description = document.getElementById("description-field").value;
  let selectedDateISO = document.getElementById("date-field").value;
  let category = document.getElementById("category").innerHTML;

  let actualTask = {
    id: id,
    title: title,
    description: description,
    assignee: addedAssignees,
    priority: actualActivePriority,
    dueDate: changeTimeFormatUnix(selectedDateISO),
    category: category,
    subtasks: addedSubtasks,
    section: sections[catchSectionId()],
  };
  return actualTask;
}

/**
 * set minimum input Date of today
 */
function setInputToday() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1; //January is 0!
  let yyyy = today.getFullYear();

  if (dd < 10) {
    dd = "0" + dd;
  }

  if (mm < 10) {
    mm = "0" + mm;
  }

  today = yyyy + "-" + mm + "-" + dd;
  document.getElementById("date-field").setAttribute("min", today);
}
