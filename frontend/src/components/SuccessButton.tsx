import { PrimaryButton } from '@fluentui/react'
import React, { CSSProperties } from 'react'


interface IProps{
  text?:string;
  onClick?:any;
  style?:CSSProperties;
  width?:string;
}


export const SuccessButton:React.FC<IProps> = ({onClick,text,children,style,width}) => {
  return (
    <PrimaryButton style={style} styles={{
      root:{
        color:'white',
        backgroundColor:'#2dc653',
        borderColor:'#2dc653'
    },
    rootHovered:{
        color:'white',
        backgroundColor:'#25a244',
        borderColor:'#25a244'
    },
    rootPressed:{
        color:'white',
        backgroundColor:'#25a244',
        borderColor:'#25a244'
    }
    }} onClick={onClick} text={text} />

)
}
