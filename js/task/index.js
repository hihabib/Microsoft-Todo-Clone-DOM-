import { TASK_COLLECTION_NAME } from "../define.js";
import { getDataDB, updateToDB } from "../lib/mangeDB.js";

const toggleBookmarkButton = (id, edit = false) => {
  if (!edit) {
    const idElement = document.querySelector('[data-id="' + id + '"]');
    idElement.parentElement
      .querySelector('[data-role="bookmark"]')
      .addEventListener("click", function () {
        const isAddedToImportant = Array.from(this.classList).includes(
          "bi-star-fill"
        );

        updateToDB(TASK_COLLECTION_NAME, id, {
          isImportant: isAddedToImportant ? false : true,
        });
        this.classList.remove(isAddedToImportant ? "bi-star-fill" : "bi-star");
        this.classList.add(!isAddedToImportant ? "bi-star-fill" : "bi-star");

        if (location.pathname == "/important") {
          this.parentElement.remove();
        }
      });
  } else {
    const idElement = document.querySelector('[data-id="' + id + '"]');
    const isAddedToImportant = Array.from(
      idElement.parentElement.querySelector('[data-role="bookmark"]').classList
    ).includes("bi-star-fill");

    updateToDB(TASK_COLLECTION_NAME, id, {
      isImportant: isAddedToImportant ? false : true,
    });
  }
};

const createCompleteTask = (taskDetails) => {
  const { name: taskName, id: newTaskID, isImportant } = taskDetails;
  //create Task
  const completedTask = document.createElement("div");

  completedTask.innerHTML = html`
    <div class="task-box">
      <div>
        <i class="task-icon bi bi-check-circle-fill"></i>
      </div>
      <del class="task-name" data-id="${newTaskID}">${taskName}</del>
      <i
        data-role="bookmark"
        class="bi ${isImportant ? "bi-star-fill" : "bi-star"}"
      ></i>
    </div>
  `;

  const complatedTaskList = document.querySelector(".completed-task-list");

  completedTask
    .querySelector(".task-icon")
    .addEventListener("click", function () {
      createIncompletedTask(taskDetails);
      this.closest(".task-box").parentElement.remove();
      // save to databse as competed task
      updateToDB(TASK_COLLECTION_NAME, newTaskID, { isComplete: false });
    });

  complatedTaskList.prepend(completedTask);
  toggleBookmarkButton(newTaskID);

  return completedTask.querySelector(".task-box");
};

//move to complated
const moveToComplated = (newTaskID) => {
  const taskIcon = document.querySelector(".task-icon");
  taskIcon.addEventListener("click", function () {
    const incompletedTaskBox = this.closest(".task-box");
    const taskName = incompletedTaskBox.querySelector(".task-name").innerText;
    incompletedTaskBox.remove();
    const allTask = getDataDB(TASK_COLLECTION_NAME);
    const taskDetails = allTask.find((task) => task.id === newTaskID);
    console.log("test");
    createCompleteTask(taskDetails);
    // save to databse as competed task
    updateToDB(TASK_COLLECTION_NAME, newTaskID, { isComplete: true });

    const audio = new Audio("../media/complete.wav");
    audio.play();
  });
};

const createIncompletedTask = ({
  name: taskName,
  id: newTaskID,
  isImportant,
}) => {
  //create new task
  const newTask = document.createElement("div");
  newTask.classList.add("task-box");
  newTask.innerHTML = html`
    <div>
      <i class="task-icon bi bi-circle"></i>
    </div>
    <div data-id="${newTaskID}" class="task-name">${taskName}</div>
    <i
      data-role="bookmark"
      class="bi ${isImportant ? "bi-star-fill" : "bi-star"}"
    ></i>
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
  toggleBookmarkButton(newTaskID);
  return newTask; // taskBox
};

export {
  createCompleteTask,
  moveToComplated,
  createIncompletedTask,
  toggleBookmarkButton,
};
