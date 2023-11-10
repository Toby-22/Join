let currentDraggedElement;
let currentSearchedTasks = [];
let currentSection;
let showTaskForm;
let currentShownTask;

window.addEventListener("resize", changeVersion);

/**
 * This function sets css.classes weather the programm should be shown as mobile or desktop version.
 */
function changeVersion() {
  if (window.innerWidth <= 768) {
    setSwiperClasses();
    creatSwiperObject();
  }
  if (window.innerWidth > 768) {
    removeSwiperClasses();
  }
  setEditTaskStyle();
  setAddTaskStyle();
}

/**
 * Sets the style properties for edit task.
 */
function setEditTaskStyle() {
  if (showTaskForm == "Edit-Task" && window.innerWidth <= 280) {
    document
      .getElementById("form-content")
      .style.setProperty("flex-direction", "row");
    document.getElementById("middle-line").style.display = "block";
  }
  if (showTaskForm == "Edit-Task" && window.innerWidth > 280) {
    document
      .getElementById("form-content")
      .style.setProperty("flex-direction", "column");
    document.getElementById("middle-line").style.display = "none";
  }
}

/**
 * Sets the style properties for add task.
 */
function setAddTaskStyle() {
  if (showTaskForm == "Add-Task" && window.innerWidth <= 1340) {
    document
      .getElementById("form-content")
      .style.setProperty("flex-direction", "column");
    document.getElementById("middle-line").style.display = "none";
  }
  if (showTaskForm == "Add-Task" && window.innerWidth > 1340) {
    document
      .getElementById("form-content")
      .style.setProperty("flex-direction", "row");
    document.getElementById("middle-line").style.display = "block";
  }
}

/**
 * This function creates a swiper object for swiping tasks in mobile version.
 */
function creatSwiperObject() {
  new Swiper(".mySwiper", {
    slidesPerView: "auto",
    centeredSlides: false,
    spaceBetween: 0,
    grabCursor: true,
  });
}

/**
 * Sets the necessary classes to get swiper work correctly in mobile version.
 */
function setSwiperClasses() {
  const sections = document.querySelectorAll(".drop-area");
  sections.forEach(function (section) {
    section.classList.add("swiper", "mySwiper");
  });
  const sectasks = document.querySelectorAll(".sec-tasks");
  sectasks.forEach(function (sectask) {
    sectask.classList.add("swiper-wrapper");
  });
  const tasks = document.querySelectorAll(".task");
  tasks.forEach(function (task) {
    task.classList.add("swiper-slide");
  });
}

/**
 * Removes classes for swiper to get elements working correcly in desktop version.
 */
function removeSwiperClasses() {
  let section = document.getElementById("drop-area0");
  if (section.classList.contains("swiper")) {
    renderPage();
  }
}

/**
 * Shows add task element for adding a new task according to the chosen section depending to mobile or deskotp version.
 * @param {number} sectionIndex - Index of the section within the sections array.
 */
async function showAddTask(sectionIndex) {
  sectionId = sectionIndex;
  if (window.innerWidth <= 768) {
    window.location.href = `./add-task.html?sectionId=${sectionIndex}`;
  }
  if (window.innerWidth > 768) {
    await renderAddTaskModalBox(sectionIndex);
  }
}

/**
 * Gets the Index of the category for finding the belonging color for design elements.
 * @param {number} taskId - Id number of the task
 * @returns {number} - Index number of the category within the categories array.
 */
function getCategoryColorIndex(taskId) {
  const task = tasks.filter((t) => t["id"] == taskId)[0];
  const index = categories.indexOf(task.category);
  return index;
}

/**
 * Finds the number of finished subtasks for rendering the progress bar.
 * @param {string[]} subtasks - Array with all subtasks of the task
 * @returns {number} - Number of finished (marked) subtasks in the task.
 */
function getNumberFinishedTasks(subtasks) {
  let n = 0;
  for (let i = 0; i < subtasks.length; i++) {
    const subtask = subtasks[i];
    if (subtask.status == 1) {
      n++;
    }
  }
  return n;
}

/**
 * Shows the animated modal card with background for task details.
 * @param {number} taskId - Id of the task
 */
async function showTaskDetails(taskId) {
  document.getElementById("modal-bg").classList.remove("d-none");
  renderTaskDetails(taskId);
  renderTaskDetailsAssignee(taskId);
  renderTaskDetailsSubtasks(taskId);
  let index = getCategoryColorIndex(taskId);
  document
    .getElementById(`categoryTaskDetailed${taskId}`)
    .style.setProperty("--category-bg", categoryColors[index]);
  document.getElementById("task-detailed").classList.add("slide-in");
}

/**
 * Switches to add-task.html or shows modal box with task-form.html depending on mobile or desktop version.
 * @param {Number} taskId - Id of the task
 */
async function editTask(taskId) {
  currentShownTask = tasks.filter((t) => t["id"] == taskId)[0];
  if (window.innerWidth <= 768) {
    const sectionId = sections.indexOf(currentShownTask.section);
    window.location.href = `./add-task.html?sectionId=${sectionId}&taskId=${taskId}`;
  }
  if (window.innerWidth > 768) {
    showTaskForm = "Edit-Task";
    document.getElementById("task-detailed-content").classList.add("d-none");
    await includeHTML();
    setStyleProperties(taskId);
    loadTaskInAddTaskForm(taskId);
    changeVersion();
  }
}

