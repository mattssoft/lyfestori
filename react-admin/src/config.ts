export const host = "localhost"
export const httpApiUrlProd = 'https://api.vecpdemo.mattssoft.com'
export const graphqlApiUrlProd = `https://gapi.vecpdemo.mattssoft.com/api/graphql`

export const httpApiUrl = `http://${host}:8181`
export const graphqlApiUrl =  `http://${host}:3000/api/graphql`

const configs = {
    dev: {
        clientUrl: `http://localhost:5173`,
        httpApiUrl: `http://localhost:8181`,
        graphqlApiUrl: `http://localhost:3000/api/graphql`
    },
    prod: {
        clientUrl: `https://vecpdemo.mattssoft.com`,
        httpApiUrl: 'https://api.vecpdemo.mattssoft.com',
        graphqlApiUrl: `https://gapi.vecpdemo.mattssoft.com/api/graphql`
    }
}

export const getConfigs = (env = "dev") => {

    return configs[env]

}