import MyForm from '@/components/core/form';
import { ccOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IDepartment {
    value: number;
    label: string;
    email: string;
}

const SelectApecCommonContactIds = ({ disabled, ...props }: any) => {
    const [cc, setCc] = useState<IDepartment[]>([]);
    const [isMounted, setIsMounted] = useState(true);
    useEffect(() => {
        setIsMounted(true);
        ccOptions().then((res) => {
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
            label={'Email chuyển tiếp báo cáo tuần'}
            {...props}
            name="email_ccs"
            type="multi-select"
            innerprops={{
                showSearch: true,
                disabled: disabled,
                placeholder: 'Vui lòng chọn',
                allowClear: true,
                loading: !cc.length,
            }}
        />
    )
}

export default SelectApecCommonContactIds;