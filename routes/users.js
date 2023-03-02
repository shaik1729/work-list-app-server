var express = require('express');
var router = express.Router();
var database = require('../database');
var jwt = require('jsonwebtoken');
const VerifyEmailTokenSender = require('../helpers/VerifyEmailTokenSender');
const validateToken = require('../helpers/validateToken');

const bcrypt = require("bcrypt");


/* GET users listing. */
router.post('/signup', function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if(!username || !password || !email) {
    return res.status(400).json({message: 'Please provide a username and password and email'});
    return;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  var query = `INSERT INTO users (username, password, email) VALUES ('${username}', '${hashedPassword}', '${email}')`;

  database.query(query, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(400).json({message: 'Email or Username already exists'});
      }
      const result = {
        'message': 'User created successfully Please verify your email before login',
      };

      VerifyEmailTokenSender(email);

      return res.status(200).json(result);
  });

  // res.json({message: 'User created successfully check your email for verification'});
});

router.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(400).json({message: 'Please provide a username and password'});
  }


  var query = `SELECT * FROM users WHERE username = '${username}'`;

  database.query(query, function(err, data) {
      if (err) {
        console.log(err);
        return res.status(500).json({message: 'Something went wrong'});
      }

      if(data.length === 0) {
        return res.status(401).json({message: 'Invalid username or password'});
        return;
      }else{

        const hashedPassword = data[0].password;       

        bcrypt.compare(password, hashedPassword, function(err, result) {
          if (err) {
            console.log(err);
            return res.status(500).json({message: 'Something went wrong'});
          }

          if (result) {
            // password is valid

            const is_email_verified = data[0].is_email_verified;

            if (is_email_verified === 0){
              return res.status(401).json({message: 'Email is not verified kindly verify your email'});
            }else{

              const auth_token = jwt.sign({ username: username, userid: data[0].id }, "somesecret", { expiresIn: '15s' });
              // const refresh_token = jwt.sign({ username: username, userid: data[0].id }, "somesecret", { expiresIn: '5m' });

              const result = {
                'status': 200,
                'auth_token': auth_token,
                // 'refresh_token': refresh_token,
                'message': 'User logged in successfully'
              };
              return res.json(result);
            } 
          }
          else {
            // password is invalid
            return res.status(401).json({message: 'Invalid username or password'});
          }    
        });        
      }
  })
})

// email verify token route

router.get('/verify/:token', (req, res, next) => {

  // console.log("Verifying Token: ", req.params.token)

  let token = req.params.token;

  if(!token) {
    return res.status(400).json({message: 'Please provide a token'});
  }else{
    jwt.verify(token, "somesecret", function(err, decoded) {

      if (err) {
        console.log(err);
        return res.status(401).json({message: 'Invalid token'});
      }else{
        const email = decoded.email;
        // const id = decoded.user_id;
  
        // var query = `select * from users where email = '${email}'`;
  
        // var query = `UPDATE users SET is_email_verified = 1 WHERE email = ${email}`;
        var query = `UPDATE users SET is_email_verified = 1 WHERE email = "${email}"`;
  
        database.query(query, function(err, data) {
          if (err){
            console.log("******************************************************")
            console.log(err);
            return res.status(500).json({message: 'Something went wrong'});
          }else{
            return res.status(200).json({message: 'Email verified successfully'});
          }
          // console.log(data);
        });
      }
    });
  }

});


router.post('/generate-verify-token', (req, res, next) => {
  const email = req.body.email;

  if(!email) {
    return res.status(400).json({message: 'Please provide a email'});
  }else{

    const query = `select * from users where email = '${email}'`;

    database.query(query, function(err, data) {
      if (err) {
        return res.status(500).json({ data: { message: 'Somethign went wrong'}});
      }else if(data.length === 0){
        return res.status(404).json({ data: { message: 'Email not found'}});
      }else{
        VerifyEmailTokenSender(email);
        return res.status(200).json({ data: { message: 'Email verification token sent successfully'}});
      }
    });
  }
});

router.post('/get-auth-token-by-refresh-token', (req, res, next) => {
  const refresh_token = req.body.refresh_token;

  if(!refresh_token) {
    return res.status(400).json({message: 'Please provide a refresh token'});
  }else{
    const response = validateToken(refresh_token);
    if(!response.status){
      return res.status(401).json({message: 'Invalid refresh token'});
    }else{
      const new_auth_token = jwt.sign({ username: response.email, userid: response.user_id }, "somesecret", { expiresIn: '15s' });
      return res.status(200).json({ data: { auth_token: new_auth_token }});
    }
  }
});
    

module.exports = router;
