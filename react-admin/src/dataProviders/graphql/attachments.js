import { ApolloClient, InMemoryCache, ApolloProvider, gql, useMutation } from '@apollo/client';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs"

const UPLOAD_FILES_MUTATION = gql`
  mutation Mutation($data: [AttachmentCreateInput!]!) {
    createAttachments(data: $data) {
      id
    }
  }
`;

const uploadClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({ 
    uri: 'http://localhost:3000/api/graphql',
    headers: {
      "Apollo-Require-Preflight": "true",
  },
    credentials: 'include'
  })
})

export const attachmentDataProvider = {

    /* 
      TODO: the correct usage of create() is to create and return one and only one resource

      Here a graphql mutation is used that uploads one or more files

      Creating multiple files in one go should be implemented outside create()
    */
    create: async (resource, params) => {

        return await uploadClient.mutate({
            mutation: UPLOAD_FILES_MUTATION,
            variables: params
            
          }).then(r => {

            /**
            A slight hack is done here for now, the response of the create function is expected to have the format
            { data: { id: 123, ... } }

            If the response is not in this format, the dataprovider throws an error in the console :(
            */
            const responseObject = {
              data: {
                  id: 1, // we assign a dummy id here that won't be used for anything
                  attachments: r.data.createAttachments // here are the actual attachmentIds
              }
            }


            return responseObject
            
          }).catch(e => {
            console.log("graphql error", e)
            return {data: {}, total:0}
          })

    },
 
}