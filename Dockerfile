FROM python:3.9
EXPOSE 8080
COPY ./requirements.txt /app/requirements.txt
WORKDIR /app
RUN python3 -m venv env
RUN pip install --upgrade setuptools 
SHELL ["/bin/bash", "-c"] 
RUN source ./env/bin/activate
RUN pip install --trusted-host=pypi.org --trusted-host=files.pythonhosted.org --user wheel 
RUN pip install -r requirements.txt --trusted-host=pypi.org --trusted-host=files.pythonhosted.org --user  
COPY . /app
EXPOSE 8080
CMD ["python" , "app.py"]

#CMD python -m gunicorn -w 4 -b 0.0.0.0:8080 app:app
