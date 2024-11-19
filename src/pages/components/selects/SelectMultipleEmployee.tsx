import MyForm from '@/components/core/form';
import { companyOptions, employeeOptions, employeeOptionsAllocations } from '@/const/options';
import React from 'react';
import { getListCompany } from '@/api/shift/company';
import { getListLeaveType } from '@/api/shift/leavetype';
import { useEffect, useState } from 'react';


interface IEmployee {
    value: number;
    label: string;
}
const SelectMultipleEmployee = ({ selectedCurrentDepartmentId,...props }: any) => {

    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        employeeOptionsAllocations(selectedCurrentDepartmentId).then((res) => {
            if (isMounted) {
                if (!selectedCurrentDepartmentId) {
                    setEmployees([]);
                    return () => {
                        setIsMounted(false);
                    }
                }
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
                showSearch: true,
                placeholder: "Vui lòng chọn nhân viên",
                allowClear: true,
                loading: !employees.length,
            }}
            required
        />
    );
};

export default SelectMultipleEmployee;