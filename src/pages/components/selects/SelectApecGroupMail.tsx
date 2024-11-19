import MyForm from '@/components/core/form';
import { ccOptions, groupMailOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IDepartment {
    value: number;
    label: string;
}

const SelectApecGroupMail = ({ ...props }: any) => {
    const [cc, setCc] = useState<IDepartment[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    const params = {
        name: "",
        email: ""
    }
    useEffect(() => {
        setIsMounted(true);
        groupMailOptions(params).then((res) => {
            if (isMounted)
                setCc(res);
        });
        return () => {
            setIsMounted(false);
        }
    }, []);
    return (
        <MyForm.Item
            options={cc}
            label={'Danh sách group email'}
            {...props}
            required
            name="apec_group_mail_ids"
            type="multi-select"
            innerprops={{
                showSearch: true,
                placeholder: 'Vui lòng chọn',
                allowClear: true,
                loading: !cc.length,
            }}
        />
    )
}

export default SelectApecGroupMail;