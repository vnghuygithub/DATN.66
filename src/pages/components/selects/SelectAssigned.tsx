import MyForm from '@/components/core/form';
import { employeeOptions } from '@/const/options';
import { useEffect, useState } from 'react';
import { Col } from 'antd';

interface IEmployee {
    value: number;
    label: string;
}

const SelectAssigned = ({ isCreating, ...props }: any) => {
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
            label={'Nhân viên'}
            {...props}
            name={"approval_assigned_to"}
            type="select"
            required
            innerprops={{
                disabled: !isCreating,
                showSearch: true,
                placeholder: 'Vui lòng chọn',
                allowClear: true,
                loading: !employee.length,
            }}
        />
    )
}

export default SelectAssigned;
