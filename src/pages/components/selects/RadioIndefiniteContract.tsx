import MyForm from "@/components/core/form"
import { FC } from 'react';

interface Props {
    value: boolean;
    onChange: (value: boolean) => void;
}
const RadioIndefiniteContract: FC<Props> = ({ value, onChange, ...props }: Props) => {
    return (
        <MyForm.Item
            label="Hợp đồng không xác định thời hạn"
            {...props}
            name="indefinite_contract"
            initialValue={false}
            type="radio"
            options={[
                {
                    label: 'True',
                    value: true,
                },
                {
                    label: 'False',
                    value: false,
                },
            ]}
            innerprops={{
                onChange: (e: any) => {
                    onChange(e.target.value)
                }
            }}

        />
    )
}


export default RadioIndefiniteContract
