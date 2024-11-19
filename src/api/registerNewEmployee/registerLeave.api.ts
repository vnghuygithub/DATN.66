import { result } from 'lodash';
import { request } from '@/api/request';
import { REGISTER_NEW_EMPLOYEE } from '../constApi';
import { RESIGNATIONLETTER } from '../constApi';
import { message as $message } from 'antd';

export const registerNewLetter = async (data: any) => {
  let url = RESIGNATIONLETTER.POST;
  const res = await request('post', url, data);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  console.log(res)
  return res;
};
// export const registerNewEmployeeParent = async (data: any) => {
//   let url = REGISTER_NEW_EMPLOYEE.POST2;
//   const res = await request('post', url, data);
//   if (res?.result?.error?.code && res.result.error.code == 400) {
//     $message.error(res.result.error.message);
//     return;
//   }
//   return res;
// };
// const is_general_manager = localStorage.getItem('is_general_manager');
// const is_general_managerCheck = is_general_manager === 'true';

// export const getRegisterNewEmployee = async () => {
//   if (is_general_managerCheck) {
//     const body = {
//       params: {
//         args: ['', '', '', '', '', '', '', '', ''],
//       },
//     };

//     let url = REGISTER_NEW_EMPLOYEE.GETBYCOMPANY;
//     const res = await request('post', url, body);
//     if (res?.result?.error?.code && res.result.error.code == 400) {
//       $message.error(res.result.error.message);
//       return;
//     }
//     return {
//       results: {
//         data: res?.result?.records?.reverse(),
//         total: res?.total_records,
//       },
//     };
//   } else {
//     let url =
//       REGISTER_NEW_EMPLOYEE.GET + `&filter=[["employee_code","=",false]]`;
//     const res = await request('get', url);
//     if (res?.result?.error?.code && res.result.error.code == 400) {
//       $message.error(res.result.error.message);
//       return;
//     }
//     return {
//       results: {
//         data: res?.result?.reverse(),
//         total: res?.count,
//       },
//     };
//   }
// };

const is_administrative = localStorage.getItem('is_administrative');
const checkAdministrative = is_administrative === 'true';
export const getRegisterNewEmployeeVer3 = async (data:any) => {
  if (checkAdministrative) {
    let url =
    RESIGNATIONLETTER.GET;
    const res = await request('post', url, data);
   
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return {
      results: {
        data: res?.result?.result,
        total: res?.count,
      },
    };
  } else {
    let url =
    RESIGNATIONLETTER.GET ;
    const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return {
      results: {
        data: res?.result?.reverse(),
        total: res?.count,
      },
    };
  }
};

export const getRegisterNewEmployeeDetail = async (id: number) => {
  let url =
  RESIGNATIONLETTER.GETById +
     id +
    '/?query={id,state,employee_id{id,name,code},severance_day,employee_name,birthday,gender,reason,hand_over_docs_ids{id,url,name,description,received_by{id,name,code}}}'; 
    
   const res = await request('get', url);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const registerLetterUpdate = async (arg:any) => {
  let url = RESIGNATIONLETTER.UPDATE;
 
  const body = {
    params: {
      args:[
         arg
      ] ,
    },
  };
  const res = await request('post', url, body);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
export const verifyRegisterLetter = async (id: any) => {
  let url = RESIGNATIONLETTER.VERIFY;
  const body = {
    params: {
      args:[
        [id]
      ] ,
    },
  };
  const res = await request('post', url, body);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  console.log(res)
  return res;
};
export const verifyRegisterLetter2 = async (id: any) => {
  let url = RESIGNATIONLETTER.VERIFY2;
  const body = {
    params: {
      args:[
        [id]
      ] ,
    },
  };
  const res = await request('post', url, body);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  console.log(res)
  return res;
};

export const sendMailIT = async (data: any) => {
  const requestBody = {
    params: {
      args: [data],
    },
  };
  let url = RESIGNATIONLETTER.MAILIT;
  const res = await request('post', url, requestBody);
  if (res?.result?.error?.code && res.result.error.code == 400) {
    $message.error(res.result.error.message);
    return;
  }
  return res;
};
// export const verifyRegisterNewEmployee2 = async (id: any) => {
//   let url = REGISTER_NEW_EMPLOYEE.VERIFY;
//   const body = {
//     params: {
//       args: [id],
//     },
//   };
//   const res = await request('post', url, body);
//   if (res?.result?.error?.code && res.result.error.code == 400) {
//     $message.error(res.result.error.message);
//     return;
//   }
//   return res;
// };

// export const declineRegisterNewEmployee = async (id: any) => {
//   let url = REGISTER_NEW_EMPLOYEE.DECLINE;
//   const body = {
//     params: {
//       args: [id],
//     },
//   };
//   const res = await request('post', url, body);
//   if (res?.result?.error?.code && res.result.error.code == 400) {
//     $message.error(res.result.error.message);
//     return;
//   }
//   return res;
// };
