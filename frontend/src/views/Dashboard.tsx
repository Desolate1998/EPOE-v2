import { Button, DefaultButton } from '@fluentui/react'
import React from 'react'
import { Paper } from '../components/Paper'
import { pageSetup } from '../domain/utils/pageSetup'
import image from '../resources/images/MainContentBackground.jpg'

export const Dashboard = () => {
    pageSetup({ pageName: 'Dashboard' })

    return (
        <div>
            <h1>Dashboard</h1>
            <Paper>
                <DefaultButton onClick={()=>{
                    console.log('test')
                }}>
                    
                </DefaultButton>

            </Paper>
        </div>
    )
}
