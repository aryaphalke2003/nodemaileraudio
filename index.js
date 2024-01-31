const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors())

// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     auth: {
//         user: 'autumn.turcotte58@ethereal.email',
//         pass: 'dDtdqxsyeAPV7FCXrJ'
//     }
// });

const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    port : 465,
    auth: {
        user: 'aryaphalke9@outlook.com',
        pass: process.env.PASS
    }
});

let otpPairs = {}; // {email: otp}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

app.get('/sendmail', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const otp = Math.floor(getRandomArbitrary(100000,999999))

    const mailOptions = {
        from: 'aryaphalke9@outlook.com',
        to: req.query.to,
        subject: 'Audiguide Email Verification',
        text: `Dear User,

Thank you for creating an account on Audiguide. To ensure the security of your account, we require you to complete the OTP verification process.

Please enter the following OTP to verify your account: ${otp}.

Note: This OTP is valid for only 10 minutes. Please do not share this OTP with anyone, including our customer support team.

If you did not create an account on our application, please ignore this email.

Thank you for choosing Audiguide. We look forward to providing you with the best service.

Best regards,
Audiguide Team`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.send('Error');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent');
            otpPairs[req.query.to] = otp;
        }
    });

    setInterval(()=>{
        delete otpPairs[req.query.to];
    },600000)
});


app.get('/verifyotp', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*")
    const otp = req.query.otp
    const email = req.query.email
    if(otpPairs[email]!=undefined && otp == otpPairs[email]) {
        delete otpPairs[email];
        res.send('OTP Verified');
    }
    else {
        res.send('OTP Not Verified');
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});
