export interface IPageSettings{
   pageName:string;
   backgroundImage?:string;
   backgroundColor?:string;
}

export interface IView {
    pageSettings:IPageSettings;
}

export function pageSetup(settings:IPageSettings){
    document.title =settings.pageName;

    if(settings.backgroundImage!==undefined)
        document.body.style.backgroundImage = `URL(${settings.backgroundImage})`;
        else         document.body.style.backgroundImage = ``;

    
    if(settings.backgroundColor!==undefined)
        document.body.style.backgroundColor = settings.backgroundColor;
    
}
