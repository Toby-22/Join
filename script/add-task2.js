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
  