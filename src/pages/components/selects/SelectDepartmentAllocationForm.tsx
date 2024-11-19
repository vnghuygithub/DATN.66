import MyForm from '@/components/core/form';
import { departmentAllocationSearchOptions, departmentOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IDepartment {
    value: number;
    label: string;
}

const SelectSearchAllocationDepartmentForm = ({ selectedCompanyId,onChange,...props }: any) => {
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
                placeholder: 'Vui lòng chọn phòng ban',
                allowClear: true,
                loading: !department.length,
                onChange: (value: any) => {
                    onChange(value);
                }
            }}
            required


        />
    )
}

export default SelectSearchAllocationDepartmentForm;