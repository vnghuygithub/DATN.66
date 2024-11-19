import moment from 'moment';

export interface IHolidayLeaves {
  id: number;
  no: number;
  date_from: string;
  date_to: string;
  name: string;
  company_id: Array<any>;
  create_date: string;
  mis_id: string;
}
export const mapHolidayLeaves = (res: IHolidayLeaves[]) => {
  return (
    res &&
    res.length > 0 &&
    res.map((res, index) => {
      const companyId = res?.company_id ?? [];
      return {
        no: index + 1,
        id: res?.id,
        date_from: res?.date_from ?? '',
        date_to: res?.date_to ?? '',
        name: res?.name ?? '',
        company_id: companyId[1] ?? '',
        create_date: res?.create_date ?? '',
        mis_id: res?.mis_id,
      };
    })
  );
};
