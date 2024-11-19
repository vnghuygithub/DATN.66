import { auditLogArgs, getAuditLog } from "@/api/auditlog/auditlog.api"
import { extractTextInSingleQuotes } from "@/utils/common"
import { ArrowRightOutlined } from "@ant-design/icons"
import { Drawer } from "antd"
import moment from "moment"
import { useEffect, useState } from "react"

interface Props {
    showLog?: boolean
    idEmployee?: string
    onClose?: () => void
}

const EmployeeLog = ({
    showLog, idEmployee, onClose
}: Props) => {
    const [logData, setLogData] = useState<any[]>([])
    const fetchLogById = async (args: auditLogArgs) => {
        const res = await getAuditLog(args)
        if (res) {
            setLogData(res?.results?.data)
            return res?.results?.data
        }
    }
    useEffect(() => {
        if (idEmployee) {
            fetchLogById({
                res_id: Number(idEmployee),
                model_model: "hr.employee",
            })
        }
    }, [idEmployee])
    return (
        <>
            <Drawer
                key={idEmployee}
                title="Lịch sử thay đổi"
                onClose={onClose}
                width={350}
                open={showLog}
                destroyOnClose
                bodyStyle={{ paddingBottom: 80 }}
            >
                {
                    logData && logData.filter(item => item.method === "write").map((item, index) => (
                        <div key={index} style={{ marginBottom: "10px" }}>
                            <p style={{ textAlign: "center", color: "black", fontWeight: "500" }}>
                                {moment(item.create_date).add(7, 'hours').format('DD/MM/YYYY HH:mm')}
                            </p>
                            <p style={{ color: "gray", fontWeight: "bold" }}>
                                {item.user_id[1]}
                            </p>
                            <p>Hành động: {item?.method === "write" ? "Sửa" : item?.method === "create" ? "Tạo" : item?.method}</p>
                            <p >
                                {item.old_value_text ? extractTextInSingleQuotes(item.old_value_text) : "Không"}  <ArrowRightOutlined />  {item.new_value_text ? extractTextInSingleQuotes(item.new_value_text) : "Không"} ({item.field_description})
                            </p>
                        </div>
                    ))
                }
            </Drawer>

        </>
    )
}

export default EmployeeLog