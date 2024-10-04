/*
Add, Update, and Delete tasks
Mark a task as in progress or done
List all tasks
List all tasks that are done
List all tasks that are not done
List all tasks that are in progress
*/

const fs = require("fs");
const file = "tasks.json";

const args = process.argv;
const filters = ["done", "todo", "in-progress"];

function printfilterTasks(tasks, filter = true) {
  console.log(`id | task | status`);
  tasks.forEach((t) =>
    filter === true || t.status == filter
      ? console.log(`${t.id} | ${t.name} | ${t.status}`)
      : ""
  );
}

if (args.length < 3) {
  console.log(
    "Please provide options, example options -\nlist - List all tasks\nadd x - add task x to list\n update id taskname - update task with id to taskname\n checkout docs for all options "
  );
} else {
  const action = args[2];

  if (action == "list") {
    fs.readFile(file, (err, data) => {
      if (err) return console.error(err);
      let tasks = JSON.parse(data);
      if (args.length == 3) {
        printfilterTasks(tasks);
      } else {
        const filter = args[3];
        if (!filters.includes(filter.toLowerCase()))
          return console.log(
            "Invalid filter argument, options - todo, in-progress, done"
          );

        printfilterTasks(tasks, filter);
      }
    });
  } else if (action == "add") {
    if (args.length == 3) return console.log("Provide task to add");
    const taskName = args[3];

    fs.readFile(file, (err, data) => {
      if (err) return console.error(err);
      const tasks = JSON.parse(data);
      tasks.push({ id: tasks.length + 1, name: taskName, status: "todo" });
      fs.writeFile(file, JSON.stringify(tasks), (err, data) => {
        if (err) return console.error(err);
        console.log(`New task added - ${taskName} with id - ${tasks.length}`);
      });
    });
  } else if (action == "update") {
    if (args.length < 5)
      return console.log("Provide task  id and updated name to update task");
    const id = args[3];
    const newName = args[4];
    fs.readFile(file, (err, data) => {
      if (err) return console.error(err);
      const tasks = JSON.parse(data);
      let doExist = false;
      tasks.forEach((t) => {
        if (t.id == id) {
          t.name = newName;
          doExist = true;
        }
      });
      if (!doExist) console.log("Invalid Id", id);
      else
        fs.writeFile(file, JSON.stringify(tasks), (err, data) => {
          if (err) return console.error(err);
          console.log(`task updated with id - ${id}`);
        });
    });
  } else if (action == "mark") {
    if (args.length < 5)
      return console.log(
        "Provide task  id and updated status to update status"
      );
    const id = args[3];
    const status = args[4];
    if (!filters.includes(status))
      return console.log("Invalid status, options - todo, in-progress, done");
    fs.readFile(file, (err, data) => {
      if (err) return console.error(err);
      const tasks = JSON.parse(data);
      let doExist = false;
      tasks.map((t) => {
        if (t.id == id) {
          t.status = status;
          doExist = true;
        }
      });
      if (!doExist) console.log("Invalid Id", id);
      else
        fs.writeFile(file, JSON.stringify(tasks), (err, data) => {
          if (err) return console.error(err);
          console.log(`task status updated with id - ${id}`);
        });
    });
  } else if (action == "delete") {
    if (args.length == 3) return console.log("Provide task id to delete");
    const id = args[3];
    fs.readFile(file, (err, data) => {
      if (err) return console.error(err);
      const tasks = JSON.parse(data);
      let doExist = false;
      let ind = 1;
      let newTasks = tasks
        .map((t) => {
          if (t.id == id) doExist = true;
          else return { ...t, id: ind++ };
        })
        .filter(Boolean);
      if (!doExist) console.log("Invalid id ", id);
      else
        fs.writeFile(file, JSON.stringify(newTasks), (err, data) => {
          if (err) return console.error(err);
          console.log(
            `id with task`,
            id,
            "deleted. use list command to get latest ids of tasks"
          );
        });
    });
  }
}
