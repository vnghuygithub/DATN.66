import MyForm from '@/components/core/form';
import { departmentOptions, parentOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IDepartment {
    value: number;
    label: string;
    parent_id: number;
    parent_name: string;
}

const SelectParentApplication = ({ parent_id,...props }:any) => {
    const [department, setDepartment] = useState<IDepartment[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        parentOptions(parent_id).then((res) => {
            if (isMounted)
                setDepartment(res);

        });
        return () => {
            setIsMounted(false);
        }
    }, [parent_id]);
    return (
        <MyForm.Item
            options={department}
            label={'Người duyệt'}
            {...props}
            name="employee_parent_id"
            type="select"
            innerprops={{
                placeholder: 'Vui lòng chọn',
                allowClear: true,
            }}


        />
    )
}

export default SelectParentApplication;