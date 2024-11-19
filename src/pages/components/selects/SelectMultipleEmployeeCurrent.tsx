import MyForm from '@/components/core/form';
import { companyOptions, employeeOptions, employeeOptionsAllocations, employeeOptionsAllocationsCurrent } from '@/const/options';
import React from 'react';
import { getListCompany } from '@/api/shift/company';
import { getListLeaveType } from '@/api/shift/leavetype';
import { useEffect, useState } from 'react';


interface IEmployee {
    value: number;
    label: string;
}
const SelectMultipleEmployeeCurrent = ({ selectedCurrentDepartmentId,...props }: any) => {

    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        employeeOptionsAllocationsCurrent().then((res) => {
            if (isMounted) {
                setEmployees(res);
            }
        });
        return () => {
            setIsMounted(false);
        };
    }, [selectedCurrentDepartmentId]);


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
            }}
            required
        />
    );
};

export default SelectMultipleEmployeeCurrent;