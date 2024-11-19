import MyForm from '@/components/core/form';
import { workHourOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IWorkHour {
    value: number;
    label: string;
}

const SelectWorkHour = ({ disabled,...props }:any) => {
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
            required
            innerprops={{
                disabled: disabled,
                placeholder: 'Vui lòng chọn',
                allowClear: true,
                loading: !workHour.length,
            }}
        />
    )
}

export default SelectWorkHour;