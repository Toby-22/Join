/**
 * Renders all necessary elements of the page, when board.html is loaded.
 */
async function renderPage() {
  await includeHTML();
  setActiveTab();
  setBadgeInitial();

  await loadTasksfromBackend();
  contacts = await loadContactsFromServer();
  renderBoard(tasks);
  changeVersion();
}

/**
 * Renders the board with all tasks which should be shown when function is called.
 * @param {string[]} tasksToShow
 */
function renderBoard(tasksToShow) {
  container = document.getElementById("sections");
  container.innerHTML = "";
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    let sectionTasks = tasksToShow.filter((t) => t["section"] == section);
    container.innerHTML += generateSectionHTML(section, i);
    if (sectionTasks.length != 0) {
      renderTasks(sectionTasks, i);
    } else {
      document.getElementById(`sec-default${i}`).innerHTML =
        generateDefaultTaskHTML(section);
    }
  }
}

/**
 * Renders the different parts of a task to be shown as one card at the board.
 * @param {string[]} sectionTasks - All tasks which are currently within a specific section. (e.g "To do")
 * @param {number} i - Index of the section within the sections array.
 */
function renderTasks(sectionTasks, i) {
  tasksContainer = document.getElementById("tasks" + String(i));
  tasksContainer.innerHTML = "";
  for (let j = 0; j < sectionTasks.length; j++) {
    const task = sectionTasks[j];
    tasksContainer.innerHTML += generateTaskHTML(task);
    let index = getCategoryColorIndex(task.id);
    document
      .getElementById(`category${task.id}`)
      .style.setProperty("--category-bg", categoryColors[index]);
    renderProgressBar(task.id, task.subtasks);
    renderAssigneeIcons(task);
    document.getElementById(`priority${task.id}`).innerHTML +=
      generatePrioritySymbolHTML(task["priority"]);
    taskUpDownDisplayNone(task);
  }
}

/**
 * Renders the add task for in the modal box
 */
async function renderAddTaskModalBox(sectionIndex) {
  showTaskForm = "Add-Task";
  sectionId = sectionIndex;
  document.getElementById("modal-bg").classList.remove("d-none");
  document.getElementById("modal-bg").innerHTML =
    generateShowAddTaskHTML(sectionIndex);
  await includeHTML();
  let element = document.getElementById("create-clear-button");
  element.style.position = "relative";
  element.style.bottom = "0";
  setInputToday();
}

/**
 * Renders the visual progress bar inside the task card.
 * @param {number} taskId - Id of the task
 * @param {string[]} subtasks - Array with all subtasks of the task
 */
function renderProgressBar(taskId, subtasks) {
  if (subtasks.length != 0) {
    const numberTasks = subtasks.length;
    const numberFinishedTasks = getNumberFinishedTasks(subtasks);
    const percent = (numberFinishedTasks / numberTasks) * 100;
    document.getElementById(`progress-bar${taskId}`).innerHTML =
      generateProgressBarHTML(numberTasks, numberFinishedTasks, percent);
  }
}

/**
 * Renders the icons for the user which are assigned to the task.
 * @param {string{}} task - JSON of the task
 */
function renderAssigneeIcons(task) {
  let assigneeList = 7;
  if (task.assignee.length <= 7) {
    assigneeList = task.assignee.length;
  }
  for (let i = 0; i < assigneeList; i++) {
    const contactId = task.assignee[i];
    document.getElementById(`contact-icons${task.id}`).innerHTML +=
      generateContactIconContainerHTML(task.id, i);
    renderCircleIconWithInitials(
      contactId,
      `icon${task.id}${i}`,
      `${task.id},${i}`
    );
    document.getElementById(`${task.id},${i}`).classList.add("small-icon");
  }
}

/**
 * Renders the card with the task details.
 * @param {*} taskId
 */
function renderTaskDetails(taskId) {
  const task = tasks.filter((t) => t["id"] == taskId)[0];
  document.getElementById("modal-bg").innerHTML =
    generateTaskDetailedHTML(task);
  document.getElementById("priority").innerHTML += generatePrioritySymbolHTML(
    task.priority
  );
}

/**
 * Renders the assignee part at the detailed task card.
 * @param {number} taskId - Id of the task
 */
function renderTaskDetailsAssignee(taskId) {
  const task = tasks.filter((t) => t["id"] == taskId)[0];
  for (let i = 0; i < task.assignee.length; i++) {
    const contactId = task.assignee[i];
    const contactName = contacts.filter((c) => c.id == contactId)[0].name;
    document.getElementById("assigened-container").innerHTML +=
      generateAssigneeUserHTML(contactName, i);
    renderCircleIconWithInitials(contactId, `contactIcon${i}`, `circle${i}`);
  }
}

/**
 * Renders the subtasks part at the detailed task card.
 * @param {number} taskId - Id of the task
 */
function renderTaskDetailsSubtasks(taskId) {
  const task = tasks.filter((t) => t["id"] == taskId)[0];
  document.getElementById("subtask-container").innerHTML = "";
  for (let j = 0; j < task["subtasks"].length; j++) {
    const subtask = task.subtasks[j];
    document.getElementById("subtask-container").innerHTML +=
      generateSubtasksHTML(taskId, subtask, j);
  }
}
