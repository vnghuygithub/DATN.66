import { IJobListArgs } from '@/api/job/job.api';
import MyForm from '@/components/core/form';
import { jobOptions } from '@/const/options';
import { on } from 'events';
import { useEffect, useState } from 'react';

interface IJob {
    value: number;
    label: string;
}

const SelectJobRegister = ({ selectedDepartmentId,...props }:any) => {
    const [job, setJob] = useState<IJob[]>([]);
    useEffect(() => {
        let jobArgs: IJobListArgs= {
            company_id: "",
            level: "",
            name: "",
            department_id: selectedDepartmentId,
            page_size: "",
            page: "",
        }
        jobOptions(jobArgs).then((res) => {
            setJob(res);
        });
    }, [selectedDepartmentId]);
    return (
        <MyForm.Item
        required
            options={job}
            label={'Chức vụ'}
            {...props}
            name="job_id"
            type="select"
            innerprops={{
                placeholder: 'Vui lòng chọn',
                allowClear: true,
                loading: !job.length,
             
            }}
        />
    )
}

export default SelectJobRegister;