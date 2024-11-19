import MyForm from '@/components/core/form';
import { currentShiftOptions, employeeOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IEmployee {
    value: number;
    label: string;
}

const SelectCurrentShift = ({ ...props }) => {
    const [employee, setEmployee] = useState<IEmployee[]>([]);
    const [isMounted, setIsMounted] = useState(true); 

    useEffect(() => {
        setIsMounted(true);
        currentShiftOptions().then((res) => {
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
            label={'Ca hiện tại'}
            {...props}
            name="current_shift_id"
            type="select"
            innerprops={{
                showSearch: true,
                allowClear: true,
                disabled: true,
                loading: !employee.length,
            }}
        />
    )
}

export default SelectCurrentShift;
