import MyForm from '@/components/core/form';
import { departmentOptions, parentOptions, parentOptionsNoArgs } from '@/const/options';
import { useEffect, useState } from 'react';

interface IDepartment {
    value: number;
    label: string;
}

const SelectParentUpdate = ({ employeeId,...props }:any) => {
    const {checkUpdate}= props;
    const [department, setDepartment] = useState<IDepartment[]>([]);
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        parentOptionsNoArgs(employeeId).then((res) => {
            if (isMounted)
                setDepartment(res);

        });
        return () => {
            setIsMounted(false);
        }
    }, []);
    return (
        <MyForm.Item
        
            options={department}
            label={'Người duyệt'}
            {...props}
            name="employee_parent_id"
            type="select"
            
            innerprops={{
                disabled: checkUpdate,
                
                placeholder: 'Vui lòng chọn',
                allowClear: true,
            }}


        />
    )
}

export default SelectParentUpdate;