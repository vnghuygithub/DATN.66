import { ITRStates } from '@/interface/timerecorderstate/time_recorder_state';

export const mapTRStates = (item: ITRStates[]) => {
  return (
    item &&
    item.length > 0 &&
    item.map((item, index) => {
      return {
        no: index + 1,
        id: item?.id,
        time_recorder_id: item?.time_recorder_id ?? '',
        dates_and_states: item?.dates_and_states ?? '',
        date: item?.date ?? '',
        state: item?.state ?? '',
        work_address: item?.work_address ?? '',
        address_ip: item?.address_ip ?? '',
        connection: item?.connection ?? '',
      };
    })
  );
};
