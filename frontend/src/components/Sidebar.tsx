import { ActionButton, Button, Icon, INavLink, INavLinkGroup, Link, Nav, Panel, Persona, Text } from '@fluentui/react'
import React, { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { useHistory } from 'react-router'
import { useStore } from '../domain/stores/Store'
import { IRoute } from '../domain/utils/IRoute'
import getRoutes from '../domain/utils/routes'
import logo from '../resources/images/PngItem_3559795.png'
import { FiAirplay } from 'react-icons/fi'
import config from '../appConfig.json'
import { observer } from 'mobx-react-lite'

interface IProps {

}
function _onRenderGroupHeader(group: any): JSX.Element {
    return <h3>{group.name}</h3>;
}
 const Sidebar: React.FC<IProps> = () => {
    const { AuthenticationStore } = useStore()
    const history = useHistory()
    const [navBarRoutes, setNavBarRoutes] = useState<INavLink[]>([])
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        let routes: INavLink[] = []
        getRoutes().forEach(element => {
            if (element.mapped !== false)
                routes.push({
                    icon: element.icon,
                    name: element.name,
                    url: element.path,
                    onClick: (e) => {
                        e?.preventDefault()
                        if(isMobile){
                            setMobileOpen(false)
                        }
                        history.push(element.path);
                    }
                });
        });
        setNavBarRoutes(routes);
    }, [AuthenticationStore.user, history])



    const navLinkGroups: INavLinkGroup[] = [
        {
            name: '',
            links: navBarRoutes,
        }
    ];
    if (isMobile) {
        return (<>
       {isMobile && 
       <div style={{position:'fixed',marginRight:'auto',display:'flex',backgroundColor:'#caf0f8',width:'100%' ,zIndex:214}}>    
         <img src={logo} alt=""  style={{maxHeight:'50px'}}/>    
            <Icon style={{marginLeft:'auto',padding:'20px'}} iconName='CollapseMenu' onClick={()=>{setMobileOpen(!mobileOpen)}}/>
        </div>
        }
            <Panel isOpen={mobileOpen} onDismiss={()=>{setMobileOpen(!mobileOpen)}}>
            <Nav styles={{
                    linkText: {
                        color: 'black'
                    },
                }} groups={navLinkGroups} onRenderGroupHeader={_onRenderGroupHeader} />
            </Panel>
        </>
        )

    } else {
        return (
            <div style={
                {
                    width: '200px',
                    height: '100vh',
                    marginRight: 0,
                    padding: '5px',
                    display: 'flex',
                    flexDirection: 'column',
                    backdropFilter: ' blur(25px) saturate(125%)',
                    backgroundColor: ' rgba(255, 255, 255, 0.66)'
                }
            }>
                <img src={logo} alt="" />
                <Nav styles={{
                    linkText: {
                        color: 'black'
                    },

                }} groups={navLinkGroups} onRenderGroupHeader={_onRenderGroupHeader} />
                <div onClick={() => history.push('/ViewProfile')} style={{ marginTop: 'auto', cursor: 'pointer' }}>
                    <Persona text={AuthenticationStore.user.fullName} imageUrl={config.profilePicturesUrl + AuthenticationStore.user.profilePicture} />
                    {/* Used to push persona up */}
                    <div style={{ height: '10px' }}></div>
                </div>
            </div>

        )
    }
}

export default observer(Sidebar)
