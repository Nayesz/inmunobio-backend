import os

SECRET_KEY = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
PWD = os.path.abspath(os.curdir)

DEBUG = True
MONGODB_DB = 'db_mongo_inmunobio'
MONGODB_HOST = 'mongo'
#cambiar a mongo
MONGODB_PORT = 27017
SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_DATABASE_URI = 'mysql://root:secret@mysql:33060/db_mysql_inmunobio'
#cambiar a mysql:33060
UPLOAD_FOLDER = PWD + '/uploads/'

