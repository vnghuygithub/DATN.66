import { DOMAIN_AUDITLOG } from "../constApi"
import { request } from "../request"


export interface auditLogArgs {
    res_id: number,
    model_model: string,
    user_id?: number,
}

export const getAuditLog = async (args: auditLogArgs) => {
    try {
        let url = DOMAIN_AUDITLOG.GET
        let requestBody = {
            params: {
                args: [
                    args.res_id ?? "",
                    args.model_model ?? "",
                    args.user_id ?? "",
                ]
            }
        }
        const res = await request("post", url, requestBody)
        if (res?.result?.error?.code && res.result.error.code == 400) {
            return;
        }
        return {
            results: {
                data: res?.result?.results,
                total: res?.result?.total_records,
            }
        }
        
    } catch (error) {
        console.log(error)
    }
}