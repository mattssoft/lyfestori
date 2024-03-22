/* eslint-disable react/display-name */

// core deps
import {useState, useEffect} from 'react';
import { 
    Admin, 
    Resource, 
    CustomRoutes, 
    combineDataProviders
} from 'react-admin';
import { Route} from "react-router-dom";

// data providers
import authProvider from './authProvider'
import buildGraphQLProvider from './dataProviders/graphql/buildQuery';

// react UI components
import Login from './core/authentication/Login'
import Signup from './core/authentication/Signup'
import CreateProfile from './core/authentication/CreateProfile'
import EditUser from './core/EditUser'
import ResetPasswordRequest from './core/authentication/ResetPasswordRequest'
import ResetPasswordAction from './core/authentication/ResetPasswordAction'

// i18n
import {i18nProvider} from './i18n/i18nProvider'

// theme
import {theme} from './core/layout/themes'
import {CustomLayout} from './core/layout/Layout'

export const App = () => {
    
    /*
        graphql data provider setup    
        https://github.com/marmelab/react-admin/tree/master/packages/ra-data-graphql-simple
    */
    const [graphQlDataProvider, setGraphQlDataProvider] = useState(null);

    useEffect(() => {
        buildGraphQLProvider
            .then(graphQlDataProvider => setGraphQlDataProvider(() => graphQlDataProvider));
    }, []);

    if (!graphQlDataProvider) {
        return null;
    }
    
    // the final data provider is a combination of multiple data providers that will be passed into the Admin component
    const combinedDataProviders = combineDataProviders((resource) => {
        switch(resource) {
            case "User":
                return graphQlDataProvider;
            default:
                throw new Error(`Unknown resource: ${resource}`);
        }
    })
    
 
    return (
        <Admin 
            authProvider={authProvider} 
            dataProvider={combinedDataProviders}
            i18nProvider={i18nProvider}
            layout={CustomLayout}
            loginPage={Login}
            theme={theme}
        >

            <CustomRoutes>
                <Route path="/User" element={<EditUser />} />
            </CustomRoutes>

            <CustomRoutes noLayout>
                <Route path="/Signup" element={<Signup />}  />
                <Route path="/CreateProfile" element={<CreateProfile />}  />
                <Route path="/resetpasswordrequest" element={<ResetPasswordRequest />}  />
                <Route path="/resetpasswordaction" element={<ResetPasswordAction />}  />
            </CustomRoutes>

        </Admin>
    );
}




