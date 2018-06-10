# Kuvera-task Backend

Made in **Node** using **Express** and **NeDB**, a lightweight database.

 Fetch the data for various mutual fund houses using the following links
 
[Axis Mutual Fund](http://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?mf=53&tp=1&frmdt=01-Apr-2015&todt=01-Jun-2018)
[HSBC Mutual Fund](http://portal.amfiindia.com/DownloadNAVHistoryReport_Po.aspx?mf=37&tp=1&frmdt=01-Apr-2015&todt=01-Jun-2018)

Save the results of these two links in a file named as `axis.txt` and `hsbc.txt` in the root repository folder

Make sure you have Python 3.x installed and then run

    python cleanup.py
 
 This will cleanup the data from the above links and make a structured csv file.


Run this step to install the dependencies.

    npm install

Now to populate our database instance, run the following

    node populate_db.js

This will populate the NeDB database with the data from the mutual fund houses using the csv file generated by the python script.

Finally to run the express server, run the following

    node index.js