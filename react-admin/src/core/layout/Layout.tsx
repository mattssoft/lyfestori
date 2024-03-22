import {Layout} from 'react-admin'

import {CustomMenu} from './Menu'
import {CustomAppBar} from './AppBar'

export const CustomLayout = (props) => (
    <Layout 
        {...props} 
        menu={CustomMenu} 
        appBar={CustomAppBar}
    />
)