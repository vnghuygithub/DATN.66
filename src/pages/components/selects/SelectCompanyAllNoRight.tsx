import MyForm from '@/components/core/form';
import { companyAllNoRightOptions } from '@/const/options';
import React from 'react';
import { useEffect, useState } from 'react';

interface ICompany {
  value: number;
  label: string;
}
const SelectCompanyAll = ({ disabled, onChange, ...props }: any) => {
  const { setCompanyId } = props;
  const [company, setCompany] = useState<ICompany[]>([]);
  const [isMounted, setIsMounted] = useState(true);
  useEffect(() => {
    setIsMounted(true);
    companyAllNoRightOptions().then(res => {
      if (isMounted) setCompany(res);
    //   setCompanyId(res);
    });
    return () => {
      setIsMounted(false);
    };
  }, []);

  return (
    <MyForm.Item
      options={company}
      label={'Công ty'}
      {...props}
      name="company_noright_id"
      type="select"
      innerprops={{
        disabled: disabled,
        allowClear: true,
        loading: !company.length,
        placeholder: 'Chọn công ty',
        onChange: (value: any) => {
          setCompanyId(value);
        },
      }}
      required
    />
  );
};

export default SelectCompanyAll;
