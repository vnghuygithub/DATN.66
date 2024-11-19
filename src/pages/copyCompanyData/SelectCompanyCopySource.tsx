import MyForm from '@/components/core/form';
import { companyHoSearchOptions, companyOptions, companyOptionsAll , companyAllNoRightOptions} from '@/const/options';
import React from 'react';
import { getListCompany } from '@/api/shift/company';
import { getListLeaveType } from '@/api/shift/leavetype';
import { useEffect, useState } from 'react';

interface ICompany {
    value: number;
    label: string;
}
const SelectCompanyCopySource = ({ disabled,...props }:any) => {

    const [company, setCompany] = useState<ICompany[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        companyHoSearchOptions().then((res) => {
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
            label={'Công ty nguồn'}
            {...props}
            name="company_source_id"
            type="select"
            innerprops={{
                disabled: disabled,
                allowClear: true,
                loading: !company.length,
                placeholder: "Chọn công ty",
            }}
            required


        />
    );
};

export default SelectCompanyCopySource;