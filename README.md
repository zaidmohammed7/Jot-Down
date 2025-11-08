### Running Locally

##### Install the following:
- **Node.js** ≥ 18  
- **PostgreSQL** 

##### Create your local database:
- psql -U postgres
- CREATE DATABASE jot_down_db;
- \q
- Must be on port 5432


##### After cloning the repository
----------------------------------------------

###### Install dependencies for frontend and backend:
- cd *frontend* && npm install
- cd *backend* && npm install 

##### Run the db migrations
- npx node-pg-migrate up


##### To start up the local environment:
- Start up the server: npm run dev
- Start up the client: npm run dev