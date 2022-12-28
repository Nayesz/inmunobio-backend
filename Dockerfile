FROM python:3.9
EXPOSE 8080
#RUN apt-get install -y build-essential
#RUN pip install --trusted-host pypi.python.org --trusted-host pypi.org --trusted-host files.pythonhosted.org pytest-xdist

#RUN python -m pip install --trusted-host pypi.python.org --trusted-host pypi.org --trusted-host files.pythonhosted.org --upgrade pip

COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
RUN python3 -m venv env
RUN pip install --upgrade setuptools 
SHELL ["/bin/bash", "-c"] 
RUN source ./env/bin/activate
RUN pip install --trusted-host=pypi.org --trusted-host=files.pythonhosted.org --user wheel 
RUN pip install -r requirements.txt --trusted-host=pypi.org --trusted-host=files.pythonhosted.org --user  
COPY . /app
#CMD ["echo ",":)"]
CMD ["python" , "app.py"]

#CMD python -m gunicorn -w 4 -b 0.0.0.0:8080 app:apps
# FROM python
# EXPOSE  8080
# RUN apt-get update -y && apt-get install -y build-essential
# COPY ./requirements.txt /app/requirements.txt
# WORKDIR /app
# RUN pip install -r requirements.txt
# COPY . /app

# CMD ["python" , "app.py"]

# CMD python -m gunicorn -w 4 -b 0.0.0.0:8080 app:app

# FROM python:3.9
# EXPOSE 8080
# RUN apt-get update -y && apt-get install -y build-essential
# WORKDIR /app
# COPY ./requirements.txt requirements.txt
# RUN pip install -r requirements.txt
# COPY . /app
# RUN apt-get install libmysqlclient-dev python-dev
# CMD ["python" , "app.py"]

#CMD python -m gunicorn -w 4 -b 0.0.0.0:8080 app:app
# FROM ubuntu:20.04
# EXPOSE 8080
# RUN apt-get update -y && apt-get install -y build-essential
# RUN apt-get install libmysqlclient-dev python-dev 
# WORKDIR /app
# COPY ./requirements.txt requirements.txt  
# RUN pip install -r requirements.txt
# COPY . /app
# CMD ["python" , "app.py"]