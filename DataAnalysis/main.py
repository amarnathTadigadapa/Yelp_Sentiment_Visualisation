from DataExtractor import DataExtractor
from Geolocation import Location
from DataFilter import DataFilter

import json

dataExObj = DataExtractor(dir='./dataset')
allFiles = dataExObj.FileList(ext='.json')

jsonFileDict = dataExObj.parse(allFiles)


#Data Filtering

#Step 1. Join reviews and business by business id's
datafilter = DataFilter()
data = datafilter.JoinByAttribute(jsonFileDict['business'], jsonFileDict['review'], 'business_id')


#Step 2: Get the location.

loc = Location()

for key, value in data.items():
    latitude = data[key]['latitude']
    longitude = data[key]['longitude']
    location = loc.GetLocation(latitude, longitude)
    data[key] = datafilter.merge_dicts(data[key], {'location':location})
    print(data[key]['location'])

#TODO Step 3
#Step 3: Filter out location outside United States.



#Step 4: Dump to json file
with open('result.json', 'w') as fp:
    json.dump(data, fp)

c = 20