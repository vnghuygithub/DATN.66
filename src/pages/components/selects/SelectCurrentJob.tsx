import { IJobListArgs } from '@/api/job/job.api';
import MyForm from '@/components/core/form';
import { jobOptions } from '@/const/options';
import { on } from 'events';
import { useEffect, useState } from 'react';

interface IJob {
    value: number;
    label: string;
}

const SelectCurrentJob = ({ selectedDepartmentId, required, ...props }: any) => {
    const [job, setJob] = useState<IJob[]>([]);
    useEffect(() => {
        let jobArgs: IJobListArgs = {
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
    let requiredCheck = required
    if (requiredCheck === "true") {
        requiredCheck = true
    } else {
        requiredCheck = false
    }
    return (
        <MyForm.Item
            options={job}
            label={'Chức vụ hiện tại'}
            {...props}
            name="current_job_id"
            type="select"
            required={requiredCheck}
            innerprops={{
                placeholder: 'Vui lòng chọn',
                allowClear: true,
                loading: !job.length,
                disabled: true
            }}
        />
    )
}

export default SelectCurrentJob;