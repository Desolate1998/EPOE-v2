import { DefaultButton, PrimaryButton } from '@fluentui/react'
import React, { CSSProperties } from 'react'

interface IProps{
    text?:string;
    onClick?:any;
    style?:CSSProperties
    width?:string;
}


export const DangerButton:React.FC<IProps> = ({onClick,text,children,style,width}) => {
    return (
            <PrimaryButton style={style} styles={{
                root:{
                    color:'white',
                    backgroundColor:'#ef233c',
                    borderColor:'#d90429'
                },
                rootHovered:{
                    color:'white',
                    backgroundColor:'#d90429',
                    borderColor:'#d90429'
                },
                rootPressed:{
                    color:'white',
                    backgroundColor:'#81171b',
                    borderColor:'#d90429'
                }
            }} onClick={onClick} text={text} />
        
    )
}
