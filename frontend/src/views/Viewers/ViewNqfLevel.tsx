import { DefaultButton, MessageBar, MessageBarType, PrimaryButton, ProgressIndicator, TextField } from "@fluentui/react";
import { Grid } from "@material-ui/core";
import { QueryBuilder } from "odata-query-builder";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

import { store as nStore} from 'react-notifications-component';
import { DangerButton } from "../../components/DangerButton";
import { GenericTable } from "../../components/GenericTable";
import { NqfLevelApi } from "../../domain/api/requests/NqfLevelApi";
import { IMessageBarCustom } from "../../domain/entities/messageBar";
import { INqfLevel } from "../../domain/entities/nqfLevel";
import { store } from "../../domain/stores/Store";
import { Paper } from "../../components/Paper";




export const ViewNqfLevel = () => {
  const history = useHistory();
  let columns = [
    {
      key: "column1",
      name: "Id",
      fieldName: "id",
      minWidth: 10,
      maxWidth: 300,
      isResizable: true,
    },
    {
      key: "column2",
      name: "Name",
      fieldName: "name",
      minWidth: 10,
      maxWidth: 300,
      isResizable: true,
    },
    {
      key: "column3",
      name: "Action",
      fieldName: "action",
      minWidth: 10,
      maxWidth: 300,
      isResizable: true,
    },
  ];
  //@ts-ignore
  const [id] = useState(useParams().id);
  const [nqfLevel, setNqfLevel] = useState<INqfLevel>();
  const [loadingTableItems, setLoadingTableItems] = useState(false)
  const [updateErrorMessage, setUpdateErrorMessage] = useState('')
  const [messageBar, setMessageBar] = useState<IMessageBarCustom>({
    message: '',
    type: MessageBarType.success,
    visable: false
  });

  useEffect(() => {
    (async function getApi() {
      try {
        setLoadingTableItems(true)
        const query = new QueryBuilder().expand('Qualifications').toQuery();
        let res = await NqfLevelApi.get("/" + id + query);
        setNqfLevel(res);
      } catch (error) {
      } finally {
        setLoadingTableItems(false)
      }
    })();
  }, []);


  const updateName = async () => {
    try {
      store.GeneralStore.dimmerOpenboolean = true
      await NqfLevelApi.update(nqfLevel!)
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

  const deleteNqf = async () => {
    try {
      store.GeneralStore.dimmerOpenboolean = true;
      await NqfLevelApi.delete(nqfLevel?.id.toString()!)
      history.goBack();

    } catch (error) {

    } finally {
      store.GeneralStore.dimmerOpenboolean = false;
    }
  }


  if (!nqfLevel) return <ProgressIndicator label="Loading Item" />;
  return (
    <div>
      <h1>National Qualifications Framework</h1>
      <Grid spacing={1} container>
        <Grid item xs={12} md={2} lg={2}>
          <Paper>
            <TextField label='Name' value={nqfLevel.name} onChange={(e) => {
              setNqfLevel({
                id: nqfLevel.id,
                name: e.currentTarget.value,
                qualifications: nqfLevel.qualifications
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
              <DangerButton text='Delete' onClick={() => deleteNqf()} />
            </div>
          </Paper>
        </Grid>

        <Grid item xs={12} md={10} lg={10}>
          <Paper>
            <GenericTable data={!nqfLevel.qualifications ? [] : nqfLevel.qualifications?.map(item => {
              return {
                name: item.name,
                id: item.id,
                action: <DefaultButton onClick={() => history.push('/QualificationManager/' + item.id)} text='View' />
              }
            })} filterFileds={["name"]} loadingTableItems={loadingTableItems} columns={columns} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};
