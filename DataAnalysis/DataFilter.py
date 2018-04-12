class DataFilter:
    def __init__(self):
         pass


    def merge_dicts(self, obj1, obj2):
        return {**obj1, **obj2}

    def JoinByAttribute(self, object1, object2, attrname):

        filteredDataDict = {}

        for obj1 in object1:

            r_list = []

            for obj2 in object2:

            #     if getattr(obj1,attrname) == getattr(obj2,attrname):
            #         data = self.merge_dicts(obj1.__dict__, obj2.__dict__)
            #         filtereddata.append(data)
            #
            # if len(filtereddata) != 0:
            #     filteredDataDict[attrname] = filtereddata

                if getattr(obj1,attrname) == getattr(obj2,attrname):
                    r_list.append(obj2.__dict__)

            if len(r_list) != 0:
                filteredDataDict[attrname] = self.merge_dicts(obj1.__dict__, {'reviews': r_list})

        return filteredDataDict