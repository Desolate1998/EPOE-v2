import { concatStyleSetsWithProps, IStyle } from "@fluentui/react"
import {CSSProperties} from  'react'

interface ITheme {
  glassDialog:IStyle,
  paperBoxStyle:IStyle
}

const theme:any={
  glassDialog:{
    backdropFilter: 'blur(12px) saturate(200%)',
    backgroundColor: 'rgba(255, 255, 255, 0.23)',
    
  },
  paperBoxStyle:'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
  containerSpacing:2


  
}


export {theme}