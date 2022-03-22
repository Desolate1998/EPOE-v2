import { IColumn, TextField, PrimaryButton, DefaultButton, MessageBar, MessageBarType } from '@fluentui/react'
import { Grid } from '@material-ui/core'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { Paper } from '../../components/Paper'
import { NqfLevelApi } from '../../domain/api/requests/NqfLevelApi'
import { QueryBuilder } from 'odata-query-builder'
import INqfCreateRequerst from '../../domain/api/contracts/nqfCreateRequest'
import { } from '../..'
import { store } from '../../domain/stores/Store'
import { observer } from 'mobx-react-lite'
import { INqfLevel } from '../../domain/entities/nqfLevel'
import { GenericTable } from '../../components/GenericTable'
import { useHistory } from 'react-router'
import { theme } from '../../domain/utils/theme'

const NqfManager = () => {


    let columns: IColumn[] = [
        { key: 'column1', name: 'Id', fieldName: 'id', minWidth: 10, maxWidth: 100, isResizable: true },
        { key: 'column2', name: 'Name', fieldName: 'name', minWidth: 10, maxWidth: 200, isResizable: true },
        { key: 'column3', name: 'Action', fieldName: 'action', minWidth: 10, maxWidth: 200, isResizable: true }
    ]
    const [NqfLevels, setNqfLevels] = useState<any[]>([])
        const [messageBarCreated, setMessageBarCreated] = useState(false)
    const [loadingTableItems, setLoadingTableItems] = useState(false)


    const history = useHistory();

   

    useEffect(() => {
        GetNQFList();
    }, [])



    const formik = useFormik<INqfCreateRequerst>({
        initialValues: {
            name: ''
        },
        validateOnChange: false,
        onSubmit: async (value) => {
            store.GeneralStore.dimmerOpenboolean = true;
            try {
                await NqfLevelApi.post(value)
                formik.resetForm()
                setMessageBarCreated(true);
                setTimeout(() => setMessageBarCreated(false), 2000)
                setLoadingTableItems(true)
                GetNQFList()
            } catch (error) {
                //@ts-ignore
                formik.errors.name = error.response?.data.message
            }
            finally {
                value = {
                    name: ''
                }
                store.GeneralStore.dimmerOpenboolean = false;
            }
        },

        validate: values => {
            let errors: any = {}
            if (values.name.split(' ').join('') === '') {
                errors.name = 'Required'
            }
            return errors
        }
    })




    async function GetNQFList() {
        setLoadingTableItems(true)
        const query = new QueryBuilder().select("name,id").toQuery()
        try {
            let res: INqfLevel[] = await NqfLevelApi.getAll(query);
            console.log(res)
            let data = res.map(item => {
                return {
                    name: item.name,
                    id: item.id,
                    action: <DefaultButton onClick={() => history.push('/NqfManager/' + item.id)} text='View' />
                }
            });
            setNqfLevels(data)
        } catch (error) {
            alert('error fetching data')
        } finally {
            setLoadingTableItems(false)
        }
    }


    return (
        <div>
            <h1>NQF Levels</h1>
            <Grid container spacing={theme.containerSpacing}>
                <Grid item sm={12} lg={7} >
                    <Paper>
                        <GenericTable columns={columns} data={NqfLevels} filterFileds={["name", "id"]} loadingTableItems={loadingTableItems} />
                    </Paper>
                </Grid>

                <Grid item sm={12} lg={5}>
                    <Paper>
                        <form onSubmit={formik.handleSubmit}>
                            <h3>Create New NQF Level</h3>
                            <TextField
                                onChange={formik.handleChange}
                                label="NQF Level Name"
                                name='name'
                                value={formik.values.name}
                                errorMessage={formik.errors.name}
                            />
                            <br />
                            {
                                messageBarCreated ? (<MessageBar messageBarType={MessageBarType.success}
                                    truncated={true}>
                                    NQF has been created
                                </MessageBar>) : ''
                            }
                            <br />
                            <PrimaryButton type='submit' text='Submit' style={{ width: '100%' }} />
                        </form>
                    </Paper>
                    <br />

                </Grid>
            </Grid>



        </div>
    )
}

export default observer(NqfManager)
