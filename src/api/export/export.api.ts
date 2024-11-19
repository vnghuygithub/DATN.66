import { data } from '@/mock/applicationlist/list';

import { EXPORT_EXCEL, DOMAIN_IMPORT_REPORT_SHIFT,  } from "../constApi";
import { mapDocumentsList } from "../employee/transform";
import { request } from "../request";
import { IExportExcel, mapExportExcel } from './transform';
import { message as $message } from 'antd';
import { IsDocumentList } from '@/interface/employees/employee';
export interface IArgsExportExcel {
    month: number,
    year: number,
}

export const getListExport = async (args: IArgsExportExcel) => {
    let requestBody = {
        "params": {
            "args": [
                args?.month ?? "",
                args?.year ?? "",
            ]
        }
    }
    const res = await request('post', EXPORT_EXCEL.GETALL, requestBody);
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return {
        data: mapExportExcel(res?.result),
        total: res?.result?.length,
    }
}



export const importReportShift = async (data: any) => {
    const res = await request('post', DOMAIN_IMPORT_REPORT_SHIFT.IMPORT, data)
    if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
    }
    return res
}

export const getListDocument = async () => {
    // console.log(id)
    let url = EXPORT_EXCEL.GET
    let requestBody = {
        params: {
            "args": [
                ,
                ,
                ""
            ]
        }
    }
    try {
        const res = await request("post", url, requestBody)
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        console.log(res)
        return {
            results: {
              data: mapDocumentsList(res?.result.data),
              total: res?.result.total_records,
            },
          };
    } catch (error) {
        console.log(error)
    }
}

export const createNewDocument = async (data: IsDocumentList) => {
    let url = EXPORT_EXCEL.CREATE;
        console.log('data.file',data.file);
        
    let requestBody = {
        "params": {
            "data": {
                "from_date": data.from_date,
                "to_date": data.to_date,
                "company_id":data.company_id,
                "template": "1",
                "file": data.file.data
            }
        }
    };
    try {
      const res = await request('post', url, requestBody);
      console.log(res);
      
      if (res?.result?.error?.code && res.result.error.code == 400) {
        $message.error(res.result.error.message);
        return;
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  export const getDocumentById = async (id: number) => {
    let url = EXPORT_EXCEL.GETALL + `/${id}` + '/?query={id,name,from_date,to_date,url,company_id,file}';
    try {
        const res = await request('get', url);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            $message.error(res.result.error.message);
            return;
        }
        return res
    } catch (error) {
        console.log(error)
    }
}

export const updateDocument = async (data: IsDocumentList) => {
    let url = EXPORT_EXCEL.UPDATE + `${data?.id}` ;

   console.log(data);
   
    const body = {
      params: {
        "data": {
            "from_date": data?.from_date,
            "to_date": data?.to_date,
            "company_id":data?.company_id,
            "template": "1",
            "file": data?.file.data

        }
      },
    };
    const res = await request('post', url, body);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  };


  export const getDocumentDetail = async (id:number) => {
    let url =
    EXPORT_EXCEL.GETById +
       id +
      '/?query={id,name,from_date,to_date,url,file,company_id}'; 
      
     const res = await request('get', url);
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  };

  export const deleteDocument = async (id: number) => {
    const res = await request('delete', EXPORT_EXCEL.DELETE + id);
    console.log(res);
    
    if (res?.result?.error?.code && res.result.error.code == 400) {
      $message.error(res.result.error.message);
      return;
    }
    return res;
  };