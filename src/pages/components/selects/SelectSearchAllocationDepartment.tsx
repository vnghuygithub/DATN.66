import MyForm from '@/components/core/form';
import { departmentAllocationSearchOptions, departmentOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IDepartment {
    value: number;
    label: string;
}

const SelectSearchAllocationDepartment = ({ selectedCompanyId,required,...props }: any) => {
    const [form] = MyForm.useForm();
    const [department, setDepartment] = useState<IDepartment[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        departmentAllocationSearchOptions(selectedCompanyId).then((res) => {
            if (isMounted)
                if (!selectedCompanyId) {
                    setDepartment([]);
                    return () => {
                        setIsMounted(false);
                    }
                }
                setDepartment(res);
        });
        return () => {
            setIsMounted(false);
        }
    }, [selectedCompanyId]);
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
                loading: !department.length,
            }}
            required={required}


        />
    )
}

export default SelectSearchAllocationDepartment;