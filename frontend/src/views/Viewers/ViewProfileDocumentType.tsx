import { IColumn, MessageBar, MessageBarType, PrimaryButton, ProgressIndicator, TextField, Toggle } from '@fluentui/react';
import { Grid } from '@material-ui/core';
import { QueryBuilder } from 'odata-query-builder';
import { useEffect, useState, } from 'react'
import { useHistory, useParams } from 'react-router-dom';
import { GenericTable } from '../../components/GenericTable';
import { Paper } from '../../components/Paper';
import { ProfileDocumentApi } from '../../domain/api/requests/ProfileDocumentApi';
import { ProfileDocumentTypeApi} from '../../domain/api/requests/ProfileDocumentType';
import { IMessageBarCustom } from '../../domain/entities/messageBar';
import { IProfileDocument } from '../../domain/entities/profileDocument';
import { IProfileDocumentType } from '../../domain/entities/ProfileDocumentType';
import { store } from '../../domain/stores/Store';
import { theme } from '../../domain/utils/theme';

export const ViewProfileDocumentType = () => {
  let columns:IColumn[] = [
    {
      key: "column0",
      name: "",
      fieldName: "file",
      minWidth: 25,
      maxWidth: 25,
      isResizable: true,
      iconName:"https://static2.sharepointonline.com/files/fabric/assets/item-types/16/pub.svg"
    },
    {
      key: "uploaderId",
      name: "uploader Id",
      fieldName: "uploaderId",
      minWidth: 70,
      maxWidth: 75,
      isResizable: true,
    },
    {
      key: "Date Uploaded",
      name: "dateUploaded",
      fieldName: "dateUploaded",
      minWidth: 90,
      maxWidth: 90,
      isResizable: true,
    }, {
      key: "Size",
      name: "size",
      fieldName: "size",
      minWidth: 10,
      maxWidth: 50,
      isResizable: true,
    },
    {
      key: "Path",
      name: "path",
      fieldName: "path",
      minWidth: 10,
      maxWidth: 300,
      isResizable: true,
    },
    {
      key: "Status",
      name: "status",
      fieldName: "status",
      minWidth: 10,
      maxWidth: 300,
      isResizable: true,
    },
  ];
  //@ts-ignore
  //#region state
  const [id] = useState(useParams().id)
  const [profileDocumentType, setProfileDocumentType] = useState<IProfileDocumentType>()
  const [loadingTableItems, setLoadingTableItems] = useState(false)
  const [updateErrorMessage, setUpdateErrorMessage] = useState('')
  const [messageBar, setMessageBar] = useState<IMessageBarCustom>({ message: '', type: MessageBarType.success, visable: false });
  const [profileDocuments, setProfileDocuments] = useState<IProfileDocument[]>([])

  const history = useHistory()

  //#endregion

  //#region Functions
  

  useEffect(() => {
    (async function getApi() {
      try {
        setLoadingTableItems(true)
        let res = await ProfileDocumentTypeApi.get("/" + id);   
        setProfileDocumentType(res)

        let documents = await ProfileDocumentApi.getAll("?$expand=file&$filter=profileDocumentTypeId eq "+id)
        setProfileDocuments(documents)
     

      } catch (error) {
      
      } finally {
        setLoadingTableItems(false)

      }
    })();
  }, []);


  const update = async () => {
    try{
      store.GeneralStore.dimmerOpenboolean = true;
      let res = await ProfileDocumentTypeApi.update(profileDocumentType!)
      setMessageBar({
        message:"Profile Document Type Has Been Updated",
        type:MessageBarType.success,
        visable:true
      });

      setTimeout(()=>{
        setMessageBar({...messageBar,visable:false})
      },5000)
    } catch (error) {
      
    }finally{
      store.GeneralStore.dimmerOpenboolean = false;
    }
  }
  


  if (!profileDocumentType) return <ProgressIndicator label="Loading Data Item" />;
  return (
    <div>
      <h1>Profile Document</h1>
      <Grid spacing={theme.containerSpacing} container>
        <Grid item xs={12} md={3} lg={3}>
          <Paper>
            <TextField label='Name' value={profileDocumentType.name} onChange={(e) => {
              setProfileDocumentType({
                ...profileDocumentType,
                name: e.currentTarget.value,
              })
            }}
              errorMessage={updateErrorMessage}
            />
            <TextField label='Description' value={profileDocumentType.description} onChange={(e) => {
              setProfileDocumentType({
                ...profileDocumentType,
                description: e.currentTarget.value
              })
            }}
              errorMessage={updateErrorMessage}
              multiline
            />
           
            <Toggle label='Active' onText='Visable' offText='Hidden' checked={profileDocumentType.active} onChange={(e, state) => {
              setProfileDocumentType({
                ...profileDocumentType,
                //@ts-ignore
                active: state
              })
            }} />

            <div style={{ marginTop: '10px' }} hidden={!messageBar.visable}>
              <MessageBar dismissButtonAriaLabel="Close" messageBarType={messageBar.type}  >
                {messageBar.message}
              </MessageBar>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
              <PrimaryButton label='Update' onClick={() => update()} color='Primary' >Update</PrimaryButton>
            </div>

          </Paper>
        </Grid>

        <Grid item xs={12} md={9} lg={9}>
          <Paper>
     
            <GenericTable data={profileDocuments.map(item => {
              console.log(item)
              return {
                file:<img src={`https://static2.sharepointonline.com/files/fabric/assets/item-types/16/${item.file.path.substring(item.file.path.lastIndexOf('.')+1)}.svg`}/>,
        
                path:item.file.path,
                size:item.file.size +"Mb",
                uploaderId:item.file.uploaderId,
                status:item.status
              }
            })}
              filterFileds={["name"]} loadingTableItems={loadingTableItems} columns={columns} >
              
            </GenericTable>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
