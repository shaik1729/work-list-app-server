const jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');
const app_email = 'svit.sea@gmail.com'
const app_password = 'rcqleapkqynrdfco'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: app_email,
        pass: app_password
    }
});

const VerifyEmailTokenSender = (email) => {

    console.log("In VerifyEmailTokenSender got : ", email);

    const token = jwt.sign({email: email}, 'somesecret', {expiresIn: '10m'});

    const token_url = `http://localhost:3000/api/v1/users/verify/${token}`;

    const mailConfigurations = {

        // It should be a string of sender/server email
        from: app_email,
        
        to: email,
        
        // Subject of Email
        subject: 'Email Verification Token',
            
        // This would be the text of email body
        text: `Hi! There, You have recently visited our website and entered your email. Please follow the given link to verify your email
                
        ${token_url}
            
        Thanks`
            
    };

    transporter.sendMail(mailConfigurations, function(error, info){
        if (error){
            console.log('Error in sending email');
            console.log(error);
        }
        console.log('Email Sent Successfully');
        console.log(info);
    });
}


module.exports = VerifyEmailTokenSender;