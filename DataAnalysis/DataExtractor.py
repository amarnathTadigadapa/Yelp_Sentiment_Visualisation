
from subprocess import check_output
import os
from GeneralJsonClassFile import JsonClass
from io import StringIO
import json

class DataExtractor:

    def __init__(self, dir):
        self.jsonFileDict = {}
        self.dir = dir
    def FileList(self, ext='.json'):

        cmd = 'ls', os.path.join(self.dir)

        filenames = check_output(cmd).decode('utf-8')
        filenames = filenames.split('\n')[:-1]

        #Filter files based on extension
        requiredFiles = [fi for fi in filenames if fi.endswith(ext)]
        return requiredFiles


    def ParseFile(self, file):

        objectList = []

        with open(os.path.join(self.dir, file), 'r') as f:
            while True:
                line = f.readline()

                if not line:
                    break
                #Create object of GeneralJsonClassFile

                data = json.load(StringIO(line))

                jsonObj = JsonClass()
                jsonObj.parse(data)

                objectList.append(jsonObj)

        return objectList


        pass

    def parse(self, fileList):

        for file in fileList:
            key = file.split('.')[0]
            self.jsonFileDict[key] = self.ParseFile(file)

        d = 10

        return self.jsonFileDict

        pass