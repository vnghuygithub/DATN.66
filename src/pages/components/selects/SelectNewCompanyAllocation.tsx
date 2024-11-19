import MyForm from '@/components/core/form';
import { companyOptions, newCompanyAllocationOptions, newCompanyOptions } from '@/const/options';
import React from 'react';
import { getListCompany } from '@/api/shift/company';
import { getListLeaveType } from '@/api/shift/leavetype';
import { useEffect, useState } from 'react';


interface ICompany {
    value: number;
    label: string;
}
const SelectNewCompanyAllocation = ({ onChange,selectedCurrentCompanyId, ...props }: any) => {

    const [company, setCompany] = useState<ICompany[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        newCompanyAllocationOptions(selectedCurrentCompanyId).then((res) => {
            if (isMounted)
                setCompany(res);
        });
        return () => {
            setIsMounted(false);
        };
    }, [selectedCurrentCompanyId]);


    return (
        <MyForm.Item
            options={company}
            label={'Công ty chuyển đến'}
            {...props}
            name="company_id"
            type="select"
            innerprops={{
                placeholder: "Vui lòng chọn công ty",
                allowClear: true,
                loading: !company.length,
                onChange: (value: number) => {
                    console.log(value)
                    onChange(value)
                }
            }}
            required
        />
    );
};

export default SelectNewCompanyAllocation;