# README #

### What is this repository for? ###

API for recouple

### How do I get set up? ###

- Create a local `.env` file

Configure these
```
NODE_ENV=dev

DB_HOST=127.0.0.1
DB_USERNAME=<default in docker-compose.yml>
DB_PASSWORD=<default in docker-compose.yml>
DB_DATABASE=recouple

METABASE_URL=
METABASE_KEY=

PORT=4001
```

- Start db and app `docker-compose up -d`
- Create DB `yarn migrate`
- Seed data - check `data/db.sql` is up to date, then `yarn seed-dump`
- (Optional) Monitor the console logs `docker-compose logs --follow --tail=20 api`
- Check that the API is up and running `curl -sSL http://localhost:4000/api/health | jq`
- Check that data was populated: `yarn api businesses/56 ".sites[0].name"` or `curl -sSL http://localhost:4000/api/businesses/56 | jq ".sites[0].name"`

To Seed the data from CSV File
- Make sure the CSV file names are given as underscored values according to particular model
- Seed data - npx sequelize-cli db:seed --seed=(seed-name)

To make things easier to use, you can access a db view through your browser by adding `127.0.0.1       db` to your hosts file and going to `http://db:8080/`

If you prefer to run the app locally (not through docker), you can `yarn start` innstead. The api will run on port 4001 instead - http://localhost:4001/

If you want to run the DB and the App locally (no docker), you need to start the mysql server locally, update the configuration in your local `.env` file and then run migrations and start the app with `yarn dbstart`

### Who do I talk to? ###

* dev@2xe.com.au
