import { MessageBar, MessageBarType, PrimaryButton, ProgressIndicator, TextField } from "@fluentui/react";
import { Grid } from "@material-ui/core";
import { useEffect, useState } from "react";

import { useHistory, useParams } from "react-router";
import { DangerButton } from "../../components/DangerButton";
import { Paper } from "../../components/Paper";
import { CampusApi } from "../../domain/api/requests/CampusApi";
import { ICampus } from "../../domain/entities/campus";
import { IMessageBarCustom } from "../../domain/entities/messageBar";
import { store } from "../../domain/stores/Store";



export const ViewCampus = () => {
  const history = useHistory();

  //@ts-ignore
  const [id] = useState(useParams().id);
  const [campus, setCampus] = useState<ICampus>();
  const [updateErrorMessage, setUpdateErrorMessage] = useState('')
  const [messageBar, setMessageBar] = useState<IMessageBarCustom>({
    message: '',
    type: MessageBarType.success,
    visable: false
  });

  useEffect(() => {
    (async () => {
      try {


        let res = await CampusApi.get("/" + id);
        setCampus(res);
      } catch (error) {
      } finally {

      }
    })();
  }, []);


  const updateName = async () => {
    try {
      store.GeneralStore.dimmerOpenboolean = true
      await CampusApi.update(campus!)
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
      setUpdateErrorMessage("")
    } catch (error) {
      setUpdateErrorMessage("Chosen name is already in use.")
    } finally {
      store.GeneralStore.dimmerOpenboolean = false;
    }
  }

  const deleteCampus = async () => {
    try {
      store.GeneralStore.dimmerOpenboolean = true;
      await CampusApi.delete(campus?.id.toString()!)
      history.goBack();

    } catch (error) {

    } finally {
      store.GeneralStore.dimmerOpenboolean = false;
    }
  }


  if (!campus) return <ProgressIndicator label="Loading Item" />;
  return (
    <div>
      <h1>National Qualifications Framework</h1>
      <Grid spacing={1} container>
        <Grid item xs={12} md={12} lg={12}>
          <Paper>
            <TextField label='Name' value={campus.name} onChange={(e) => {
              setCampus({
                  ...campus,
                  name:e.currentTarget.value
              })
            }}
              errorMessage={updateErrorMessage}

            />
            <br />
            <div hidden={!messageBar.visable}>
              <MessageBar dismissButtonAriaLabel="Close" messageBarType={messageBar.type}  >
                {messageBar.message}
              </MessageBar>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
              <PrimaryButton label='Update' onClick={() => updateName()} color='Primary' >Update</PrimaryButton>
              <DangerButton text='Delete' onClick={() => deleteCampus()} />
            </div>
          </Paper>
        </Grid>

       
      </Grid>
    </div>
  );
};
