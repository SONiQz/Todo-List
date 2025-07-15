function viewtasklist() {
	var addTask = document.getElementById("addTask");
	var allTasks = document.getElementById("allTasks");
	addTask.style.display = "none";
	allTasks.style.display = "block";
	}

function addnewtask() {
	var addTask = document.getElementById("addTask");
	var allTasks = document.getElementById("allTasks");
	allTasks.style.display = "none";
	addTask.style.display = "block";
}

function viewtasksbyname() {
	var byDate = document.getElementById("searchTasksByDate");
	var byName = document.getElementById("searchTasksByName");
	byName.style.display = "block";
	byDate.style.display = "none";
	}

function viewtasksbydate() {
	var byDate = document.getElementById("searchTasksByDate");
	var byName = document.getElementById("searchTasksByName");
	byName.style.display = "none";
	byDate.style.display = "block";
}

