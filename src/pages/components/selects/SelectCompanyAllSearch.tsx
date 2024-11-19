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
const SelectCompanyAllSearch = ({ ...props }) => {

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
            name="company_id"
            type="select"
            innerprops={{
                allowClear: true,
                placeholder: 'Chọn công ty',
                loading: !company.length,
            }}
        />
    );
};

export default SelectCompanyAllSearch;