
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
const SelectTuesdayShift = ({ companyId,selectedShift,...props }: any) => {

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
    }, [companyId,selectedShift]);


    return (
        <MyForm.Item
            options={company}
            label={'Thứ 3'}
            {...props}
            name="tuesday"
            type="select"
            initialValue={selectedShift}
            innerprops={{
                showSearch: true,
                placeholder: "Thứ 3",
                allowClear: true,
                loading: !company.length,
            }}
            
        />
    );
};

export default SelectTuesdayShift;