import { DOMAIN_RELATIVE, DOMAIN_RELATIVE_PARENT } from '../constApi';
import { request } from '../request';
import { message as $message } from 'antd';
export interface EmployeeRelative {
  params: {
    code: string;
    relatives: [
      {
        employee_id?: number;
        birthday?: string;
        job?: string;
        name?: string;
        note?: string;
        phone?: string;
        relationship?: string;
        family_allowances?: string;
        state?: string;
      }
    ];
  };
}

export const createEmployeeRelative = async (data: any) => {
  let url = DOMAIN_RELATIVE.CREATE;
  let requestBody = {
    params: {
      data: {
        ...data,
      },
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const createEmployeeRelativeParent = async (data: EmployeeRelative) => {
  let url = DOMAIN_RELATIVE_PARENT.CREATE;
  let requestBody = {
    params: {
      data: {
        ...data,
      },
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};
export const createEmployeeRelativeParentByCode = async (data: any) => {
  let url = DOMAIN_RELATIVE_PARENT.CREATEByCode;
  let requestBody = {
    params: {
      ...data,
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateEmployeeRelative = async (
  id: number,
  data: EmployeeRelative
) => {
  let url = DOMAIN_RELATIVE.PUT + id;
  let requestBody = {
    params: {
      data: {
        ...data,
      },
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const updateEmployeeRelativeParent = async (id: number, data: any) => {
  let url = DOMAIN_RELATIVE_PARENT.PUT + id;
  let requestBody = {
    params: {
      data: {
        ...data,
      },
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const ApproveEmployeeRelative = async (id: number) => {
  let url = DOMAIN_RELATIVE.PUT + id;
  let requestBody = {
    params: {
      data: {
        state: 'đã duyệt',
      },
    },
  };
  try {
    const res = await request('post', url, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};
