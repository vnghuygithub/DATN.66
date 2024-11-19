import MyForm from '@/components/core/form';
import { companyOptions, newCompanyOptions } from '@/const/options';
import React from 'react';
import { getListCompany } from '@/api/shift/company';
import { getListLeaveType } from '@/api/shift/leavetype';
import { useEffect, useState } from 'react';

const SelectAllocation = ({ onChange, ...props }: any) => {
    return (
        <MyForm.Item
            label="Loại phiếu"
            {...props}
            name="allocation_type"
            type="select"
            options={[
                { value: 'công ty', label: 'Công ty' },
                { value: 'phòng ban', label: 'Phòng ban' },
            ]}
            innerprops={{
                placeholder: 'Loại phiếu',
                allowClear: true,
                onChange: (value: string) => {
                    onChange(value)
                }
            }}
            required
        />
    )
}
export default SelectAllocation;