/**
 * Sets needed style properties
 */
function setStyleProperties(taskId) {
  document
    .getElementById("task-detailed-edit-content")
    .classList.remove("d-none");
  document.getElementById("form-content").style.overflow = "auto";
  document.getElementById("form-content").style.height = "510px";
  document.getElementById("form-content").style.justifyContent = "normal";
  let createButton = document.getElementById("create-button");
  createButton.innerHTML = "Edit Task";
  createButton.type = "button";
  createButton.style.height = "32px";
  createButton.onclick = saveEditTask;
  let cancelButton = document.getElementById("clear-button");
  cancelButton.innerHTML = "Cancel";
  cancelButton.onclick = cancelTask;
  cancelButton.style.height = "32px";
  document.getElementById("edit-delete").classList.add("d-none");
}

/**
 * Saves the current edited task.
 */
async function saveEditTask() {
  let currentTask = getEditTaskData();
  const index = tasks.findIndex((t) => t["id"] == currentTask.id);
  tasks[index] = currentTask;
  await storeData("tasks", tasks);
  cancelTask();
}

/**
 * Prepares the current available information in the task form for
 * saving them as one task in tasks.
 * @returns task in JSON format
 */
function getEditTaskData() {
  let id = currentShownTask.id;
  let title = document.getElementById("titel-field").value;
  let description = document.getElementById("description-field").value;
  let selectedDateISO = document.getElementById("date-field").value;
  let category = document.getElementById("category").innerHTML;
  let section = currentShownTask.section;

  let actualTask = {
    id: id,
    title: title,
    description: description,
    assignee: addedAssignees,
    priority: actualActivePriority,
    dueDate: changeTimeFormatUnix(selectedDateISO),
    category: category,
    subtasks: addedSubtasks,
    section: section,
  };
  return actualTask;
}

// Drag and Drop Function
/**
 * Starts function when task element beginns to be draged.
 * @param {number} id  - task id
 */
function startDragging(id) {
  if (window.innerWidth <= 768) {
    removeSwiperClasses();
  }
  currentDraggedElement = id;
}

/**
 * Needed for the drop area, so that droping the element works.
 * @param {} ev
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Changes the section from the task to where it should be dropped.
 * @param {*} section - section where the task should come to
 */
async function moveTo(section) {
  const task = tasks.findIndex((t) => t["id"] == currentDraggedElement);
  tasks[task]["section"] = section;
  await storeData("tasks", tasks);
  renderBoard(tasks);
}

/**
 * Delets a task
 * @param {number} taskId - Id of the task
 */
async function deleteTask(taskId) {
  const taskIndex = tasks.findIndex((t) => t["id"] == taskId);
  tasks.splice(taskIndex, 1);
  closeModalBox();
  await storeData("tasks", tasks);
}

/**
 * Highlights the drop area
 * @param {string} id - Id of the drop area
 */
function highlight(id) {
  document.getElementById(id).classList.add("highlight");
}
/**
 * Removes the highlighting of the drop area
 * @param {number} id - Id of the drop area
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("highlight");
}

/**
 * Changes the status of the subtask when marked or the mark is removed
 * @param {number} taskId - Id of the task
 * @param {number} subtaskIndex - Index of the subtask within the subtasks array
 */
async function changeStatus(taskId, subtaskIndex) {
  let taskIndex = tasks.findIndex((t) => t["id"] == taskId);
  let subtaskStatus = tasks[taskIndex]["subtasks"][subtaskIndex]["status"];
  if (subtaskStatus == 0) {
    tasks[taskIndex]["subtasks"][subtaskIndex]["status"] = 1;
  }
  if (subtaskStatus == 1) {
    tasks[taskIndex]["subtasks"][subtaskIndex]["status"] = 0;
  }
  await storeData("tasks", tasks);
  renderTaskDetailsSubtasks(taskId);
}

/**
 * Filters the tasks when user is searching
 * @param {string} elementId - value of the search bar
 */
function filterTasks(elementId) {
  let search = document.getElementById(elementId).value;
  search = search.toLowerCase();
  currentSearchedTasks = [];
  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    if (
      task.title.toLowerCase().includes(search) ||
      task.description.toLowerCase().includes(search)
    ) {
      currentSearchedTasks.push(task);
    }
  }
  renderBoard(currentSearchedTasks);
}

/**
 * Changes the section from a task in mobile version
 * @param {number} taskId - Id of the task
 * @param {boolean} direction - Defines wether the task switches one task up or down
 */
async function taskUpDown(taskId, direction) {
  const taskIndex = tasks.findIndex((t) => t["id"] == taskId);
  const task = tasks[taskIndex];
  let sectionId = sections.findIndex((s) => s == task.section);
  let newSectionId;
  if (direction == 1) {
    newSectionId = sectionId - 1;
  }
  if (direction == 0) {
    newSectionId = sectionId + 1;
  }
  tasks[taskIndex]["section"] = sections[newSectionId];
  await storeData("tasks", tasks);
  renderPage();
}

/**
 * Hides the up or down button for first and last section which is not logical to use
 * @param {string{}} task - JSON of the task
 */
function taskUpDownDisplayNone(task) {
  if (task.section == "To do") {
    document.getElementById(`up${task.id}`).classList.add("d-none");
  }
  if (task.section == "Done") {
    document.getElementById(`down${task.id}`).classList.add("d-none");
  }
}
