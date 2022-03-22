import React, { useEffect, useState } from "react";
import IStudentProfileDocumentInfo from "../domain/api/Data Transfer Objects/StudentProfileDocumentInfo";
import { IProfileDocument } from "../domain/entities/profileDocument";
import { Paper } from "./Paper";
import uploadProfileMissing from "../resources/images/UploadProfile.png";
import uploadProfilePending from "../resources/images/UploadProfilePending.png";
import uploadProfileError from "../resources/images/UploadProfileError.png";
import uploadProfileDone from "../resources/images/UploadProfileDone.png";
import { Grid } from "@material-ui/core";
import { DefaultButton, MessageBar,  PrimaryButton } from "@fluentui/react";
import { FileApi } from "../domain/api/requests/FileApi";

interface IProps {
  profileDocument: IStudentProfileDocumentInfo;
  setDialogInfo:(item:any)=>void;
}

export const UploadProfileDocumentCard: React.FC<IProps> = ({
  profileDocument,
  setDialogInfo
}) => {
  const [imgSrc, setImgSrc] = useState<string>(uploadProfileMissing);

  useEffect(() => {
    switch (profileDocument.status) {
      case "Missing":
        setImgSrc(uploadProfileMissing);
        break;
      case "Done":
        setImgSrc(uploadProfileDone);

        break;
      case "Error":
        setImgSrc(uploadProfileError);
        break;
      case "Pending":
        setImgSrc(uploadProfilePending);

        break;
      default:
        break;
    }
  }, []);

  return (
    <div>
      <Paper style={{ margin: "5px" }}>
        <Grid container>
          <Grid item md={2} xs={12}>
            <img src={imgSrc} style={{ maxHeight: "150px" }} alt={""} />
          </Grid>
          <Grid item md={5} xs={12}>
            <div>
              <h3>{profileDocument.documentName}</h3>
              {profileDocument.documentDescription!=="" && <MessageBar>{profileDocument.documentDescription} </MessageBar>}
              <h4 style={{fontWeight:'normal'}}>Comment</h4>
              <p> {profileDocument.comment}</p>
            </div>
          </Grid>
          <Grid item md={5} xs={12} >
           <div style={{height:'100%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
              <DefaultButton disabled={profileDocument.fileId===null} onClick={async ()=>{
                console.log(profileDocument.fileId);
                let res = await FileApi.get(profileDocument.fileId.toString(),profileDocument.fileName);
              }}>Download</DefaultButton>
              <PrimaryButton onClick={()=>{
                setDialogInfo({
                  title:profileDocument.documentName,
                  description:profileDocument.documentDescription,
                  open:true,
                  fileName:"",
                  profileDocumentId:profileDocument.profileDocumentId
                })
              }} disabled={profileDocument.status==="Done"}>Upload</PrimaryButton>
              <input type='file' hidden />
             </div> 
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};
