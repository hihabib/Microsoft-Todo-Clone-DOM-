//TODO: Add functionality in important route so that it adds task as important.
//TODO: Implement 404 page

import { addToDB, getDataDB } from "./lib/mangeDB.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { createCompleteTask, createIncompletedTask } from "./task/index.js";
import { TASK_COLLECTION_NAME } from "./define.js";
import executeAccordion from "./accordion.js";
const html = String.raw;

const taskElements = html`
<form id="create-new-task" action="">
   <div class="task-box">
    <div>
      <i class="bi bi-circle"></i>
    </div>
    <input class="new-task" type="text" name="" placeholder="Add a task" id="" >
  </div>
  <div class="form-bottom">
    <div>
      <i class="bi bi-calendar-range" ></i>
      <i class="bi bi-bell" ></i>
      <i class="bi bi-repeat" ></i>
    </div>

    <div><button class="submit-form" type="submit">Add</button></div>
  </div>
</form>

<div class="task-list" ></i>

<div class="completed-task-accordion">
  <button class="accordion">
    <i class="bi bi-chevron-right" ></i> <span>Completed</span>
  </button>
  <div class="panel">
    <div class="completed-task-list" ></div>
  </div>
</div>
`;

// history.pushState("", "", "/myDay");
const loadInitialScripts = () => {
  document.querySelector("#tasks").innerHTML = taskElements;
  executeAccordion();

  const form = document.querySelector("#create-new-task");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskName = document.querySelector(".new-task").value;

    const newTaskID = uuidv4();
    const newTaskDetails = {
      id: newTaskID,
      name: taskName,
      isComplete: false,
      isImportant: false,
    };

    createIncompletedTask(newTaskDetails);
    //save to db
    addToDB(TASK_COLLECTION_NAME, [
      {
        id: newTaskID,
        name: taskName,
        isComplete: false,
        isImportant: false,
      },
    ]);

    document.querySelector(".new-task").value = "";
  });

  // load initaially

  document.querySelector(".new-task").focus();

  const taskList = getDataDB(TASK_COLLECTION_NAME);
  taskList.forEach((task) => {
    if (task.isComplete) {
      createCompleteTask(task);
    } else {
      createIncompletedTask(task);
    }
  });
};

const loadImportant = () => {
  document.querySelector("#tasks").innerHTML = taskElements;
  executeAccordion();

  const form = document.querySelector("#create-new-task");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskName = document.querySelector(".new-task").value;

    const newTaskID = uuidv4();
    const newTaskDetails = {
      id: newTaskID,
      name: taskName,
      isComplete: false,
      isImportant: true,
    };

    createIncompletedTask(newTaskDetails);
    //save to db
    addToDB(TASK_COLLECTION_NAME, [
      {
        id: newTaskID,
        name: taskName,
        isComplete: false,
        isImportant: false,
      },
    ]);

    document.querySelector(".new-task").value = "";
  });

  // load initaially

  document.querySelector(".new-task").focus();

  const taskList = getDataDB(TASK_COLLECTION_NAME);
  const importantTasks = taskList.filter((task) => task.isImportant != false);
  importantTasks.forEach((task) => {
    if (task.isComplete) {
      createCompleteTask(task);
    } else {
      createIncompletedTask(task);
    }
  });
};

// routing
if (
  location.pathname == "/" ||
  location.pathname == "/index.html" ||
  location.pathname == "/myDay"
) {
  loadInitialScripts();
} else if (location.pathname == "/important") {
  loadImportant();
} else {
  console.log("404 Not found");
}

document.querySelector("#important").addEventListener("click", () => {
  history.pushState("", "", "/important");
  loadImportant();
});

document.querySelector("#myDay").addEventListener("click", () => {
  history.pushState("", "", "/myDay");
  loadInitialScripts();
});
