import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { useStore } from '../domain/stores/Store';
import { IRoute } from '../domain/utils/IRoute';
import getRoutes from '../domain/utils/routes';
import  Sidebar  from './Sidebar';
import Layout from './Layout';
import { Dimmer } from './Dimmer';
import { Icon } from '@fluentui/react';
import { isMobile } from 'react-device-detect';

 const RouterWrapper: React.FC = ({ children }) => {
    const { AuthenticationStore, GeneralStore: GenralStore } = useStore()
    const [routes, setRoutes] = useState<IRoute[]>([])

    useEffect(() => {
        setRoutes(getRoutes());
    }, [AuthenticationStore.user])


    if (AuthenticationStore.user.token === '') {
        return (
            <Router>
                <Dimmer open={GenralStore.dimmerOpenboolean} />
                <Switch>
                    {
                        routes.map(item => {
                            return (
                                <Route exact path={item.path} >
                                    {item.component}

                                </Route>
                            )
                        })
                    }
                </Switch>

            </Router>
        )
    } else
     return (
        <Router>
            <Dimmer open={GenralStore.dimmerOpenboolean} />
            <div style={{ display: 'flex' }}>
     
                <Sidebar  />
                <Layout />
            </div>
        </Router>
    )
}

export default observer(RouterWrapper)

