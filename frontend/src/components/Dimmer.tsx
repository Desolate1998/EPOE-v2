import { Spinner } from '@fluentui/react'
import { observer } from 'mobx-react-lite'
import React, { useContext, createContext } from 'react'

interface IProps {
    open: boolean;
}


export const Dimmer: React.FC<IProps> = ({ open, children }) => {
    return (
        <div>
            <div style={{ visibility: open ? 'visible' : 'hidden', backgroundColor: 'rgba(1,1,1,.7)', height: '100vh', width: '100%', position: 'absolute', zIndex: 2147483647, display: 'flex', justifyContent: 'center', top: '0', left: '0' }}>
                <Spinner />
            </div>
            {children}
        </div>
    )
}

interface IDimmer {
    open: boolean;
}

export const dimmerStatus: IDimmer = {
    open: false,
}
export const DimmerContext = createContext(dimmerStatus)

export function useDimmer() {
    return useContext(DimmerContext)
}