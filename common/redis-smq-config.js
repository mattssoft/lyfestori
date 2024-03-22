// set this to true when running anything dependent on redis locally
// set to false when running in the container

export const config = {
    redis: {
        client: "redis_v4",
        options: {
            socket: {
                host:"redis"
            }
        }
    }   
 }

 export const queueNames = {
    emailverifyer: "emailverifyer",
    resetpasswordrequest: "resetpasswordrequest",
    resetpasswordaction: "resetpasswordaction"
 }