

# Pasos para levantar el entorno:

-Requerimientos: tener python 3.10 instalado.
-
## 1-Clonar el proyecto
## 2-Crear environment dentro de la carpeta raíz:

$python3 -m venv env

## 3-Entrar al entorno e instalar librerías:
$source /path/to/env/bin/activate

(El prompt de la consola debe cambiar a (env)

## 4- Ejecutar los siguientes comandos:

$pip install wheel 

$pip install -r requirements.txt


## 5- Crear bases en Docker

$sudo docker run -d -p 27017-27019:27017-27019 --name mongoDB mongo
$sudo docker run -d -p 33060:3306 --name mysqlDB -e MYSQL_ROOT_PASSWORD=secret mysql

## 5-Levantar la app dentro de la carpeta raíz:

$python app.py

Posibles errores solucionables con algunos de estos comandos:

Problemas al installar mysql-client:
* En ubuntu
$apt-get install libmysqlclient-dev python-dev (Fuera del entorno)

En windows:
$pip install --only-binary :all: mysqlclient

- Problemas de compatibilidad con libreria Flask-JWT Y PyJWT : https://github.com/tensorflow/tensorboard/issues/5478




-------------------

23/11: 
#ImportError: cannot import name 'Mapping' from 'collections' (C:\Program Files\WindowsApps\PythonSoftwareFoundation.Python.3.10_3.10.2288.0_x64__qbz5n2kfra8p0\lib\collections\__init__.py)
en api_jws.py y api_jwt.py

