import {httpApiUrl} from '../../config'

export const addressDataProvider = {
    getList: async (resource, params) => {
     
        if (params.filter.country) {
            const response = await fetch(`${httpApiUrl}/address?country=${params.filter.country.toUpperCase()}`)
            const data = await response.json()
    
            return {
                data,
                total: data.length
            }
        }

        if (params.filter.name) {
            console.log("looking for:", params.filter.name)
            const response = await fetch(`${httpApiUrl}/address?name=${params.filter.name}`)
            const data = await response.json()

    
            return {
                data,
                total: data.length
            }
        }
        

        return {data: [], total:0}
    }
}