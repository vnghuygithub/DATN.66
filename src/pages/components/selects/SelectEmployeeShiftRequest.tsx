import MyForm from '@/components/core/form';
import { employeeOptions } from '@/const/options';
import { useEffect, useState } from 'react';
import { Col } from 'antd';

interface IEmployee {
    value: number;
    label: string;
}

const SelectEmployeeShiftRequest = ({ domain_search,onChange, ...props }: any) => {
    const [employee, setEmployee] = useState<IEmployee[]>([]);
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        employeeOptions("",domain_search).then((res) => {
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
            name="employee_id"
            type="select"
            innerprops={{
                showSearch: true,
                placeholder: 'Vui lòng chọn',
                allowClear: true,
                loading: !employee.length,
                onChange: (value: any) => {
                    onChange(value);
                },
            }}
            required
        />
    )
}

export default SelectEmployeeShiftRequest;
