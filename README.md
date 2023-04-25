# Sharing-Places-And-Wonders
An app built using MERN stack which enables users to shares the places and wonders they have visited. 

# GET YOUR GEOCODING API
1. Go to https://developers.google.com/maps/documentation/geocoding/start and create you account.
![image](https://user-images.githubusercontent.com/67847705/234165182-7928ff03-89a3-4e7a-acf7-f1e092f6a12d.png)
2. Click on ```Get Started``` and get your API key for "GOOGLE GEOCODING" Service.

# GET STARTED WITH THE APP LOCALLY
## 1. Download dependencies
In the command line, go to the folders ```frontend``` and ```backend``` and type ```npm install``` to download all the dependencies locally.

## 2. Create ```.env``` file in frontend folder
In the ```frontend``` folder create a ```.env``` file and add the below environment variables
```
REACT_APP_GOOGLE_API_KEY=**<Here Goes the API key received from google>**
REACT_APP_BACKEND_URL=http://localhost:5000/api
REACT_APP_ASSET_URL=http://localhost:5000
```

## 3. Create a file ```nodemon.json``` in backend folder
In the ```backend``` folder create a ```nodemon.json``` file and add the below environment variables
``` JSON
{
  "env": {
    "DB_USER": <Here goes the username for the MongoDB atlas you have created>,
    "DB_PASSWORD": <Here goes the password>,
    "DB_NAME": <DB name that has been given in MongoDB Atlas>,
    "GOOGLE_API_KEY": <The API received from google for using GEOCODING>,
    "JWT_KEY": <The key that will be used for JWT authentication>
  }
}
```
> Note: The above point requires ```nodemon``` to be installed locally as a dev dependency

## 4. Getting ready to use the application in DEV mode
We can now start the application by running ```npm start``` on backend and frontend respectively.

> Make sure that in the ```package.json``` file of backend folder you add the following for managing code changes in server
``` JSON
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon app.js"
  },
```
