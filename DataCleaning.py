#!/usr/bin/env python
# coding: utf-8

# In[12]:


import json
import csv
headers = True
review_file = './data/yelp-dataset/data_CSV/yelp_academic_dataset_review.json'
review_output='./data/yelp-dataset/data_CSV/review.csv'




with open(review_file,encoding="utf-8" ) as jsonf, open(review_output,"w",encoding="utf-8") as csvf:
    for line in jsonf:
        data = json.loads(line)
        if headers:
            keys =[]
            for k,v in data.items():
                keys.append(k)
                writer = csv.DictWriter(csvf,fieldnames=keys,lineterminator = '\n')
            writer.writeheader()
            headers=False
        else:        
            writer.writerow(data)
                
        



business_df = pd.read_csv('./data/yelp-dataset/data_CSV/business.csv')
#business_df=business_df.apply(lambda x: x.astype(str).str.lower())
business_df=business_df.dropna(how='any')
business_df=business_df[business_df['categories'].str.contains("Restaurants")]
business_df=business_df[~business_df['city'].str.contains("Toronto")]
 
business_df=business_df[:75000]
#business_df.to_csv('./data/yelp-dataset/data_CSV/Restaurant_business.csv')


# In[ ]:


list=business_df['business_id']
newList = []
for value in list:
    newList.append(value)

#print(newList)    
review_df = pd.read_csv('./data/yelp-dataset/data_CSV/review.csv')
review_df=business_df.dropna(how='any')

#print(list)
review_df= review_df[review_df['business_id'].isin(newList)]
review_df.head()
review_df.to_csv('./data/yelp-dataset/data_CSV/review_compressed.csv')


# In[11]:


business_df = pd.read_csv('./data/yelp-dataset/data_CSV/user.csv')
business_df=business_df[:95000]
business_df.to_csv('./data/yelp-dataset/data_CSV/user_compressed.csv')


# 
# 
