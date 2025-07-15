function saveTaskData(){
    /* define relationship between form fields and task array */
	var title = $('#title').val();
	var description = $('#description').val();
	var date = $('#date').val();
	var time = $('#time').val();
	var priority = $('#priority').val();
	var status = $('#status').val();
	var image = $('#image').val();
    
	var task = {
		'title':title,
		'description':description,
		'date':date,
		'time':time,
		'priority':priority,
		'status':status,
		'image':image
	};

	/* handle image so it can be stored */
	var fileInput = $('#image');
	var selectedFile = fileInput.get(0).files[0];
	
	if (typeof selectedFile != 'undefined')
		task.image = selectedFile;

    /* Write task to Object Store */
	insertOne(task, function(lastID) {
		event.preventDefault();
		/* stop page refreshing */
		return false;
	});
	/* empty form */
	$('#addForm')[0].reset();
}

$('#addForm').submit(function(event){
    /* this stopped events being actioned more than once */
    event.preventDefault();
	startDB(function () {
		saveTaskData();
	});
	/* Message to User and allows write to Object Store to complete */
	alert("Item has been saved successfully!");
	viewTasks(); 
	location.reload();
});

/* Global Var for handling images between functions */
var currImage;

function viewUpdateTask(id){
	var updtask;
	startDB(function() {
		/* Select object by ID from Objecct Store */
		selectOne(id, function(result) {
			$('#updid').val(id);
			$('#updtitle').val(result.title);
			$('#upddescription').val(result.description);
			$('#upddate').val(result.date);
			$('#updtime').val(result.time);
			$('#updpriority').val(result.priority);
			$('#updstatus').val(result.status);
			updtask = result;

			/* display placeholder image if no image found */
			if (!updtask.image){
				var image_url = "img/henohere.png"
			} else {
				var image_url = window.URL.createObjectURL(updtask.image);
			}

			/* define image to be used in saveUpdTask */
			currImage = updtask.image;
			
			$('#viewImage').append(
			'<td colspan = "2" align="center"><a href="'+ image_url +'"><img src="'+ image_url +'"></a></td>');
		})
		viewUpdate();
	})
}

function saveUpdateTask(updtask, id){
	/* define relationship between form fields and task array variables */
	var id = +$('#updid').val()
	var title = $('#updtitle').val();
	var description = $('#upddescription').val();
	var date = $('#upddate').val();
	var time = $('#updtime').val();
	var priority = $('#updpriority').val();
	var status = $('#updstatus').val();
	var image = $('#updimage').val();

	/* array to be stored */
	var task = {
		'title':title,
		'description':description,
		'date':date,
		'time':time,
		'priority':priority,
		'status':status,
		'image':image
	};

	/* define and handle new image */
	var fileInput = $('#updimage');
	var selectedFile = fileInput.get(0).files[0];

	/* if no image defined above use existing */
	if (selectedFile != 'undefined'){
		task.image = selectedFile;
	} else {
		task.image = currImage;
	}

	/* define object to write to Object Store, setting the id so the correct record is updated */
	var objectStore = db.transaction(['tasks'], "readwrite").objectStore('tasks');
	objectStore.openCursor(+id).onsuccess = function(event){
		var cursor = event.target.result;
		if (cursor && cursor.key == id){
			cursor.update(Object.assign(cursor.value, task));
			cursor.continue();			
		};
	}
}

$('#updateForm').submit(function(event){
    /* this stopped events being actioned more than once */
    event.preventDefault();
	startDB(function () {
		saveUpdateTask();
	});
	/* Nice User Message and a delay to ensure action completes */
	alert("Item has been saved successfully!");
	viewTasks(); 
	location.reload();
});

function showAllTasks() {
	selectAll(function(results) {
		var len = results.length, i;
		for(i = 0; i < len; i++) {
		    /* if no image is defined, use placeholder, else load the stored image */
			if (!results[i].image){
				var image_url = "img/henohere.png"
			} else {
				var image_url = window.URL.createObjectURL(results[i].image);
			}
			/* define id, so I don't need to call results[i].id all the time */
			var id = results[i].id;
			var image_id = "image-" + id;
			/* generate table row based on the results */
			$('#tableAllTasks').append(
				'	<tr style="text-align: center;">\
						<td class="id" style="display:none">'+ id + '</td>\
						<td><input type="checkbox"></td>\
						<td class="title">' + results[i].title + '</td>\
						<td class="description" style="display: none">' + results[i].description + '</td>\
						<td class="date">' + results[i].date + '</td>\
						<td class="time">' + results[i].time + '</td>\
						<td class="priority">' + results[i].priority + '</td>\
						<td class="status">' + results[i].status + '</td>\
						<td class="image">' + '<img id=' + image_id + ' src="' + image_url + '" height="50px" width="50px"/></td>\
					    <td><input type="button" value="View" onclick="viewUpdateTask('+ id +')"></td>\
					</tr>'
					/* the last td inserts the button to view/update the task */
			)
			
		}
	});
}

function taskDelete(id){
	var checkBoxes = $('input[type=checkbox]')
	var numrow = $('input[type=checkbox]').length;
	
	for(i = 0; i < numrow; i += 1) {
	    /* check if the checks in the checkboxes are checked */
		if (checkBoxes[i].checked){
			var row = checkBoxes[i].parentNode.parentNode;
			/* read id value from table (first column) */
			id = (row.cells[0].innerHTML);
			/* prompt if you want to delete the task - giving the ID */
			response = confirm("Are you sure you want to delete the Selected Task(s) Id:"+ id +"?")
			if (response == true){
			/* if OK selected delete the ID */
				deleteOne(+id);
				alert("Task(s) Now Deleted")
			} else {
				alert("Task(s) Not Deleted")
			};
		}
	};
}

function taskSorting(n) {
	var table, rows, swapping, i, x, y, swapMe, dir, numberSwaps = 0;
	table = document.getElementById("tableAllTasks");
	/* set swap to true to trigger while loop */
	swapping = true;
    /* define direction variable and set to ascending */
	dir = "asc";

	while (swapping) {
	    /* once running reset swapping to false, so it will stop once the below for-loop completes */
    	swapping = false;
    	rows = table.rows;
    	for (i = 1; i < (rows.length - 1); i++) {
      	    /* define and set default swap behaviour to false */
      		swapMe = false;
      		/* identify current row in table */
      		x = rows[i].getElementsByTagName("td")[n];
      		/* identify following row in table */
      		y = rows[i + 1].getElementsByTagName("td")[n];
      		if (dir == "asc") {
      		    /* if current row greater than following row, set them to swap */
        		if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          		swapMe = true;
          		break;
        	    }
		    } else if (dir == "desc") {
        	    /* if current row less than following row, set them to swap */
        	    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          		    swapMe = true;
          	    	break;
        	}
      	}
	}
    if (swapMe) {
    	/* if swapMe was set to True, complete the swap and att  */
    	rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
    	swapping = true;
     	numberSwaps ++;
    	} else {
      	/* if there are no Swaps and direction is ascending, swap to direction and repeat the loop */
      		if (numberSwaps == 0 && dir == "asc") {
        dir = "desc";
        swapping = true;
      }
    }
  }
}

setDatabaseName('taskManager', ['tasks']);
setCurrObjectStoreName('tasks');
startDB(function () {
	showAllTasks();
});

