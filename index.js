const crud = require("./tests/crud");
const actions = ["add", "update", "delete", "mark", "list"];
const status = ["done", "todo", "in-progress"];

async function main() {
  const argv = process.argv;
  if (argv.length < 3) {
    console.log("Please provide an option, example - `add Exercise`");
    return;
  }
  const action = argv[2];
  if (!actions.includes(action.toLowerCase()))
    return console.log(
      "Invalid option. Choose from - add, delete, update, mark, list"
    );

  if (action == "list") {
    await handleListAction(argv);
  } else if (action == "add") {
    await handleAddAction(argv);
  } else if (action == "delete") {
    await handleDeleteAction(argv);
  } else if (action == "mark") {
    await handleMarkAction(argv);
  } else if (action == "update") {
    await handleUpdateAction(argv);
  }
}

async function handleListAction(argv) {
  const len = argv.length;
  if (len == 3) {
    const tasks = await crud.getTasks();
    if (tasks.length) crud.printfilterTasks(tasks);
    else console.log("Empty tasklist. Use add to add new task");
    return;
  }

  const statusFilter = argv[3];
  if (!status.includes(statusFilter.toLowerCase()))
    return console.log(
      "Provide valid filter for list. Available - done,todo,in-progress"
    );
  const tasks = await crud.getTasks();
  crud.printfilterTasks(tasks, statusFilter);
}

async function handleAddAction(argv) {
  const len = argv.length;
  if (len == 3) {
    return console.log("Please provide task to add");
  }

  const description = argv[3];
  await crud.addTask(description);
}

async function handleDeleteAction(argv) {
  const len = argv.length;
  if (len == 3) {
    return console.log("Please provide task id to delete");
  }

  const taskId = argv[3];
  await crud.deleteTask(taskId);
}

async function handleMarkAction(argv) {
  const len = argv.length;
  if (len < 5) {
    console.log("Please provide task id and status to mark task");
    return;
  }

  const taskId = argv[3];
  const newStatus = argv[4];
  if (!Number.isInteger(+taskId) || !status.includes(newStatus.toLowerCase())) {
    return console.log("Provide valid taskId and status to mark");
  }

  await crud.markTask(taskId, newStatus);
}
async function handleUpdateAction(argv) {
  const len = argv.length;
  if (len < 5) {
    console.log("Please provide task id and new description to update task");
    return;
  }

  const taskId = argv[3];
  const newDescription = argv[4];
  if (!Number.isInteger(+taskId) || newDescription.length == 0) {
    return console.log("Provide valid taskId and newDescription to update");
  }

  await crud.updateTask(taskId, newDescription);
}

main();
