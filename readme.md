#Wefox Challenge
wefox assessment as a challenge

## requirements
- Git
- Docker and Docker Compose (you can simply install docker desktop on mac and windows)

## Installation
clone wefox-challenge from git repository:
```$xslt
https://github.com/meghrazchi/wefox.git
```
build docker containers using below command:
```$xslt
docker-compose up -d --build
```
initial .env file
```$xslt
cp .env.example .env
```
then you can access to application on:
```$xslt
http://localhost:8080
```
swagger is running on on:
```$xslt
http://localhost:8080/api-docs
```
