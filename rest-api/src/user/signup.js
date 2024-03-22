import { v4 as uuidv4 } from 'uuid';
import { keystoneAuth, authenticatedClient } from "../keystoneAuth.js"
import { gql } from '@apollo/client/core/core.cjs';


// create a new user in keystone, add the invitationToken

export const signup = async ({email}) => {

    const invitationToken = uuidv4()
    const client = authenticatedClient(await keystoneAuth())

    try {
        return client.mutate({
            mutation: gql`
                mutation Mutation($data: UserCreateInput!) {
                    createUser(data: $data) {
                        id
                    }
                }    
            `,
            variables: {
                data: {
                    email,
                    invitationToken
                }
            }
        })
    } catch(e) {
        console.log(e)        
    }

}