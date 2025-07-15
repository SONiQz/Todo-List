window.onload=function(){
	var formData = document.getElementById("taskForm");
	const db = new PouchDB("taskManager");
	
	db.info()
		.then((info) => {
			console.log(info);
	})

	saveTask = function() {
		var a = {}
		a._id = new Date().getTime() + '';
  		a.title = formData.tasktitle.value;
		a.desc  = formData.description.value;
		a.date  = formData.date.value;
		a.time  = formData.time.value;
		a.priority = formData.priority.value;
		a.status = formData.status.value;
		
		_id: a._id;
		title: a.title;
		desc: a.desc;
		date: a.date;
		time: a.time;
		priority: a.priority;
		status: a.status;
		console.log(a)
		
		db.put(a, function(error, response) {
			if (error){
				console.log(error);
				return;
			} else {
			
				if(response && response.ok) {
				}
			}
		})
	}
	
}
	search = function(searchtitle) {
	var that = this;

	var map = function(doc) {
		var searchtitle, searchvalue;
		searchtitle = document.getElementById("searchtitle").value.replace(/[$-\/?[-^{|}]/g, '\\$&');
		searchvalue = new RegExp(searchtitle,'i');
		
		if(regex.test(doc.title) || regex.test(doc.description)){		
			emit(doc._id, {title: doc.title, date: doc.date, priority: doc.priority, status: doc.status, id: doc._id, modified: doc.modified});
		}
	}
	
  	this.db.query(map, function(err, response) { 
  		if(err){ console.log(err); }
  		if(response){
	 		var df, rows, nl, results;
	 		
	 		results = response.rows.map(function(r){
  				r.doc = r.value;
  				delete r.value;
  				return r;
  			});
  			nl = that.getElementsByTagName("tbody")[0];
  			df = document.createDocumentFragment(), 
  			rows = results.map(that.addrow, that);
  			rows.map(function(f){
        		if (f) {
            		df.appendChild(f); 
            	} 
        	});
        	nl.innerHTML = '';
        	nl.appendChild(df);
  		}
  	});
}
