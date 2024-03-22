import React, { useState, useEffect } from 'react';

import { useGetOne, useRecordContext, Loading, useGetIdentity, Resource, useUpdate } from 'react-admin';

import { Create, Form, TextInput, SaveButton } from 'react-admin';
import { Grid, Divider } from '@mui/material';
import * as _ from 'underscore'



const WithIdentity = ({identity}) => {

    const { data, isLoading, error } = useGetOne('User', { id: identity.id});

    const [update, { isLoading: updateIsLoading, error: updateError }] = useUpdate();

    const handleUpdate = (event) => {
        const id = data.id
        delete data.id

        const value = event.target.value
        const key = event.target.attributes.id.value

        console.log(value, key)
        console.log(data)
        
        update('User',{
            id,
            data: {[key]: value},
            previousData: data
       })
       
    }

    // might not be needed after all
    const debouncedHandleUpdate = _.debounce(handleUpdate, 500)

    if (isLoading) {
        return <Loading />
    }

    if (!error) {

        return (
            <Form defaultValues={data}>
                <Grid container>

                    <Grid item xs={12}>
                        <TextInput source="email" fullWidth disabled />
                    </Grid>                

                    <Grid item xs={12}>
                        <TextInput source="name" 
                            //onChange={debouncedHandleUpdate} 
                            onBlur={handleUpdate}
                        />
                    </Grid>

                    <Divider />
            

                    <Grid item xs={12}>
                        <TextInput source="phone" onBlur={handleUpdate} />
                    </Grid>
                </Grid>
            </Form>
        )
    }

}


export const EditUser = () => {

    const {data, isLoading, error} = useGetIdentity()

    if (isLoading) {
        return <Loading />
    }

    if (!error) {

        return (
            <WithIdentity identity={data}/>
        )
    }

}

const EditUserWithResource = () =>  {
    <Resource name="User"
    options={{ label: 'Orders' }} 
    {...EditUser}
/>
}

export default EditUser