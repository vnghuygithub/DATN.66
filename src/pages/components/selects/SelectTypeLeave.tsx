import MyForm from '@/components/core/form';
import { leaveTypeOptions } from '@/const/options';
import React from 'react';
import { getLeaveTypeSource, getListLeaveType } from '@/api/shift/leavetype';
import { useEffect, useState } from 'react';
import { formatObjectLabelValue } from '@/utils/common';

interface ILeaveType {
  value: string;
  label: string;
}

const SelecLeaveType = ({ ...props }) => {
  const [leavetype, setLeavetype] = useState<ILeaveType[]>([]);
  const fetchTypeLeaveSource = async () => {
    const res = await getLeaveTypeSource();
    if (res) {
      let array: any = [];
      for (let i = 0; i < res.result.length; i++) {
        const object = res.result[i];
        if (object.display_or_not == 'Y') {
          if (object.code === "CTL" && !object.name.includes("(chỉ dùng cho hiếu, hỉ)")) {
            object.name += " (chỉ dùng cho hiếu, hỉ)";
          }
          array.push(object);
        }
      }
      if (Array.isArray(res.result) && res.result.length > 0) {
        setLeavetype(formatObjectLabelValue(array));
      }
    }
  };
  useEffect(() => {
    fetchTypeLeaveSource();
  }, []);

  return (
    <MyForm.Item
      options={leavetype}
      label={'Loại đơn'}
      {...props}
      name="type_leave"
      type="select"
    />
  );
};

export default SelecLeaveType;
