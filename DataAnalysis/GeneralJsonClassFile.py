class JsonClass:

    def __init__(self):

        pass

    def parse(self, jsondata):
        for key in jsondata.keys():

            #set dynamic attributes
            try:
                self.__setattr__(key, jsondata[key])
            except:
                print(str(key + " Not found"))

    def display(self):

        print(self.keys())
