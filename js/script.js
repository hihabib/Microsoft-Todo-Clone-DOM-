import insertAfter from "./lib/insertAfter.js";
import { addToDB, getDataDB, updateToDB } from "./lib/mangeDB.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const TASK_COLLECTION_NAME = "tasks";

//TODO: createCompleteTask so that after page refresh the completed task show inside accordion

const html = String.raw;

const createCompleteTask = (taskName) => {
  //create Task
  const completedTask = document.createElement("div");

  completedTask.innerHTML = html`
    <div class="task-box">
      <div>
        <i class="task-icon bi bi-check-circle-fill"></i>
      </div>
      <del>${taskName}</del>
    </div>
  `;
  const complatedTaskList = document.querySelector(".completed-task-list");

  complatedTaskList.prepend(completedTask);
};
//move to complated
const moveToComplated = (newTaskID) => {
  const taskIcon = document.querySelector(".task-icon");
  taskIcon.addEventListener("click", function () {
    const incompletedTaskBox = this.closest(".task-box");
    const taskName = incompletedTaskBox.querySelector(".task-name").innerText;
    incompletedTaskBox.remove();
    createCompleteTask(taskName);
    // save to databse as competed task
    updateToDB(TASK_COLLECTION_NAME, newTaskID, { isComplete: true });
  });
};

const createIncompletedTask = (taskName, newTaskID) => {
  //create new task
  const newTask = document.createElement("div");
  newTask.classList.add("task-box");
  newTask.innerHTML = html`
    <div>
      <i class="task-icon bi bi-circle"></i>
    </div>
    <div data-id="${newTaskID}" class="task-name">${taskName}</div>
  `;

  const taskList = document.querySelector(".task-list");
  taskList.prepend(newTask);
  document
    .querySelector(".task-icon")
    .addEventListener("mouseover", function () {
      this.classList.remove("bi-circle");
      this.classList.add("bi-check-circle");
    });

  document
    .querySelector(".task-icon")
    .addEventListener("mouseleave", function () {
      this.classList.add("bi-circle");
      this.classList.remove("bi-check-circle");
    });

  console.log(newTaskID);

  moveToComplated(newTaskID);
};

const form = document.querySelector("#create-new-task");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = document.querySelector(".new-task").value;

  const newTaskID = uuidv4();

  createIncompletedTask(taskName, newTaskID);
  //save to db
  addToDB(TASK_COLLECTION_NAME, [
    {
      id: newTaskID,
      name: taskName,
      isComplete: false,
    },
  ]);

  document.querySelector(".new-task").value = "";
});

// load initaially

document.querySelector(".new-task").focus();

const taskList = getDataDB(TASK_COLLECTION_NAME);
taskList.forEach((task) => {
  if (task.isComplete) {
    createCompleteTask(task.name);
  } else {
    createIncompletedTask(task.name, task.id);
  }
});
