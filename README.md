TODO:
1 -Arreglar el start-up de la aplicacion, hay que esperar un rato hasta que este disponible la conexion de la base para conectarse.

2- En front, cambiar todas las referencias de :
      private API_URL = 'http://localhost:8080/api/v1/'; A variables externas..

3-  Problema al enviar permisos con lista vacia desde postman.

4- ~~default para creacion de usuarios: siempre debe estar tecnico, para eso se agrega siempre desde el backend~~

5- ~~cola de mensajes de error al crear usuarios no se borra.~~

6- ~~Borrar usuarios no actualiza la lista de usuarios~~

7- confirmacion para borrar usuarios

8- ~~Error al editar usuarios: no muestra bien el error~~

9- ~~Error al editar usuarios: password hasheada~~ -> ahora pide siempre blanquear clave

----


# Pasos para levantar el entorno con docker-compose:

## Backend y bases por un lado, frontend por otro
1- Levantamos backend y bases:

$docker-compose up --build

(La base de mysql  ya arranca con datos, a la base de mongo hay que llenarla con el endpoint: localhost:8080/api/v1/llenarBaseMongo , enviando en el body los datos que se encuentran en /data/postman-mongo.json)

2- Levantamos el front, dentro de la carpeta /front ejecutamos:

$docker-compose up --build

----

# Pasos para levantar el entorno de forma local:

-Requerimientos: tener python 3.10 instalado.
-
## 1-Clonar el proyecto
## 2-Crear environment dentro de la carpeta raíz:

$python3 -m venv env

## 3-Entrar al entorno e instalar librerías:
$source ./env/bin/activate

(El prompt de la consola debe cambiar a (env)

## 4- Ejecutar los siguientes comandos:

$pip install wheel 

$pip install -r requirements.txt


## 5- Crear bases en Docker

$sudo docker run -d -p 27017-27019:27017-27019 --name mongoDB mongo
$sudo docker run -d -p 33060:3306 --name mysqlDB -e MYSQL_ROOT_PASSWORD=secret mysql

## 5-Levantar la app dentro de la carpeta raíz:

$python app.py

----

Posibles errores solucionables con algunos de estos comandos:

Problemas al installar mysql-client:
* En ubuntu
$apt-get install libmysqlclient-dev python-dev (Fuera del entorno)

En windows:
$pip install --only-binary :all: mysqlclient

- Problemas de compatibilidad con libreria Flask-JWT Y PyJWT : https://github.com/tensorflow/tensorboard/issues/5478

-Problemas de certificado SSL : https://stackoverflow.com/questions/49324802/pip-always-fails-ssl-verification?rq=1



-------------------

23/11: 
#ImportError: cannot import name 'Mapping' from 'collections' (C:\Program Files\WindowsApps\PythonSoftwareFoundation.Python.3.10_3.10.2288.0_x64__qbz5n2kfra8p0\lib\collections\__init__.py)
en api_jws.py y api_jwt.py



------------------
Sobre presentación:

-Token JWT enviado en cada request http -> backend protegido, solo usuarios autorizados pueden obtener información.