import moment from 'moment';

export interface IUserRes {
  id: number;
  name: string;
  company_id: Array<any>;
  login: string;
  email: string;
  login_date: string;
  state: string;
  create_date: string;
  is_administrative: boolean;
  mis_id: string;
}


export const mapUser = (res: IUserRes[]) => {
  return (
    res &&
    res.length > 0 &&
    res.map((item, index) => {
      let companyId = item?.company_id ?? [];
      return {
        no: index + 1,
        id: item?.id,
        name: item?.name,
        company_id: companyId[0],
        company_name: companyId[1],
        mis_id: item?.mis_id,
        login: item?.login,
        email: item?.email,
        login_date: item?.login_date
          ? moment(item?.login_date)
              .add(7, 'hours')
              .format('DD/MM/YYYY HH:MM:SS')
          : '',
        create_date: item?.create_date
          ? moment(item?.create_date).add(7, 'hours').format('DD/MM/YYYY')
          : '',
        state: item?.state,
        is_administrative: item?.is_administrative,
      };
    })
  );
};
