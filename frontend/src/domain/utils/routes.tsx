
import { CampusManager } from "../../views/Managers/CampusManager";
import { Dashboard } from "../../views/Dashboard";
import Login from "../../views/Login";
import NqfManager from "../../views/Managers/NqfManager";

import Register from "../../views/Register";
import { ViewActivity } from "../../views/Viewers/ViewActivity";

import { store } from "../stores/Store";
import { IRoute } from "./IRoute";
import { QualificationManager } from "../../views/Managers/QualificationManager";
import { ViewCampus } from "../../views/Viewers/ViewCampus";
import { ViewModule } from "../../views/Viewers/ViewModule";
import { ViewNqfLevel } from "../../views/Viewers/ViewNqfLevel";
import { ViewQualification } from "../../views/Viewers/ViewQualification";
import { UserType } from "../enums/UserType";
import { UserManager } from "../../views/Managers/UserManager";
import { ViewProfile } from "../../views/Viewers/ViewProfile";
import { StudentProfileDocumentTypeManager } from "../../views/Managers/StudentProfileDocumentTypeManager";
import { ViewProfileDocumentType } from "../../views/Viewers/ViewProfileDocumentType";
import { UploadProfileDocuments } from "../../views/Actions/UploadProfileDocuments";

//Do routing rendering conditions here
function getRoutes(): IRoute[] {
    let routes: IRoute[] = [];
    if (store.AuthenticationStore.user.token === '') {
        //register
        routes.push({
            path: '/Register',  
            component: <Register />,
            name: 'Register',
            mapped: true
        });

        //login
        routes.push({
            path: '*',
            component: <Login />,
            name: 'login',
            mapped: true

        });
    } else {


        routes.push({
            path: '/',
            component: <Dashboard />,
            name:  'Dashboard',
            mapped: true,
            icon:'ViewDashboard'

        });

        routes.push({
            path:'/ViewProfile',
            component:<ViewProfile/>,
            mapped:false,
            name:'My Profile',
        });

        switch (store.AuthenticationStore.user.userType) {
            case UserType.Admin:
                routes.push({
                    path: '/Qualifications',
                    component: <QualificationManager />,
                    name: 'Qualifications Manager',
                    mapped: true,
                    icon:'Edit'
                });

                
        routes.push({
            path:'/StudentProfileDocumentsManager/:id',
            component:<ViewProfileDocumentType/>,
            mapped:false,
            name:'View Profile Document Type',
        });
                routes.push({
                    path: '/NqfManager',
                    name: 'NQF level Manager',
                    component: <NqfManager />,
                    icon:'Edit',
                    mapped: true
                })
                routes.push({
                    path: '/StudentProfileDocumentsManager',
                    name: 'Profile Documents Manager',
                    component: <StudentProfileDocumentTypeManager
                     />,
                    icon:'Edit',
                    mapped: true
                })
                routes.push({
                    path: '/NqfManager/:id',
                    name: 'NQF level Manager',
                    component: <ViewNqfLevel />,
                    mapped: false
                })

                routes.push({
                    path: '/QualificationManager/:id',
                    name: 'Qualification Manager',
                    component: <ViewQualification />,
                    mapped: false
                })

                routes.push({
                    path: '/QualificationManager/Module/:id',
                    name: 'Module',
                    component: <ViewModule />,
                    mapped: false
                })

                routes.push({
                    path: '/QualificationManager/Activity/:id',
                    name: 'Activity',
                    component: <ViewActivity />,
                    mapped: false
                })

                routes.push({
                    path: '/CampusManager',
                    name: 'Campus Manager',
                    component: <CampusManager />,
                    mapped: true,

                
                    icon:'edit'
                })

                routes.push({
                    path: '/CampusManager/Campus/:id',
                    name: 'Campus',
                    component: <ViewCampus />,
                    mapped: false,
                })

                routes.push({
                    path:'/UsersManager',
                    component:<UserManager/>,
                    mapped:true,
                    name:'User Manager',
                    icon:'UserGauge'
                })
                break;
            case UserType.AcademicPrinciple:

                break;
                case UserType.Student :
                    routes.push({
                        path:'/UploadProfileDocuments',
                        component:<UploadProfileDocuments/>,
                        mapped:true,
                        name:'Profile Documents',
                        icon:'Upload'
                    })
                break;

            default:
                break;
        }
 }

    return routes;
}

export default getRoutes

