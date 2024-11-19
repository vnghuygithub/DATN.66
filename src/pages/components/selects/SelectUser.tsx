import MyForm from '@/components/core/form';
import { companyOptions, userOptions } from '@/const/options';
import React from 'react';
import { getListCompany } from '@/api/shift/company';
import { getListLeaveType } from '@/api/shift/leavetype';
import { useEffect, useState } from 'react';


interface ICompany {
    value: number;
    label: string;
}
const SelectUser = ({ disabled,...props } :any) => {

    const [company, setCompany] = useState<ICompany[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        userOptions().then((res) => {
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
            label={'Người dùng'}
            {...props}
            name="user_id"
            type="select"
            innerprops={{
                allowClear: true,
                loading: !company.length,
                disabled: disabled,
            }}


        />
    );
};

export default SelectUser;