const fs = require("node:fs/promises");
const fileName = "tasks.json";
const filters = ["done", "todo", "in-progress"];

async function getTasks(status = "All") {
  if (status !== "All" && !filters.includes(status.toLowerCase())) {
    return console.log("Invalid option");
  }
  try {
    let tasks = await fs.readFile(fileName);
    tasks = JSON.parse(tasks);
    if (status == "All") return tasks;
    return tasks.filter((t) => t.status === status.toLowerCase());
  } catch (err) {
    console.error(err);
  }
}

async function addTask(description) {
  try {
    // todo
    let tasks = await getTasks();
    const id = tasks.length + 1;
    tasks.push({
      id,
      description,
      createdAt: new Date().toTimeString(),
      status: "todo",
    });
    await fs.writeFile(fileName, JSON.stringify(tasks));
    console.log("new task added with id ", id);
  } catch (error) {
    console.error(error);
  }
}

async function deleteTask(taskId) {
  // todo
  try {
    const tasks = await getTasks();
    const ind = getInd(tasks, taskId);
    if (ind == -1) return console.error("Invalid id");
    const deletedTask = tasks.splice(ind, 1);
    for (let i = ind; i < tasks.length; i++) {
      tasks[i].id = i + 1;
    }
    await fs.writeFile(fileName, JSON.stringify(tasks));
    console.log(
      "deleted task with id ",
      taskId,
      deletedTask[0].description,
      "\nPrevious tasks may have new ids!"
    );
  } catch (err) {
    console.error(err);
  }
}

async function updateTask(taskId, taskName) {
  try {
    const tasks = await getTasks();
    const ind = getInd(tasks, taskId);
    if (ind == -1) console.log("Invalid id", taskId);
    else {
      tasks[ind].description = taskName;
      tasks[ind].updatedAt = new Date().toTimeString();
      await fs.writeFile(fileName, JSON.stringify(tasks));
      console.log("task updated with id", taskId);
    }
  } catch (err) {
    console.error(err);
  }
}

async function markTask(taskId, status) {
  // todo

  try {
    const tasks = await getTasks();
    const ind = getInd(tasks, taskId);
    if (ind == -1) console.log("Invalid id", taskId);
    else {
      tasks[ind].status = status;
      await fs.writeFile(fileName, JSON.stringify(tasks));
      console.log("task status change with id", taskId);
    }
  } catch (err) {
    console.error(err);
  }
}

function printfilterTasks(tasks, filter = "ALL") {
  console.log(`id | task | status | createdAt | updatedAt`);
  tasks.forEach((t) =>
    filter === "ALL" || t.status == filter
      ? console.log(
          `${t.id} | ${t.description} | ${t.status} | ${t.createdAt} | ${
            t.updatedAt || "-"
          }`
        )
      : ""
  );
}

function getInd(tasks = [], id) {
  return tasks.findIndex((t) => t.id == id);
}

module.exports = {
  getTasks,
  printfilterTasks,
  markTask,
  deleteTask,
  addTask,
  updateTask,
};
