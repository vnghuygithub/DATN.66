import MyForm from '@/components/core/form';
import { companyOptions, companyOptionsByEmployeeId } from '@/const/options';
import React from 'react';
import { getListCompany } from '@/api/shift/company';
import { getListLeaveType } from '@/api/shift/leavetype';
import { useEffect, useState } from 'react';


interface ICompany {
    value: number;
    label: string;
}
const SelectCompanyByEmployeeId = ({ onChange,employeeId, ...props }: any) => {

    const [company, setCompany] = useState<ICompany[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        companyOptionsByEmployeeId(employeeId).then((res) => {
            if (!employeeId) {
                setCompany([]);
                setIsMounted(false);
                return;
            }
                setCompany(res);
            
            setIsMounted(false);
        });
        return () => {
            setIsMounted(false);
        }
    }, [employeeId]);


    return (
        <MyForm.Item
            options={company}
            label={'Công ty'}
            {...props}
            name="company_id"
            type="select"
            innerprops={{
                showSearch: true,
                allowClear: true,
                loading: !company.length,
                onChange: (value: any) => {
                    onChange(value);
                }
            }}
            required
        />
    );
};

export default SelectCompanyByEmployeeId;