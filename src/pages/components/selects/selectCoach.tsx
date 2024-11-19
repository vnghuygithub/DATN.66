import MyForm from '@/components/core/form';
import { employeeOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IEmployee {
    value: number;
    label: string;
}

const SelectCoach = ({ disabled,...props }:any) => {
    const [employee, setEmployee] = useState<IEmployee[]>([]);
    const [isMounted, setIsMounted] = useState(true); 
    const initialValue = props.initialValue ? props.initialValue : '';
    useEffect(() => {
        setIsMounted(true);
        employeeOptions().then((res) => {
            if (isMounted) { 
                setEmployee(res);
            }
        });

        return () => {
            setIsMounted(false);
        };
    }, []);

    return (
        <MyForm.Item
            options={employee}
            label={'Người huấn luyện'}
            {...props}
            name="coach_id"
            type="select"
            innerprops={{
                disabled: disabled,
                showSearch: true,
                placeholder: 'Vui lòng chọn',
                allowClear: true,
                loading: !employee.length,
                defaultValue: initialValue,
            }}
            initialValue={initialValue}
        />
    )
}

export default SelectCoach;
