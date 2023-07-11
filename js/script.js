import insertAfter from "./lib/insertAfter.js";
import { addToDB, getDataDB, updateToDB } from "./lib/mangeDB.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const TASK_COLLECTION_NAME = "tasks";

//TODO: createCompleteTask so that after page refresh the completed task show inside accordion

const html = String.raw;

//move to complated
const moveToComplated = (newTaskID) => {
  const taskIcon = document.querySelector(".task-icon");
  taskIcon.addEventListener("click", function () {
    const incompletedTaskBox = this.closest(".task-box");
    const cloneOfInCompletedTaskBox =
      '<div class="task-box">' + incompletedTaskBox.innerHTML + "</div>";

    incompletedTaskBox.remove();

    //create Task

    const completedTask = document.createElement("div");
    completedTask.innerHTML = cloneOfInCompletedTaskBox;
    const complatedTaskList = document.querySelector(".completed-task-list");

    //change icon
    const icon = completedTask.querySelector(".task-icon");
    icon.classList.remove("bi-circle");
    icon.classList.remove("bi-check-circle");
    icon.classList.add("bi-check-circle-fill");

    //change inner text to del
    const taskName = completedTask.querySelector(".task-name").innerText;
    const del = document.createElement("del");

    del.innerText = taskName;
    insertAfter(completedTask.querySelector(".task-name"), del);

    completedTask.querySelector(".task-name").remove();

    complatedTaskList.prepend(completedTask);

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
    console.log("Completed task found");
  } else {
    createIncompletedTask(task.name);
  }
});
