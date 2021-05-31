# recipes_library_2.0

Library for Evoila5 recipes

## Before starting

Create file at `/web-app/.env` based on `/web-app/.env.template` and put local ip in variable (`http://192.168.0.xxx:4001`).

Also change url to fit local ip in both `docker-compose.yml` (http://192.168.0.xxx:3000) and `docker-compose.prod.yml` (http://192.168.0.xxx:3001).

## Start the app

### Dev

In `/web-app`, run both commands `npm i` and `npm run dev`.

Start the api and database with `docker-compose.yml`. It is recommended to do this from Visual Studio, put `docker-compose` as starting project then debug.

### Prod

Lauch everything through docker compose with the file `docker-compose.prod.yml` located at root.

Simply run the command :

```
docker-compose -f docker-compose.prod.yml up --build [-d] (detached mode)
```

If it was started in detached mode (nothing shown in cmd), stop the containers with :

```
docker-compose -f docker-compose.prod.yml stop
```
