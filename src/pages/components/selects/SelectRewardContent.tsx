import MyForm from '@/components/core/form';
import { companyOptions, rewardContentOptions } from '@/const/options';
import React from 'react';
import { getListCompany } from '@/api/shift/company';
import { getListLeaveType } from '@/api/shift/leavetype';
import { useEffect, useState } from 'react';


interface ICompany {
    value: number;
    label: string;
}
const SelectRewardContent = ({ ...props }) => {

    const [reward, setReward] = useState<ICompany[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        rewardContentOptions().then((res) => {
            if (isMounted)
                setReward(res);
        });
        return () => {
            setIsMounted(false);
        };
    }, []);


    return (
        <MyForm.Item
            options={reward}
            label={'Nội dung'}
            {...props}
            name="reward_content_id"
            type="select"
            innerprops={{
                allowClear: true,
                loading: !reward.length,
                showSearch: true,
                placeholder: 'Chọn nội dung',
            }}


        />
    );
};

export default SelectRewardContent;