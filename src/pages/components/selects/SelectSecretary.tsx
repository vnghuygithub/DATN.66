import MyForm from '@/components/core/form';
import { employeeOptions, secretaryOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IEmployee {
    value: number;
    label: string;
}

const SelectSecretary = ({ ...props }) => {
    const [employee, setEmployee] = useState<IEmployee[]>([]);
    const [isMounted, setIsMounted] = useState(true); 

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
            label={'Thư ký'}
            {...props}
            name="secretary_id"
            type="select"
            innerprops={{
                showSearch: true,
                placeholder: 'Vui lòng chọn',
                allowClear: true,
                loading: !employee.length,
            }}
        />
    )
}

export default SelectSecretary;
