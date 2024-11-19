import MyForm from '@/components/core/form';
import { bankOptions, cityOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface ICity {
    value: number;
    label: string;
}

const SelectBank = ({ ...props }) => {
    const [city, setCity] = useState<ICity[]>([]);
    const [isMounted, setIsMounted] = useState(true); 

    useEffect(() => {
        setIsMounted(true);
        bankOptions().then((res) => {
            if (isMounted) { 
                setCity(res);
            }
        });

        return () => {
            setIsMounted(false);
        };
    }, []);

    return (
        <MyForm.Item
            options={city}
            label={'Ngân hàng'}
            {...props}
            name="bank_id"
            type="select"
            innerprops={{
                showSearch: true,
                placeholder: 'Vui lòng chọn',
                defaultValue: '',
                loading: !city.length,
            }}
        />
    )
}

export default SelectBank;