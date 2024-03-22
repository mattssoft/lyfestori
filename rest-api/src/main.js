import http from "http"
import express from "express"
import cors from 'cors'
import { config as dotenv } from 'dotenv';
import { gql } from '@apollo/client/core/core.cjs';
import { keystoneAuth, authenticatedClient } from "./keystoneAuth.js";
import {getVinHandler} from "./ve_autoapi/vin.js"
import { getAddress } from "./ve_autoapi/address.js"
import { signup } from "./user/signup.js";
import { sendSignupEmail } from "./user/sendSignupEmail.js";
import { resetPassword } from './user/resetPassword.js'
import { sendResetPasswordEmail } from "./user/sendPasswordResetEmail.js";

// load environment vars
dotenv({ path: './common/.env' });

const port = process.env.PORT || 8181
const httpApi = express();
const server = http.createServer(httpApi);

// Configure allowed origins for CORS middleware
const allowedOrigins = [
  'http://localhost:5173',
  'https://vecpdemo.mattssoft.com'
];


httpApi.use(express.json());

httpApi.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);

    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    
    return callback(null, true);
  }
}));

server.listen(port, () => {
    console.log(`http-api listening on :${port}`);
});

/**
 * Define http endpoints
 */


/**
 *  Testing endpoint to see if server is responding
 */
httpApi.get('/ping', (req, res) => {
    res.status(200).send("server is up")
});


/**
 * Create a new user in k6 and send invitation email
 */
httpApi.post('/signup', async (req, res) => {

  const { email } = req.body;

  try {
    await signup({email})
  } catch (e) {

    if (e.graphQLErrors[0].message === "Prisma error: Unique constraint failed on the fields: (`email`)") {
      console.log(`email ${email} is already taken`)
      return res.status(409).send()
    }

  }

  try {
    await sendSignupEmail({email})
  } catch (e) {
    console.log(e)
    return res.status(500).send()
  }

  return res.status(200).send()

});

/**
 * Set password for user if invitationtoken is a match
 * 
 * TODO: move logic own file
 */
httpApi.post('/createprofile', async (req, res) => {
  const {email, password, invitationToken} = req.body
  const client = authenticatedClient(await keystoneAuth())

  try {
    const response = await client.query({
      query: gql`
        query Query($where: UserWhereUniqueInput!) {
          user(where: $where) {
            invitationToken
          }
        }
      `,
      variables: {
        where: {
          email
        }
      }
    })

    const invitationTokenChallange = response.data.user.invitationToken

    if (invitationToken === invitationTokenChallange) {
      client.mutate({
        mutation: gql`
          mutation Mutation($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
            updateUser(where: $where, data: $data) {
              id
            }
          }        
        `,
        variables: {
          where: {
            email
          },
          data: {
            password,
            // reset the invitation token so that password can only be set once
            invitationToken: "null" 
          }
        }
      }).then(r => {
        res.status(200).send({message: "password set"})
      }).catch(e => {
        console.log(e)
      })

    } else {
      console.log("token fail")
      res.status(401).send({message: 'invitation token mismatch'})
    }

  } catch(e) {
    res.status(404).send({message: "user does not exist"})
  }
})


/**
 * RESET PASSWORD (send mail)
 * request password reset mail to be sent to end user
 */
httpApi.post('/resetpasswordrequest', async (req, res) => {
  const { emailAddress: email  } = req.body;

  try {
    await sendResetPasswordEmail({email})
    return res.status(200).send()
  } catch (e) {
    console.log(e)
    return res.status(400).send()
  }

});


/**
 * RESET PASSWORD (perform reset)
 * request a password reset action
 */
httpApi.post('/pra', async (req, res) => {

  const { email, password, resetToken } = req.body;

  try {
    await resetPassword({email, password, resetToken})

    return res.status(200).send()

  } catch (e) {

    if (e.message.includes("Password must be at least 8 characters long")) {
        res.status(400).send('Password must be at least 8 characters long')
    }

    // send purposefully vague response in order to to
    // maintain security
    console.log(e)
    return res.status(418).send()
  }

});