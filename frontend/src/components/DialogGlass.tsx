import { ContextualMenu, Dialog, DialogContent } from '@fluentui/react'
import React from 'react'
import { theme } from '../domain/utils/theme'

interface IProps {
  open: boolean;
  subText: string;
  title: string;

}

export const DialogGlass: React.FC<IProps> = ({ open, subText, title, children }) => {
  return (
    <Dialog styles={{
      main: theme.glassDialog, root: {
        background: 'none',
        backgroundColor: 'red'
      }
    }}
      modalProps={{
        isModeless: true,
        dragOptions: {
          moveMenuItemText: 'Move',
          closeMenuItemText: 'Close',
          menu: ContextualMenu,
          keepInBounds: true,
        }

      }} hidden={!open} dialogContentProps={{ title: title, subText: subText }}>
          <DialogContent styles={{
          inner: {
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            overflow:'hidden'
          },
          header: {
            height: 0
          },
          

        }}  >
      {children}
      </DialogContent>
    </Dialog>
  )
}
