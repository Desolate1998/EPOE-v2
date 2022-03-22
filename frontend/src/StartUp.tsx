import { initializeIcons } from '@fluentui/react';
import { useEffect, useState } from 'react';
import  RouterWrapper  from './components/RouterWrapper';
import ReactNotification from 'react-notifications-component'
import { ThemeProvider, PartialTheme } from '@fluentui/react';


const appTheme: PartialTheme = {
  
};
export const StartUp = () => {

  useEffect(() => {
     initializeIcons()
  }, [])

  
  return (

    <RouterWrapper>
   
    </RouterWrapper>
  
  )
}



