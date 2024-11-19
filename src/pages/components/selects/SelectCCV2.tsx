import MyForm from '@/components/core/form';
import { ccOptions, ccOptions2 } from '@/const/options';
import { useEffect, useState } from 'react';

interface IDepartment {
    value: number;
    label: string;
    email: string;
}

const SelectCCV2 = ({ ...props }: any) => {
    const [cc, setCc] = useState<IDepartment[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        ccOptions2().then((res) => {
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
            label={'Người quản lý'}
            {...props}
            name="apec_common_contact_id"
            type="select"
            innerprops={{
                showSearch: true,
                placeholder: 'Vui lòng chọn',
                allowClear: true,
                loading: !cc.length,
            }}
        />
    )
}

export default SelectCCV2;