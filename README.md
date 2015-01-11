# log and repeat google tasks

This script does two wonderful things with Google tasks: it lets you set recurring or repeating tasks; and it keeps a detailed log of all tasks you have completed.

This is set up to run out of a Google spreadsheet. (Without too much trouble, it could be adjusted to work as a standalone web application, but for now, host it in a spreadsheet.) Set up to run on a timed interval, it will poll a specific task list in Google tasks. Any time a task has been completed (but not cleared), the script will log that task to a spreadsheet in your Google Drive account (and then clear them from the Task list).

I've set up an example sheet <a href="https://docs.google.com/a/caligopress.com/spreadsheet/ccc?key=0AsEQKh2UPI-YdGVMbHFDVzRvdG5YVEhHX2JZY0Y3cGc&usp=drive_web#gid=3" target="_blank">here</a> that includes a handy pivot table.

The spreadsheet will record several details of each completed task:

1. title
2. date due
3. date completed
4. time of day completed
5. notes
6. par / on time -- this subtracts the date due from the date completed. If a task has a due date, it'll let you know how early or late you completed it. 0 for on time, 1 for one day late, -1 for one day early. These sentences are bull$#!t, but I find it to be really handy to keep track of whether I am falling behind or keeping on top of my to-do lists. I keep it as a running total, and the pivot table actually tallies the par total and keeps an average--so if you are early on one task, but late on another, they balance out and get you back to a zero.

This script also allows you to have recurring tasks. That's right. You can repeat tasks at different intervals; daily; weekly; every X days; monthly; or a simple 'repeats' that resurrects the task without a due date.

This is handled by placing a comment in the 'notes' field of your task (in Google Tasks, of course). Syntax is important, but simple. 

enclose in html comment brackets the desired repeat interval:     
> 	<!-- repeats -->     
	<!-- every X day(s) -->     
	<!-- weekly -->     
	<!-- monthly -->     

The script will record the details of the completed task, clear out the Google Task list, and repopulate it with any repeating tasks. The 'Notes' field of a recurring task will have that same comment so that the repeat interval perpetuates. Other notes will be logged to the spreadsheet, but not returned to the task list. You could, for instance, place a confirmation number for a monthly bill payment into the notes field in order to log it. If you take a weekly run, you could log the distance. 

As of now, the due date is calculated from the *completed* date, rather than the due date. This could be altered relatively easily. 

