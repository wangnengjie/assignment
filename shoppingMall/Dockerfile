FROM python:3.7.2-slim-stretch

WORKDIR /app

COPY . /app

RUN pip install -r requirement.txt

EXPOSE 8888

CMD [ "python","service.py" ]