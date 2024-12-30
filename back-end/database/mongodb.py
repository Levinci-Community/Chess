from pymongo import MongoClient

MONGO_URI = 'mongodb:27017'
MONGO_URI_ATLAS = 'mongodb://admin:admin@ac-sbfny3p-shard-00-00.dqwy5sj.mongodb.net:27017,ac-sbfny3p-shard-00-01.dqwy5sj.mongodb.net:27017,ac-sbfny3p-shard-00-02.dqwy5sj.mongodb.net:27017/?ssl=true&replicaSet=atlas-uqyu3b-shard-0&authSource=admin&retryWrites=true&w=majority&appName=DB'
MONGO_DB_NAME = 'chess'

def get_mongo():
    return MongoClient(MONGO_URI)

def get_db():
    client = MongoClient(MONGO_URI)
    return client[MONGO_DB_NAME]
