import MyForm from '@/components/core/form';
import { companyOptions, companyOptionsAll } from '@/const/options';
import React from 'react';
import { getListCompany } from '@/api/shift/company';
import { getListLeaveType } from '@/api/shift/leavetype';
import { useEffect, useState } from 'react';


interface ICompany {
    value: number;
    label: string;
}
const SelectCompanyAllAllocation = ({ disabled,onChange,...props }:any) => {

    const [company, setCompany] = useState<ICompany[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        companyOptionsAll().then((res) => {
            if (isMounted)
                setCompany(res);
        });
        return () => {
            setIsMounted(false);
        };
    }, []);


    return (
        <MyForm.Item
            options={company}
            label={'Công ty'}
            {...props}
            name="current_company_id"
            type="select"
            innerprops={{
                disabled: disabled,
                allowClear: true,
                loading: !company.length,
                placeholder: "Chọn công ty",
                onChange: (value: any) => {
                    onChange(value);
                }
            }}
            required


        />
    );
};

export default SelectCompanyAllAllocation;