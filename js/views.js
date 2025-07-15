/* Used to manage visibility of page sections using CSS via js */

/* Display just the Add Task Form */
function viewAdd(){
	document.getElementById("addTask").style.display = "block";
	document.getElementById("taskList").style.display = "none";
	document.getElementById("updateTask").style.display = "none";	
} 

/* Display just the Task List Table */
function viewTasks(){
	document.getElementById("addTask").style.display = "none";
	document.getElementById("taskList").style.display = "block";
	document.getElementById("updateTask").style.display = "none";
}

/* Display just the Update Task Form */
function viewUpdate(){
	document.getElementById('addTask').style.display='none';
	document.getElementById('taskList').style.display='none';
	document.getElementById('updateTask').style.display='block';
}
