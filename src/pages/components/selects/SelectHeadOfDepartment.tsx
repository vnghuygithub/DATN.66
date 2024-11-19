import MyForm from '@/components/core/form';
import { employeeGeneralOptions, employeeHeadOfDepartmentOptions, employeeOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IEmployee {
    value: number;
    label: string;
}

const SelectEmployeeHeadOfDepartment = ({ ...props }:any) => {
    const [employee, setEmployee] = useState<IEmployee[]>([]);
    const [isMounted, setIsMounted] = useState(true); 

    useEffect(() => {
        setIsMounted(true);
        employeeHeadOfDepartmentOptions().then((res) => {
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
            label={'Trưởng phòng ban'}
            {...props}
            name="employee_parent_id"
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

export default SelectEmployeeHeadOfDepartment;
