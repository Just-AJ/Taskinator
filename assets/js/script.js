console.dir(window.document);
var taskIdCounter = 0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-comlpeted");
var pageContentEl = document.querySelector("#page-content");
var tasks = [];

var taskFormHandler = function (event) {  
 event.preventDefault();
 var taskNameInput = document.querySelector("input[name='task-name']").value;
 var taskTypeInput = document.querySelector("select[name='task-type']").value;
 
 if (taskNameInput === "" || taskTypeInput === "") {
    alert("You need to fill out the task form!");
    return false;
 }

 document.querySelector("input[name='task-name']").value = "";
 document.querySelector("select[name='task-type']").selectedIndex = 0;

 var isEdit = formEl.hasAttribute("data-task-id");

 if (isEdit) {
     var taskId = formEl.getAttribute("data-task-id");
     completeEditTask(taskNameInput, taskTypeInput, taskId);
    } else {
     var taskDataObj = {
     name: taskNameInput,
     type: taskTypeInput,
     status: "to do"
     };
     createTaskEl(taskDataObj);
  }
};

var createTaskEl = function(taskDataObj) {
    //console.log(taskDataObj);
    //console.log(taskDataObj.status);

    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);
  
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);
  
    // create task actions (buttons and select) for task
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    tasksToDoEl.appendChild(listItemEl);
  
    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    saveTasks();

    // increase task counter for next unique id
    taskIdCounter++;
  };

var createTaskActions = function (taskId) {
    //edit button
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    //delete button
    var deletebuttonEl = document.createElement("button");
    deletebuttonEl.textContent = "Delete";
    deletebuttonEl.className = "btn delete-btn";
    deletebuttonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deletebuttonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (var i = 0; i < statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    saveTasks();

    alert("Task Updated");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var taskButtonHandler = function(event) {
    var targetEl = event.target;

    if (targetEl.matches(".edit-btn")) {
        console.log("edit", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    } else if (targetEl.matches(".delete-btn")) {
        console.log("delete", targetEl);
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var taskStatusChangeHandler = function(event) {
    console.log(event.target.value);

  var taskId = event.target.getAttribute("data-task-id");

  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  var statusValue = event.target.value.toLowerCase();

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  }
  else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  }
  else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
        tasks[i].status = statusValue;
    }
  }
  //console.log(tasks);
  saveTasks();
};

var editTask = function(taskId) {
    console.log(taskId);
  
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  
    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);
  
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);
  
    // write values of taskname and taskType to form to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
  
    // set data attribute to the form with a value of the task's id so it knows which one is being edited
    formEl.setAttribute("data-task-id", taskId);
    // update form's button to reflect editing a task rather than creating a new one
    formEl.querySelector("#save-task").textContent = "Save Task";
  };

var deleteTask = function(taskId) {
    console.log(taskId);

    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    var updatedTaskArr = [];

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    tasks = updatedTaskArr;
    saveTasks();
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

formEl.addEventListener("submit", taskFormHandler);

pageContentEl.addEventListener("click", taskButtonHandler);

pageContentEl.addEventListener("change", taskStatusChangeHandler);