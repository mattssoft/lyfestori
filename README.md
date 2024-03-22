# Lyfestori
Monorepo for lyfestori backend

## author
Olle Mattsson / Mattssoft
olle@mattssoft.com

## installation

### prerequisites
Note: The project is meant to run with docker compose in a linux environment.   
Some of the instructions might assume Debian 12. macOS should also work out of the box for most parts.

- nodejs v18 or later
- npm 9.8.1
- docker 24.0.7 or later

### steps
`cd common && npm install`

### nginx configs
- Change <NAME> and <VM-IP> appropriately.
- Change the config filenames to something that is easier to remember, eg. project.domain.com, api.project.domain.com and gapi.project.domain.com
- Copy confs to /etc/nginx/sites-available
- Run `certbot --nginx` to obtain ssl certificates for the domains
- Restart nginx: `systemctl restart nginx`


## runnin

### locally for development
run `docker compose up` in the root folder, this spools up the project with dev flags

- react-admin client runs on `localhost:5173``
- keystone backend runs on `localhost:3000`, graphql api and playground runs on `localhost:3000/api/graphql`
- http-api runs on `localhost:8181`

#### updating keystone schema locally
When changing or updateing the schema, keystone asks for confirmation during startup. This needs manual input by developer. Follow these steps:
- postgres container should be running. Start it with `docker compose up postgres` if needed.
- in `docker-compos.yml`, change the keystone config to run command `npm run null` on startup, this stops keystone from running when the container starts up
- start the keystone container with `docker compose up keystone -d`
- enter the docker container environment with `docker compose exec keystone /bin/sh`
- start keystone with `npx keystone dev`
- confirm schema changes
- `exit` the container environment
- revert changes made to `docker-compose.yml`
- go about your day

### production



#### nginx
Site configs are available in ./nginx/sites-available

On a new system, copy these files to the nginx sites-available config folder, eg
`sudo cp -r nginx/sites-available/ /etc/nginx/`

Create the required symlinks in sites-enabled, eg.
`sudo ln -s /etc/nginx/sites-available/vecpdemo.mattssoft.com.conf /etc/nginx/sites-enabled/`

Test the config
`sudo nginx -t`

Reload nginx
`sudo systemctl reload nginx`



#### start on macos
sudo /usr/local/nginx/sbin/nginx

test config
sudo /usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf



## troubleshooting

### EMFILE too many files
Increase open file limit (only root can do this)
- login as root (su)
- `ulimit -n 65535`


### postgres port in use (macos)
`sudo -u postgres pg_ctl stop -D /Library/PostgreSQL/11/data`
Note: Change "11" to currently installed version

### react-admin client shows some error loading a module
THis might happened because a dependency was added to react-admin with npm install.
Fix it by rebuilding the react-admin docker image: `docker compose up react-admin --build`


### changes are not visible
This might be an issue with docker. Docker containers can be rebuilt with the --build flag. 

Sometimes it might be worth rebuilding the entire project:
`docker compose up --build`

It is also possible to rebuild only a specific container:
`docker compose up react-admin --build`

## testing

### vin 
WVWZZZE1ZMP024033
WBA6N3109MFK58674
KNAGV81FBL5042897
