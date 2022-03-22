import { MessageBar, MessageBarType, PrimaryButton, ProgressIndicator, TextField, Toggle } from '@fluentui/react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Paper } from '../../components/Paper';
import { ActivityApi } from '../../domain/api/requests/ActvityApi';
import { IActivity } from '../../domain/entities/activity';
import { IMessageBarCustom } from '../../domain/entities/messageBar';



export const ViewActivity = () => {
  //@ts-ignore
  const [id] = useState(useParams().id);
  const [updateErrorMessage, setUpdateErrorMessage] = useState('')
  const [messageBar, setMessageBar] = useState<IMessageBarCustom>({
    message: '',
    type: MessageBarType.success,
    visable: false
  });


  const [activity, setActivity] = useState<IActivity>()

  useEffect(() => {
    (async function getApi() {
      try {
        let res = await ActivityApi.get("/" + id);
        setActivity(res)
      } catch (error) {

      } finally {

      }
    })();
  }, []);

  if (!activity) return <ProgressIndicator label="Loading Item" />;

  async function update() {
    try {
      ActivityApi.update(activity!)
      setMessageBar({
        message: "Updated!",
        type: MessageBarType.success,
        visable: true
      });
      setTimeout(() => {
        setMessageBar({
          message: "Updated!",
          type: MessageBarType.success,
          visable: false
        });
      }, 3000);

    } catch (error) {
      setUpdateErrorMessage("Name already in use.")

      setTimeout(() => {
        setUpdateErrorMessage("")
      }, 3000);
    }finally{

    }
  }
  return (
    <div >
      <h1>Activity</h1>
      <Paper>
        <TextField label='Name' value={activity.name} onChange={(e) => {
          setActivity({
            ...activity,
            name: e.currentTarget.value
          })
        }}
          errorMessage={updateErrorMessage}

        />
        <br />

        <TextField label='Description' multiline value={activity.description} onChange={(e) => {
          setActivity({
            ...activity,
            description: e.currentTarget.value
          }) }} />

          
          <Toggle label='Active' onText='Visable' offText='Hidden' checked={activity.active} onChange={(e, state) => {
            setActivity({
             ...activity,
              //@ts-ignore
              active: state
            })
          }} />
       
        <div hidden={!messageBar.visable}>
          <MessageBar dismissButtonAriaLabel="Close" messageBarType={messageBar.type}  >
            {messageBar.message}
          </MessageBar>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
          <PrimaryButton label='Update' onClick={() => update()} color='Primary' >Update</PrimaryButton>

        </div>
      </Paper>
    </div>
  )
}
