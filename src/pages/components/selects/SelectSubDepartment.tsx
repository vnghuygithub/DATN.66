import MyForm from '@/components/core/form';
import { departmentOptions, subDepartmentOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IDepartment {
    value: number;
    label: string;
}

const SelectSubDepartment = ({ disabled,selectedSubCompany,...props }:any) => {
    const [department, setDepartment] = useState<IDepartment[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        subDepartmentOptions(selectedSubCompany).then((res) => {
            if (isMounted) {
                setDepartment(res);
            }
        });
        return () => {
            setIsMounted(false);
        }
    }, [selectedSubCompany]);

    return (
        <MyForm.Item
            options={department}
            label={'Phòng ban kiêm nhiệm'}
            {...props}
            name="part_time_department_id"
            type="select"
            innerprops={{
                disabled: disabled,
                placeholder: 'Vui lòng chọn',
                allowClear: true,
                loading: !department.length,
            }}


        />
    )
}

export default SelectSubDepartment;