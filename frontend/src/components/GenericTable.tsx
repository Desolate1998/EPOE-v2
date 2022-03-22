import { Checkbox, DetailsList, IColumn, Icon, ProgressIndicator, TextField } from '@fluentui/react'
import React, { useEffect, useState } from 'react'



interface IProps {
    columns: IColumn[],
    data: any,
    loadingTableItems: boolean;
    filterFileds: string[]
}



export const GenericTable: React.FC<IProps> = ({ columns, data, loadingTableItems, filterFileds,children }) => {
    const [filtredData, setfiltredData] = useState<any[]>(data);
    function FilterData(e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
        let query = e.currentTarget.value;
        let list: any[] = []
        if (query !== '') {
            for (let index = 0; index < data.length; index++) {
                let itemAdded = false;
                filterFileds.forEach(item => {
                    if (item in data[index] && data[index][item].toString().toUpperCase().includes(query.toUpperCase())) {
                        if (itemAdded !== true) {
                            list.push(data[index]);
                            itemAdded = true
                        }
                    }
                });
            }
            setfiltredData(list);
        } else {
            setfiltredData(data)
        }
    }

    useEffect(() => {
        setfiltredData(data)
    }, [data])
    

    return (
        <div>
            <TextField
                iconProps={{ iconName: 'zoom' }}
                label="Search:"
                onChange={FilterData}
            />
            {children&&children}
            <br />
            {loadingTableItems && <ProgressIndicator label="Loading Data" description="Retrieving data from server" />}
            <DetailsList
                styles={{
                    root:{
                        selectors:{
                            '.ms-DetailsRow-cell': {
                                whiteSpace: 'normal',
                                textOverflow: 'clip',
                                lineHeight: 'normal',
                            },
                            '.ms-DetailsHeader-cellTitle': {
                                height: '100%',
                                alignItems: 'center',
                            },
                        }
                    }
                }}
                items={filtredData}
                columns={columns}
            />
        </div>
    )
}
