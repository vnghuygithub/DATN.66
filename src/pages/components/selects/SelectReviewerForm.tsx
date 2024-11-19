import MyForm from '@/components/core/form';
import { employeeOptions } from '@/const/options';
import { useEffect, useState } from 'react';

interface IEmployee {
    value: number;
    label: string;
}

const SelectReviewerForm = ({ ...props }) => {
    const [employee, setEmployee] = useState<IEmployee[]>([]);
    const [isMounted, setIsMounted] = useState(true); 

    useEffect(() => {
        setIsMounted(true);
        employeeOptions().then((res) => {
            if (isMounted) { 
                setEmployee(res);
            }
        });

        return () => {
            setIsMounted(false);
        };
    }, []);

    return (
        <MyForm.Item
            options={employee}
            label={'Người duyệt'}
            {...props}
            name="reviewer"
            type="select"
            innerprops={{
                loading: !employee.length,
            }}
        />
    )
}

export default SelectReviewerForm;
