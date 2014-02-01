function pull() {

// set spreadsheet  
 var ss = SpreadsheetApp.getActiveSpreadsheet();
 var sheet = ss.getSheetByName("THE NAME OF YOUR SHEET GOES HERE"); 

// select TASKS app task list by title  
  var title = "THE NAME OF YOUR TASK LIST GOES HERE";
  var allLists = Tasks.Tasklists.list().getItems();
  var id;
  for (var i in allLists) {
    if (title == allLists[i].getTitle()) {
      id = allLists[i].getId();
    }
  }
  if (!id) {
    Logger.log("Tasklist not found"); 
  } else {
    Logger.log("Tasklist found");
  }


// pull tasks from TASKS app
var list = Tasks.Tasks.list(id);  
var tasks = list.getItems();
  
  // create array of all tasks with desired elements
 var taskarray = [];
  for (i = 0; i < tasks.length; i++) {
      line = [];
      line.push(tasks[i].getTitle());
      line.push(tasks[i].getStatus());
      dd = tasks[i].getDue();
        // if task has a duedate, strip time data from date and remove timezone change effects - 
        // google tasks doesn't support due times, due date is at midnight utc
           if (dd != null)
          {
			due = new Date(dd);
            due.setHours(0);
            due.setMinutes(0);
            var dueday = due.getDate();
            due.setDate(dueday +1);
             line.push(due);
		// if task has no duedate, pass an empty string into the duedate column
          }
        else
          {
            line.push("");
          }
		// get timestamp of task completion, separate time and date, send to separate fields
      fulldate = (new Date(tasks[i].getCompleted()));
      date = fulldate.getDate();
      month = fulldate.getMonth()+1;
      year = fulldate.getFullYear();
      hours = fulldate.getHours();
      minutes = fulldate.getMinutes();
      
      line.push(year + "-" +month+"-"+date);
      line.push(hours + ":" + minutes);
      var notes = tasks[i].getNotes();
         if (notes != null)
         {
           line.push(notes);
         }
         else
         {
           line.push("");
         }
    // early or late?  
    //take completed date and strip time information
    if (dd != null)
    {
      due = new Date(dd);
      due.setHours(0);
      due.setMinutes(0);
      comp =  new Date(fulldate);
      comp.setHours(0);
      comp.setMinutes(0);
      // do the math, comparing due date to date of completion 
      //    (returns a negative for days early, positive for days late)
      oneDay = 24*60*60*1000;
      late = Math.round((comp.getTime() - due.getTime())/(oneDay));
      line.push(late-1)
    }
    else
    {
      line.push("")
    }
      
   
   taskarray.push(line);  
  }
  
  
// parse task list for completed tasks
  var done = taskarray.filter(function(value,index){
    return value[1]=="completed"; });
  for (i = 0; i < done.length; i++);
 
  // log completed tasks and notes to spreadsheet - make sure range 
  // (from A:F here) is equal to number of elements in taskarray 
  // (and therefore of done, which is a subset of taskarray)
 var lr = sheet.getLastRow();
   if (i>0) {
  sheet.getRange("A"+(lr+1)+":G"+(lr+i)).setValues(done);
   }
  
// clear completed tasks from TASKS app  
Tasks.Tasks.clear(id); 
  
// loop through completed tasks and return them back to TASKS
for (var i=0;i<done.length;i++)
  {
// check  task notes for repeat interval tags    
   var comment = (done[i][5]);
    if(comment.indexOf("<!-- weekly -->")>=0)
    {
       duedate = (new Date());
       duedate.setHours(0,0,0,0);
       duedate.setDate(duedate.getDate()+7);
       duedate = (new Date(duedate).toISOString()); 
       newTask = Tasks.newTask()
       .setTitle(done[i])
       .setDue(duedate)
       .setNotes("<!-- weekly -->");
      var inserted = Tasks.Tasks.insert(newTask, id)
      }
    
    
    else if (comment.indexOf("<!-- monthly -->")>=0)
    {    
		var today = new Date();
		var currentyear = today.getFullYear();
		var currentmonth = today.getMonth();
		var currentdate = today.getDate();
			if (currentdate>28)
				{
				var duedate = new Date(currentyear, currentmonth +2, 0, 0);
				}
			else 
				{
				var duedate = new Date(currentyear, currentmonth +1, currentdate, 0);
				}
		var duedatestring = (new Date(duedate).toISOString()); 
		newTask = Tasks.newTask()
		.setTitle(done[i])
		.setDue(duedatestring)
		.setNotes("<!-- monthly -->");
		var inserted = Tasks.Tasks.insert(newTask, id)
    }
    
    
    else if (comment.search(/<!-- every \d+? days? -->/)>=0)
    {
		var repeatnum = comment.match(/<!-- every \d+? days? -->/); 
		var num = parseFloat(repeatnum[0].match(/\d+/));
		duedate = (new Date());
        duedate.setHours(0,0,0,0);
		duedate.setDate(duedate.getDate()+num);
		duedate = (new Date(duedate).toISOString()); 
		newTask = Tasks.newTask()
		.setTitle(done[i])
		.setDue(duedate)
		.setNotes("<!-- every " + num + " days -->");
		var inserted = Tasks.Tasks.insert(newTask, id)
    }
    
    else if (comment.search(/<!-- repeats -->/)>=0)
    {
       newTask = Tasks.newTask()
           .setTitle(done[i])
           .setNotes("<!-- repeats -->");
           var inserted = Tasks.Tasks.insert(newTask, id);
    }
  }
}
