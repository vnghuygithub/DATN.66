import { request } from '../request';
import { GET_HR_LEAVE_TYPE, GET_LEAVE_TYPE, GET_LIST_LEAVE } from '../constApi';
import { message as $message } from 'antd';
import { useSelector } from 'react-redux';

export const getListLeaveType = async () => {
  const res = await request('get', GET_HR_LEAVE_TYPE.GETALL);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const getLeaveTypeSource = async () => {
  const res = await request('get', GET_LEAVE_TYPE.GETALL);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const calculateLeave = async (args: any) => {
  let url = GET_LIST_LEAVE.calculate;
  const res = await request('post', url, args);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const getRemainingLeaveCl = async (args: any) => {
  let url = GET_LIST_LEAVE.GETREMAININGLEAVE;
  const res = await request('post', url, args);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};

export const updateStatusLeave = async (body: any) => {
  const res = await request('post', GET_LIST_LEAVE.UPDATE, body);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
