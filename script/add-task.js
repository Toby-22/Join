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