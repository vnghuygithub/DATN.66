import MyForm from '@/components/core/form';
import { departmentOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IDepartment {
    value: number;
    label: string;
}

const SelectDepartmentContract = ({ ...props }) => {
    const [department, setDepartment] = useState<IDepartment[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        departmentOptions().then((res) => {
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
            label={'Phòng ban'}
            {...props}
            name="department_id"
            type="select"
            innerprops={{
                placeholder: 'Vui lòng chọn',
                allowClear: true,
                disabled: true
            }}


        />
    )
}

export default SelectDepartmentContract;