import { CSSProperties } from '@material-ui/core/styles/withStyles'
import React, { Children } from 'react'
import { theme } from '../domain/utils/theme'

interface IProps {
    style?: CSSProperties
}

export const Paper: React.FC<IProps> = ({ children, style }) => {

    return (
        <div style={{
            
            padding: '10px', 
            boxShadow: theme.paperBoxStyle, 
            
            backgroundColor: 'rgba(255, 255, 255, 1)',...style
        }}>
            {children}
        </div>
    )
}
