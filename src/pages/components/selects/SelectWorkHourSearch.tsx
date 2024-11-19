import MyForm from '@/components/core/form';
import { workHourOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IWorkHour {
    value: number;
    label: string;
}

const SelectWorkHourSearch = ({ disabled,...props }:any) => {
    const [workHour, setWorkHour] = useState<IWorkHour[]>([]);
    useEffect(() => {
        workHourOptions().then((res) => {
            setWorkHour(res);
        });
    }, []);
    return (
        <MyForm.Item
            options={workHour}
            label={'Giờ làm việc'}
            {...props}
            name="resource_calendar_id"
            type="select"
            innerprops={{
                disabled: disabled,
                placeholder: 'Vui lòng chọn',
                allowClear: true,
                loading: !workHour.length,
            }}
        />
    )
}

export default SelectWorkHourSearch;