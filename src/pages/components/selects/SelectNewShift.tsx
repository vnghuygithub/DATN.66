
import MyForm from '@/components/core/form';
import { companyOptions, newCompanyOptions, newShift } from '@/const/options';
import React from 'react';
import { getListCompany } from '@/api/shift/company';
import { getListLeaveType } from '@/api/shift/leavetype';
import { useEffect, useState } from 'react';


interface ICompany {
    value: number;
    label: string;
}
const SelectNewShift = ({ companyId,onChange,...props }: any) => {

    const [company, setCompany] = useState<ICompany[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        newShift(companyId).then((res) => {
            if (!companyId) {
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
    }, [companyId]);


    return (
        <MyForm.Item
            options={company}
            label={'Ca mới'}
            {...props}
            name="new_shift_id"
            type="select"
            innerprops={{
                showSearch: true,
                placeholder: "Vui lòng chọn ca mới",
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

export default SelectNewShift;