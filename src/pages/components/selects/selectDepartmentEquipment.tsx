import MyForm from '@/components/core/form';
import { departmentOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IDepartment {
    value: number;
    label: string;
}

const SelectDepartment = ({ ...props }) => {
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
            name="department"
            type="select"
            innerprops={{
                placeholder: 'Vui lòng chọn Phòng ban',
                allowClear: true,
            }}
        />
    )
}

export default SelectDepartment;