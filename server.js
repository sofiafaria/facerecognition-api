const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const {ClarifaiStub, grpc} = require('clarifai-nodejs-grpc');

const register= require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const postgres = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : '',
      password : '',
      database : 'smart-brain'
    }
  });

const app= express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) =>{
    res.send('success')
})

app.post('/signin', (req,res) => signin.handleSignIn(req,res,postgres, bcrypt));

app.post('/register', (req, res) => register.handleRegister(req,res,postgres, bcrypt));

app.get('/profile/:id', (req,res) => profile.handleProfileGet(req,res,postgres));

app.put('/image', (req,res) => image.handleImage(req,res,postgres));

app.post('/imageurl', (req,res) =>image.handleClarifai(req,res, ClarifaiStub, grpc));

app.listen(process.env.PORT || 3000, () =>{
    console.log(`App is running on port ${process.env.PORT}` || `3000`);
});


console.log(process.env);