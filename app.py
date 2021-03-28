from flask import Flask
import config
from flask_migrate import Migrate
from flask_jwt import JWT
from db import db, dbMongo
from api import api
from security import authenticate, identity


app= Flask(__name__)
app.config.from_object(config)

############################db configuracion
db.init_app(app)
with app.app_context():
    db.create_all()
	
dbMongo.init_app(app)

Migrate(app,db,compare_type=True)

############################ Api configuracion
api.init_app(app)

############################


@app.route("/")
def Prueba():
	from models.usuario import Usuario, Permiso
	u = Usuario.find_by_username('naye')
	p = Permiso.query.limit(5).all()
	return f"{u}"

@app.route('/llenar_msyql')
def llenar_msyql():
	from models.sql_script import MysqlScript
	p = MysqlScript
	p.ScriptLlenarTablas()

if __name__ == "__main__":
	if app.config['DEBUG']:
		@app.before_first_request
		def create_tables():
			db.create_all()
	
	app.run(port=8080 ,debug=True)	

""" if __name__ == "__main__":
	db.init_app(app)
	dbMongo.init_app(app)
	if app.config['DEBUG']:
		@app.before_first_request
		def create_tables():
			db.create_all()
	Migrate(app,db,compare_type=True)
	app.run(port=8080) """