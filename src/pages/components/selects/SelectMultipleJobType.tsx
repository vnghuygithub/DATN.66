import MyForm from '@/components/core/form';
import { companyOptions, employeeOptions, employeeOptionsAllocations, jobTypeOptions } from '@/const/options';
import React from 'react';
import { getListCompany } from '@/api/shift/company';
import { getListLeaveType } from '@/api/shift/leavetype';
import { useEffect, useState } from 'react';


interface IEmployee {
    value: number;
    label: string;
}
const SelectMultipleJobTypes = ({ ...props }: any) => {

    const [jobTypes, setJobTypes] = useState<IEmployee[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        jobTypeOptions().then((res) => {
            if (isMounted)
                setJobTypes(res);
        });
        return () => {
            setIsMounted(false);
        };
    }, []);


    return (
        <MyForm.Item
            options={jobTypes}
            label={'Cấp nhân sự'}
            {...props}
            name="job_type_ids"
            type="multi-select"
            innerprops={{
                showSearch: true,
                placeholder: "Vui lòng chọn cấp nhân sự",
                allowClear: true,
                loading: !jobTypes.length,
            }}
            required
        />
    );
};

export default SelectMultipleJobTypes;