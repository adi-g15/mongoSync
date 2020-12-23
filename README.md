# mongoSync

A simple script to **sync your localhost mongodb instance with the remote mongodb cluster**

All it does is ->
* Iterate through all collections in remote db
* Fetch ALL documents (Caution-> No limit, if needed modify) each collection
* Insert ALL fetched documents in _respective_ collection in localhost mongodb

### Dependencies ->
* mongodb
* dotenv

@note -> You will need to either directly put the mongo cluster uri in app.js or put it in a .env file,  in format similar to that given in .sample_env
