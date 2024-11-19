import MyForm from '@/components/core/form';
import { companyOptions, currentCompanyOptions } from '@/const/options';
import React from 'react';
import { getListCompany } from '@/api/shift/company';
import { getListLeaveType } from '@/api/shift/leavetype';
import { useEffect, useState } from 'react';


interface ICompany {
    value: number;
    label: string;
}
const SelectCurrentCompany = ({  ...props }: any) => {

    const [company, setCompany] = useState<ICompany[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        currentCompanyOptions().then((res) => {
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
            label={'Công ty hiện tại'}
            {...props}
            name="current_company_id"
            type="select"
            innerprops={{
                allowClear: true,
                loading: !company.length,
                disabled: true
            }}
        />
    );
};

export default SelectCurrentCompany;