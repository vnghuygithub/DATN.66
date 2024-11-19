import { getEmployeeWorkHistory } from '@/api/employeeworkhistory';
import { Col, Modal, Row } from 'antd';
import { useEffect, useState } from 'react';

export default function EmployeeWorkHistory(props: any) {
  const {
    isModalInfoEmployeeVisible,
    setIsModalInfoEmployeeVisible,
    isIdEmployee,
  } = props;
  const [employData, setEmployData] = useState<any[]>([]);


  useEffect(() => {
    if (isModalInfoEmployeeVisible) {
      const handleData = async () => {
        const data = await getEmployeeWorkHistory(isIdEmployee);
        console.log(data?.result?.result);
        setEmployData(data?.result?.result);
      };
      handleData();
    }
  }, [isModalInfoEmployeeVisible, isIdEmployee]);

  function formatDate(dateString: any) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  return (
    <div>
     <Modal
  open={isModalInfoEmployeeVisible}
  onCancel={() => setIsModalInfoEmployeeVisible(false)}
  footer={null}
  width={1200}
  style={{ height: 900 }}
  className="custom-modal-info"
>
  {employData && employData.length > 0 ? (
    employData.map((item) => (
      <Row key={item.id} style={{ height: '100%' }}>
        <Col>
          <div className="info-employee-contain">
            {/* THÔNG TIN CHUNG */}
            <div className="info-employee-item">
              <div className="info-employee-title">THÔNG TIN CHUNG</div>
              <div className="info-employee-content-1">
                <div className="info-columns">
                  <div className="info-column">
                    <div className="info-label">Ngày sinh:</div>
                    <div className="info-value">
                      {formatDate(item.employee_date)}
                    </div>
                  </div>
                  <div className="info-column">
                    <div className="info-label">Bằng cấp:</div>
                    <div className="info-value">
                      {item.employee_graduation}
                    </div>
                  </div>
                </div>
                <div className="info-columns">
                  <div className="info-column">
                    <div className="info-label">Số CMTND:</div>
                    <div className="info-value">{item.employee_code}</div>
                  </div>
                  <div className="info-column">
                    <div className="info-label">Tên trường:</div>
                    <div className="info-value">{item.employee_school}</div>
                  </div>
                </div>
                <div className="info-columns">
                  <div className="info-column">
                    <div className="info-label">SĐT:</div>
                    <div className="info-value">{item.employee_phone}</div>
                  </div>
                  <div className="info-column">
                    <div className="info-label">Chuyên ngành học:</div>
                    <div className="info-value">{item.employee_major}</div>
                  </div>
                </div>
                <div className="info-columns">
                  <div className="info-column">
                    <div className="info-label">Email:</div>
                    <div className="info-value">{item.employee_email}</div>
                  </div>
                  <div className="info-column">
                    <div className="info-label">Năm tốt nghiệp:</div>
                    <div className="info-value">
                      {item.employee_graduation_date}
                    </div>
                  </div>
                </div>
                <div className="info-columns">
                  <div className="info-column">
                    <div className="info-label">Địa chỉ:</div>
                    <div className="info-value">{item.employee_address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* KINH NGHIỆM LÀM VIỆC */}
            <div className="info-employee-item">
              <div className="info-employee-title">KINH NGHIỆM LÀM VIỆC</div>
              <div className="info-employee-content">
                <div className="experience-row">
                  <div className="experience-column">
                    <span className="experience-value">
                      {item.employee_date_achievements}
                    </span>
                  </div>
                </div>
                <table className="my-table">
                  <thead>
                    <tr>
                      <th>Công ty</th>
                      <th>Kinh nghiệm</th>
                      <th>Ngày bắt đầu</th>
                      <th>Ngày kết thúc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.hr_employee_experience_ids &&
                      item.hr_employee_experience_ids.length > 0 &&
                      item.hr_employee_experience_ids.map(
                        (exp: any, index: number) => (
                          <tr key={index}>
                            <td>{exp.company_name}</td>
                            <td>{exp.description}</td>
                            <td>{formatDate(exp.from_date)}</td>
                            <td>{formatDate(exp.to_date)}</td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* QUÁ TRÌNH LÀM VIỆC */}
            <div className="info-employee-item">
              <div className="info-employee-title">QUÁ TRÌNH LÀM VIỆC</div>
              <div className="info-employee-content">
                <table className="my-table">
                  <thead>
                    <tr>
                      <th>Công ty</th>
                      <th>Công việc</th>
                      <th>Ngày bắt đầu</th>
                      <th>Ngày kết thúc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.hr_employee_work_process_ids &&
                      item.hr_employee_work_process_ids.length > 0 &&
                      item.hr_employee_work_process_ids.map(
                        (exp: any, index: number) => (
                          <tr key={index}>
                            <td>{exp.description}</td>
                            <td>{exp.job_name}</td>
                            <td>{formatDate(exp.from_date)}</td>
                            <td>{formatDate(exp.to_date)}</td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* KHEN THƯỞNG */}
            <div className="info-employee-item">
              <div className="info-employee-title">KHEN THƯỞNG</div>
              <div className="info-employee-content">
                <table className="my-table">
                  <thead>
                    <tr>
                      <th>Công ty</th>
                      <th>Công việc</th>
                      <th>Thành tích</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.hr_employee_reward_ids &&
                      item.hr_employee_reward_ids.length > 0 &&
                      item.hr_employee_reward_ids.map((rewardId: any) => (
                        <tr key={rewardId}>
                          <td>{rewardId.company_name}</td>
                          <td>{rewardId.job_name}</td>
                          <td>{rewardId.achievements}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* KỶ LUẬT */}
            <div className="info-employee-item">
              <div className="info-employee-title">KỶ LUẬT</div>
              <div className="info-employee-content">
                <table className="my-table">
                  <thead>
                    <tr>
                      <th>Công ty</th>
                      <th>Công việc</th>
                      <th>Kỷ luật</th>
                      <th>Lý do kỷ luật</th>
                    </tr>
                  </thead>
                  <tbody>
                    {item.hr_employee_punishment_ids &&
                      item.hr_employee_punishment_ids.length > 0 &&
                      item.hr_employee_punishment_ids.map(
                        (punishment: any) => (
                          <tr key={punishment}>
                            <td>{punishment.company_name}</td>
                            <td>{punishment.job_name}</td>
                            <td>{punishment.punishments}</td>
                            <td>{punishment.reason}</td>
                          </tr>
                        )
                      )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    ))
  ) : (
    <div style={{ width:'100%', height:'100%'}}>Chưa cập nhập dữ liệu nhân viên</div>
  )}
</Modal>

    </div>
  );
}

