import MyForm from '@/components/core/form';
import { ccOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IDepartment {
    value: number;
    label: string;
    email: string;
}

const SelectCC = ({ onChange, ...props }: any) => {
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
            label={'CC'}
            {...props}
            name="cc"
            type="multi-select"
            innerprops={{
                showSearch: true,
                placeholder: 'Vui lòng chọn',
                allowClear: true,
                loading: !cc.length,
                onChange: (value: any) => {
                    const selectedDepartments = cc.filter(department => value.includes(department.value));
                    onChange && onChange(selectedDepartments);
                },
                filterOption: (inputValue: any, option: any) => {
                    const inputValueLower = inputValue.trim()
                    const optionLabelTrim = option.label
                    return optionLabelTrim.toLowerCase().includes(inputValueLower.toLowerCase())
                }
            }}
        />
    )
}

export default SelectCC;