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
FROM python:3.9
EXPOSE 8080
RUN apt-get update -y && apt-get install -y build-essential
COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt
COPY . /app

CMD ["python" , "app.py"]

CMD python -m gunicorn -w 4 -b 0.0.0.0:8080 app:apps