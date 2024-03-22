import { gql } from '@apollo/client/core/core.cjs';
import { config as dotenv} from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import sgMail from '@sendgrid/mail'
import { keystoneAuth, authenticatedClient } from "../keystoneAuth.js";

dotenv({ path: './common/.env' });

sgMail.setApiKey(process.env.SENDGRID_APIKEY);

const UPDATE_RESET_TOKEN = gql`
  mutation UpdateUser($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
    updateUser(where: $where, data: $data) {
      id
    }
  }   
`

export const sendResetPasswordEmail = async ({email}) => {

  const resetToken = uuidv4()
  const client = authenticatedClient(await keystoneAuth())

  const resetURL = `${process.env.HOST}/#/resetpasswordaction?email=${email}&resetToken=${resetToken}`

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
    <p>You are receiving this message because you requested a password reset for your Victor Ek Customer Portal account</p>
    <p>Please click the button below to continue with the password reset.</p>
    <a href="${resetURL}" target="_blank" alt="Victor Ek Customer Service" class="button"/>Continue with password reset</a>
  </html>
  `

  // add resetToken to user
  client.mutate({
    mutation: UPDATE_RESET_TOKEN,
    variables: {
      data: {
        passwordResetToken: resetToken,
      },
      where: {
        email
      }
    }
  }).catch(e => {
    console.log(e)
  })

  const msg = {
    to: email,
    from: process.env.SUPPORT_EMAIL,
    subject: 'Victor Ek Customer Portal Password Reset Request',
    text: `Please click this link to continue the password reset process: ${resetURL}`,
    html: htmlMessage,
  };  

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  }

}