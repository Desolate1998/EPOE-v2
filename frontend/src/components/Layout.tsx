import { Icon } from '@fluentui/react'
import { observe } from 'mobx'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { Route } from 'react-router'
import { useStore } from '../domain/stores/Store'
import { IRoute } from '../domain/utils/IRoute'
import getRoutes from '../domain/utils/routes'

const Layout: React.FC = ({ children }) => {
    const { AuthenticationStore } = useStore()
    const [routes, setRoutes] = useState<IRoute[]>([])

    useEffect(() => {
        setRoutes(getRoutes());
    }, [AuthenticationStore.user])

    return (
        <>
        <div style={{backgroundColor:'#FAF9F8'
        ,width: isMobile?(window.innerWidth):(window.innerWidth-180),
        padding:'20px',
        paddingTop: isMobile? '50px':'20px',
        backdropFilter:'blur(30px)  ',
        maxHeight:isMobile?'100vh':'99vh',overflowY:'scroll'}}>
            {routes.map(item => {
                return (
                    <Route exact path={item.path} >{item.component} </Route>
                    )
                })}
        </div>
    </>
    )
}

export default observer(Layout)