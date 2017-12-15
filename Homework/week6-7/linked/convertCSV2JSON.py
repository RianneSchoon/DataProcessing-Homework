import csv
import json

# https://stackoverflow.com/questions/19697846/python-csv-to-json
csvfile = open('murders.csv', 'r')
jsonfile = open('murderdata.json', 'w')

fieldnames = ("country", "murders", "linked")
reader = csv.DictReader(csvfile, fieldnames, quoting=csv.QUOTE_NONE)
jsonfile.write('{')
for row in reader:
	jsonfile.write('"' + row["country"] + '"' + " : " + '"' + row["murders"] + '"' + " , ")
	# jsonfile.write(',')
jsonfile.write('}')