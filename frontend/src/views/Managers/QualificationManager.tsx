import { DetailsList, DetailsListLayoutMode, IColumn, PrimaryButton, TextField, Label, ComboBox, IComboBoxOption, DefaultButton, Dropdown, MessageBar, MessageBarType, Checkbox, ColumnDragEndLocation, ColumnActionsMode, ChoiceGroup, IChoiceGroupOption } from '@fluentui/react'
import { Grid } from '@material-ui/core'
import { useFormik } from 'formik'
import { QueryBuilder } from 'odata-query-builder'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { GenericTable } from '../../components/GenericTable'
import { Paper } from '../../components/Paper'
import { IQualificationCreateRequest } from '../../domain/api/contracts/qualificationCreateRequest'
import { NqfLevelApi } from '../../domain/api/requests/NqfLevelApi'
import { QualificationApi } from '../../domain/api/requests/QualificationApi'
import { INqfLevel } from '../../domain/entities/nqfLevel'
import { IQualification } from '../../domain/entities/qualification'
import { store } from '../../domain/stores/Store'
import { theme } from '../../domain/utils/theme'

export const QualificationManager = () => {
    const history = useHistory();
    const [loadingTableItems, setLoadingTableItems] = useState(false)
    const [qualifications, setQualifications] = useState<IQualification[]>([])
    const [nqfLevels, setNqfLevels] = useState<INqfLevel[]>([])
    const [messageBarCreated, setMessageBarCreated] = useState(false)
    const [activeFilter, setActiveFilter] = useState<'0' | '1' | '2'>('0')
    const [nqfLevelFilter, setnqfLevelFilter] = useState<number>(-1)
    const [qualificationsFiltred, setQualificationsFiltred] = useState<IQualification[]>([])



    let columns: IColumn[] = [
        { key: 'id', name: 'ID', fieldName: 'id', minWidth: 10, maxWidth: 50, isResizable: true },
        { key: 'name', name: 'Name', fieldName: 'name', minWidth: 10, maxWidth: 100, isResizable: true },
        { key: 'description', name: 'Description', fieldName: 'description', minWidth: 10, maxWidth: 100, isResizable: true },
        { key: 'column2', name: 'NQF', fieldName: 'nqf', minWidth: 10, maxWidth: 50, isResizable: true },
        { key: 'column3', name: 'Active ', fieldName: 'active', minWidth: 10, maxWidth: 50, isResizable: true, },
        { key: 'column4', name: 'Action', fieldName: 'action', minWidth: 10, maxWidth: 100, isResizable: true }
    ]


    function setActiveFilterData(activeKey: '0' | '1' | '2' | null, nqflevelKey: number | null = null) {
        if (activeKey == null) {
            activeKey = activeFilter
        }
        if (nqflevelKey == null) {
            nqflevelKey = nqfLevelFilter
        }
        var data = qualifications
        if (activeKey === '1') {
          data =data.filter(x => x.active);
        } else if (activeKey === '2') {
            data =  data.filter(x => !x.active)
        }

        if (nqflevelKey != -1) {
            data =  data.filter(x => x.nqfLevelId === nqflevelKey);
        }
        console.log(data)
        setQualificationsFiltred(data)
    }





    useEffect(() => {
        (async function getApi() {
            try {
                setLoadingTableItems(true)
                let query = new QueryBuilder().expand('nqflevel').toQuery();
                let qualificationsRes = await QualificationApi.getList(query);
                setQualifications(qualificationsRes)
                setQualificationsFiltred(qualificationsRes)
                let nqfLevelRes = await NqfLevelApi.getAll('');
                setNqfLevels(nqfLevelRes);
                formik.setFieldValue('nqfLevelId', nqfLevelRes[0].id)
            } catch (error) {
            } finally {
                setLoadingTableItems(false)
            }
        })();
    }, [])


    let formik = useFormik<IQualificationCreateRequest>({
        initialValues: {
            name: '',
            nqfLevelId: nqfLevels[0] ? nqfLevels[0].id : -1,
            description: ''
        },

        onSubmit: async (values) => {
            store.GeneralStore.dimmerOpenboolean = true;
            try {
                await QualificationApi.post(values)
                formik.resetForm()
                setMessageBarCreated(true);
                setTimeout(() => setMessageBarCreated(false), 2000)
                setLoadingTableItems(true)
                let query = new QueryBuilder().expand('nqflevel').toQuery();
                let qualificationsRes = await QualificationApi.getList(query);
                setQualifications([...qualificationsRes])
                setQualificationsFiltred([...qualificationsRes])
            } catch (error) {
                //@ts-ignore
                formik.errors.name = error.response?.data.message
            }
            finally {
                setLoadingTableItems(false)
                store.GeneralStore.dimmerOpenboolean = false;
            }

        },
        validateOnChange: false,
        validate: values => {
            let errors: any = {}
            if (values.name.split(' ').join('') === '') {
                errors.name = 'Required'
            }

            return errors
        }

    })

    return (
        <div>
            <h1>Qualifications</h1>
            <Grid container spacing={theme.containerSpacing}>
                <Grid item sm={12} lg={7} >
                    <Paper>
                        <GenericTable columns={columns} data={qualificationsFiltred.map(item => {
                            return {
                                name: item.name,
                                nqf: item.nqfLevel?.name,
                                action: <DefaultButton onClick={() => history.push('/QualificationManager/' + item.id)} text='View' />,
                                active: item.active,
                                description: item.description,
                                id: item.id
                            }
                        })} filterFileds={["name", "id", "active"]} loadingTableItems={loadingTableItems} >
                            <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
                                <Dropdown
                                    style={{ width: '200px', marginRight: '10px' }}
                                    label="Active Filter"
                                    selectedKey={activeFilter}
                                    options={
                                        [
                                            { key: '0', text: 'All' },
                                            { key: '1', text: 'Active' },
                                            { key: '2', text: 'InActive' },

                                        ]
                                    }
                                    onChange={(e, value) => {
                                        //@ts-ignore
                                        setActiveFilter(value.key)
                                        //@ts-ignore
                                        setActiveFilterData(value.key)
                                    }}


                                />
                                <Dropdown
                                    label="NQF level"
                                    style={{ width: '200px' }}
                                    selectedKey={nqfLevelFilter}
                                    options={

                                        [{ text: 'None', key: '-1' }, ...nqfLevels.map(item => {
                                            return {
                                                key: item.id,
                                                text: item.name
                                            }
                                        })
                                        ]}
                                    onChange={(e, value) => {
                                        //@ts-ignore
                                        setnqfLevelFilter(value.key)
                                        //@ts-ignore
                                        setActiveFilterData(null, value.key)
                                    }}


                                />
                            </div>
                        </GenericTable>

                    </Paper>
                </Grid>

                <Grid item sm={12} lg={5}>
                    <Paper>
                        <form onSubmit={formik.handleSubmit}>
                            <h2>Create New Qualification</h2>
                            <TextField
                                label="Qualification Name"
                                onChange={formik.handleChange}
                                name='name'
                                value={formik.values.name}
                                errorMessage={formik.errors.name}
                            />

                            <TextField
                                resizable={true}
                                label="Description"
                                onChange={formik.handleChange}
                                name='description'
                                multiline
                                value={formik.values.description}
                                errorMessage={formik.errors.description}
                            />
                            <Dropdown
                                label="NQF level"
                                selectedKey={formik.values.nqfLevelId}
                                options={
                                    nqfLevels.map(item => {
                                        return {
                                            key: item.id,
                                            text: item.name
                                        }
                                    })
                                }
                                onChange={(e, value) => {
                                    formik.setFieldValue('nqfLevelId', value?.key)
                                }}

                                errorMessage={formik.errors.nqfLevelId}
                            />
                            <br />
                            {
                                messageBarCreated ? (<MessageBar messageBarType={MessageBarType.success}
                                    truncated={true}>
                                    Qualification has been created
                                </MessageBar>) : ''
                            }
                            <br />
                            <PrimaryButton type='submit' text='Submit' style={{ width: '40%' }} />
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}
