import {
  DefaultButton,
  DialogContentBase,
  IColumn,
  MessageBar,
  MessageBarType,
  ProgressIndicator,
  DialogFooter,
  PrimaryButton,
  IconButton,
  CommandBarButton
} from "@fluentui/react";

import React, { useEffect, useState } from "react";
import { DialogGlass } from "../../components/DialogGlass";
import { GenericTable } from "../../components/GenericTable";
import { Paper } from "../../components/Paper";
import { UploadProfileDocumentCard } from "../../components/UploadProfileDocumentCard";
import IStudentProfileDocumentInfo from "../../domain/api/Data Transfer Objects/StudentProfileDocumentInfo";
import { ProfileDocumentApi } from "../../domain/api/requests/ProfileDocumentApi";
import { ProfileDocumentTypeApi } from "../../domain/api/requests/ProfileDocumentType";
import { IProfileDocument } from "../../domain/entities/profileDocument";
import { store } from "../../domain/stores/Store";

export const UploadProfileDocuments = () => {
  let fileUploadRef: HTMLElement | null =null;

  const [dialogInfo, setDialogInfo] = useState({
    title:"",
    description:"Upload your student CV",
    open:false,
    fileName:"meh.txt",
    profileDocumentId:-1
  });
  const [file, setFile] = useState<File|null>(null)
  const [profileDocuments, setProfileDocuments] = useState<
    IStudentProfileDocumentInfo[]
  >([]);

  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        let res = await ProfileDocumentApi.getStudentProfileDocuments();
        setProfileDocuments([...res]);
        console.log(res)
      } catch (error) {
      } finally {
        setisLoading(false);
      }
    })();
  }, []);

  return (
    <div style={{paddingBottom:'100px'}}>
      <h1>Profile Documents</h1>
      <DialogGlass open={dialogInfo.open} subText={dialogInfo.description} title={dialogInfo.title}>
        <DialogContentBase>
          <CommandBarButton label='Upload' style={{padding:'10px'}} iconProps={{iconName:'upload'}} onClick={ () => {
            fileUploadRef?.click();
          }}>Upload</CommandBarButton>
          <input ref={ref => fileUploadRef=ref} type={'file'} hidden   onChange={(e) => {
                //@ts-ignore
                var file = e.target.files[0]
                setFile(file)
                setDialogInfo({...dialogInfo,fileName:file.name})
              }}/>
          <br />
          <small><b>File Name:</b> {dialogInfo.fileName}</small>
        </DialogContentBase>
        <DialogFooter>
        <DefaultButton onClick={() => {
            setDialogInfo({...dialogInfo,open:false,fileName:''})
            setFile(null)
          }}>Close</DefaultButton>
          <PrimaryButton disabled={file===null} onClick={async ()=>{
              let formData = new FormData();
              formData.append('file',file!);
              //@ts-ignore
              formData.append('profileDocumentTypeId',dialogInfo.profileDocumentId!)
              try {
                store.GeneralStore.dimmerOpenboolean = true;
                let res = await ProfileDocumentApi.uploadProfileDocument(formData);
              } catch (error) {
                console.log(error)
              }finally{
                store.GeneralStore.dimmerOpenboolean = false;
              }
          }} >Submit</PrimaryButton>
        </DialogFooter>
      </DialogGlass>
      <MessageBar
        messageBarType={MessageBarType.info}
        messageBarIconProps={{ iconName: "info" }}
      >
        Upload the required student documents. After a document has been
        uploaded it will be sent for verification. Any Documents that do not
        pass the verification will need to be submitted
      </MessageBar>
      <br />
           {isLoading && <ProgressIndicator />}
           {profileDocuments.map((item) => {
        return <UploadProfileDocumentCard setDialogInfo={setDialogInfo} profileDocument={item} />;
      })}
    </div>
  );
};
