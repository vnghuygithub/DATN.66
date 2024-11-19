import MyForm from '@/components/core/form';
import { companyOptions, employeeMultipleAllocationOptions, employeeOptions, employeeOptionsAllocations, employeeOptionsAllocationsCurrent } from '@/const/options';
import React from 'react';
import { getListCompany } from '@/api/shift/company';
import { getListLeaveType } from '@/api/shift/leavetype';
import { useEffect, useState } from 'react';


interface IEmployee {
    value: number;
    label: string;
}
const SelectMultipleEmployeeAllocation = ({ selectedCurrentCompanyId,...props }: any) => {

    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        employeeMultipleAllocationOptions(selectedCurrentCompanyId).then((res) => {
            if (isMounted) {
                setEmployees(res);
            }
        });
        return () => {
            setIsMounted(false);
        };
    }, [selectedCurrentCompanyId]);


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

export default SelectMultipleEmployeeAllocation;