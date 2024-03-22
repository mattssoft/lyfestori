import { config as dotenv} from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import sgMail from '@sendgrid/mail'

// load environment vars
dotenv({ path: './common/.env' });


// configure Sendgrid
sgMail.setApiKey(process.env.SENDGRID_APIKEY);


export async function sendSignupEmail({email}) {

    const invitationToken = uuidv4()
    const verificationUrl = `${process.env.HOST}#/createprofile?email=${email}&invitationToken=${invitationToken}`
  
    const htmlMessage = `
    <html>
      <head>
        <style>
          .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #EB9B00;
            color: #000000;
            text-decoration: none;  
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s ease;
          }        
          
          .button:hover { 
            background-color: #9a6600;
          }    
        </style>
      </head>
      <h1>Victor Ek Customer Portal Signup</h1>
      <p>You are receiving this message because you requested an invitation to Victor Ek Customer Portal</p>
      <p>Please click the button below to continue the signup process.</p>
      <a href="${verificationUrl}" target="_blank" alt="Victor Ek Customer Service" class="button"/>Continue</a>
    </html>
    `
  
    const msg = {
      to: email,
      from: process.env.SUPPORT_EMAIL,
      subject: 'Victor Ek Customer Portal Email Verification',
      text: `Please click this link to verify your email and continue with the signup process: ${verificationUrl}`,
      html: htmlMessage,
    };  
  
    try {
      await sgMail.send(msg);
    } catch (e) {
      throw new Error(e)
    }
  }