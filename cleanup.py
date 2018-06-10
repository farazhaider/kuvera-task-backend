import csv

outF = open("mf_data.csv", "w")
mutualFundString = "Mutual Fund"
currentFund = "";

files = ['axis.txt','hsbc.txt']

for file in files:
    with open(file, 'r') as inFile:
        row = inFile.readline()
        while row:
            if(mutualFundString in row):
                currentFund = row
            if(row[0] >= '0' and row[0] <='9'):
                outF.write(currentFund[0:-1] + ";" + row)
                
            row = inFile.readline()
        inFile.close()

outF.close()
