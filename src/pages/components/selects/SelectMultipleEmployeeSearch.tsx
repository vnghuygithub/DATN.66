import MyForm from '@/components/core/form';
import { companyOptions, employeeOptions } from '@/const/options';
import React from 'react';
import { getListCompany } from '@/api/shift/company';
import { getListLeaveType } from '@/api/shift/leavetype';
import { useEffect, useState } from 'react';


interface IEmployee {
    value: number;
    label: string;
}
const SelectMultipleEmployeeSearch = ({ domain_search,onChange, ...props }: any) => {

    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        employeeOptions(false,domain_search).then((res) => {
            if (isMounted)
                setEmployees(res);
        });
        return () => {
            setIsMounted(false);
        };
    }, []);


    return (
        <MyForm.Item
            options={employees}
            label={'Nhân viên'}
            {...props}
            name="employee_ids"
            type="multi-select"
            innerprops={{
                placeholder: "Vui lòng chọn nhân viên",
                allowClear: true,
                loading: !employees.length,
                onChange: (value: any) => {
                    onChange && onChange(value);
                }
            }}
        />
    );
};

export default SelectMultipleEmployeeSearch;