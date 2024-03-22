import { config as dotenv } from 'dotenv';
import { gql } from '@apollo/client/core/core.cjs';
import { keystoneAuth, authenticatedClient } from "../keystoneAuth.js";

dotenv({ path: './common/.env' });

const UPDATE_USER = gql`
mutation UpdateUser($where: UserWhereUniqueInput!, $data: UserUpdateInput!) {
    updateUser(where: $where, data: $data) {
        id
    }
} 
`

const RETRIEVE_RESET_TOKEN = gql`
query Query($where: UserWhereUniqueInput!) {
    user(where: $where) {
        passwordResetToken
    }
}
`

export const resetPassword = async ({email, resetToken, password}) => {

    const client = authenticatedClient(await keystoneAuth())
    
    // fetch reset token that was stored when the password request was initiated
    let storedToken;


    try {
        const response = await client.query({
            query: RETRIEVE_RESET_TOKEN,
            variables: {
                where: {
                    email
                }
            }    
        })

        storedToken = response.data.user.passwordResetToken

        if (storedToken === '') {
            throw new Error(`ALERT! ${email} tried to perform a password but there was no reset token stored in k6`)
        }

    } catch(e) {
        throw new Error(e)
    }

    // if tokens match, set the password and wipe token
    if (storedToken === resetToken) {

        try {
            await client.mutate({
                mutation: UPDATE_USER,
                variables: {
                    data: {
                        password: password,
                        passwordResetToken: ""
                    },
                    where: {
                        email
                    }
                }
            })
        }
        catch(e) {
            throw new Error(e)
        }
    } else {
        throw new Error(`ALERT! ${email} tried to perform a password but there was a token mismatch.`)
    }

}
