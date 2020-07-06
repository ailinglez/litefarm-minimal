# Litefarm Backend

This repo contains the backend of the Litefarm Test.

## To run

To run please create (or rename env.sample ) a `.env` file on the root folder, this should contain all the environment variables used 
in the project. The file: env.sample contains all the keys with mocked values, please fill these with correct values. 

IMPORTANT: You will need to create a Database (which is defaulted to litefarm) and use the name of the DB you created in this new .env 
(default is litefarm)

After filling the environment file. Make sure you have Node and PostgreSQL installed and run 

    npm install
    npm run init-db

This will setup the DB Tables. You can use `npm run restart-db` if you want to delete the tables any time.
After this you can now run 

    npm start
which will start a server on port 3000. Now you can launch the frontend app.