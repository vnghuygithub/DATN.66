import MyForm from '@/components/core/form';
import { contractTypeOptions } from '@/const/options';
import { Col } from 'antd';
import { useEffect, useState } from 'react';

interface IContractType {
    value: number;
    label: string;
}

const SelectContractType = ({ ...props }) => {
    const [contractType, setContractType] = useState<IContractType[]>([]);
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        setIsMounted(true);
        contractTypeOptions().then((res) => {
            if (isMounted) {
                setContractType(res);
            }
        });

        return () => {
            setIsMounted(false);
        };
    }, []);
    return (
        <MyForm.Item
            options={contractType}
            label={'Loại hợp đồng'}
            {...props}
            name="contract_type_id"
            type="select"
            required
            innerprops={{
                showSearch: true,
                placeholder: 'Vui lòng chọn',
                allowClear: true,
                loading: !contractType.length,
            }}
        />
    )
}

export default SelectContractType;