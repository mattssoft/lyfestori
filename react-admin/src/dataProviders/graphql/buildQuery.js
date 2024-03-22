import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';
import {graphqlApiUrl} from '../../config'


// use a modified adapter based on ra-data-graphql-simple
import buildGraphQLProvider, { buildQuery } from '../../ra-data-keystone6/src';

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: graphqlApiUrl,            
        credentials: 'include'  // add Cookie header to requests
    }),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'ignore',
          },
          query: {
            fetchPolicy: 'no-cache',
            errorPolicy: 'all',
          },        
    },

});

const customizeBuildQuery = introspectionResults => (raFetchType, resourceName, params) => {
    const builtQuery = buildQuery(introspectionResults)(raFetchType, resourceName, params);
    const user = JSON.parse(localStorage.getItem("user"))

    /**
     * Account Chart (CoA)
     */

    if (resourceName === "Order") {
        switch(raFetchType) {
            case "UPDATE": {
                const variables = builtQuery.variables;

                delete variables.data.pickupLocation
                delete variables.data.deliveryLocation
                delete variables.data.temp_pCountry
                delete variables.data.temp_dCountry
                delete variables.data.owner
                delete variables.data.createdAt
                delete variables.data.id
                delete variables.data["owner.id"]
                delete variables.data.attachment
                delete variables.data.attachments
                delete variables.data.attachmentsIds
                delete variables.data.attachmentsCount           

               
                variables.data = {
                    ...variables.data,
                }


                return {
                    ...builtQuery
                }
            }
            // sort the account references
            /*
            case "GET_ONE": {
                return {
                    ...builtQuery,
                    variables: {
                        ...builtQuery.variables,
                        orderBy: [{
                            account: "asc"
                        }]
                    }
                   
                }
            }
            */
            case "DELETE": {
                return {
                    ...builtQuery,
                    query: gql`
                    mutation DeleteOrder($where: OrderWhereUniqueInput!) {
                        deleteOrder(where: $where) {
                          id
                        }
                      }
                    `,
                    variables: {                   
                        "where": {
                            "id": params.id
                        }                                           
                    },
                    parseResponse: () => {
                        return { data: { id: params.id } };
                    }
                }
            }
        }
    }


    return builtQuery
}

export default buildGraphQLProvider({ 
    client: client, 
    buildQuery: customizeBuildQuery,
    introspection: {
        operationNames: {
            /**
             * keystone has all lowercase resource names
             */
            "GET_ONE": resource => {
                return `${lowercaseFirstLetter(resource.name)}`
            },

            /**
            * the schema introspection expects list to have the format "item" -> "allItem"
            * here, the builder is configured to use "items" 
            */
            "GET_LIST": resource => {
                return `${lowercaseFirstLetter(resource.name)}s`
            },
            
            "GET_MANY": resource => {
                return `${lowercaseFirstLetter(resource.name)}s`
            } 
                 
        }
    }
})

const lowercaseFirstLetter = (str) => {
    if (!str) return str; // Return the original string if it's empty
    return str.charAt(0).toLowerCase() + str.slice(1);
}