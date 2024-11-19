import MyForm from '@/components/core/form';
import { employeeGeneralOptions, employeeOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IEmployee {
    value: number;
    label: string;
}

const SelectEmployeeGeneralManager = ({ ...props }:any) => {
    const {checkUpdate }= props;
        const [employee, setEmployee] = useState<IEmployee[]>([]);
    const [isMounted, setIsMounted] = useState(true); 

    useEffect(() => {
        setIsMounted(true);
        employeeGeneralOptions().then((res) => {
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
            label={'HCNS Quản lý'}
            {...props}
            name="hr_manager"
            type="select"
            innerprops={{
                disabled: checkUpdate,
                showSearch: true,
                placeholder: 'Vui lòng chọn',
                allowClear: true,
                loading: !employee.length,
            }}
            
        />
    )
}

export default SelectEmployeeGeneralManager;
