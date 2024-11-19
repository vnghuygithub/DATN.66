import { IEmployeeLog, IEmployeeeArgsResult, IEmployeeeDtoResult, IsDocumentList } from "@/interface/employees/employee"
import moment from "moment";
export const mapEmployeeLog = (res: IEmployeeLog[]) => {
    return res && res.length > 0 && res.map((item, index) => {
        return {
            no: index + 1,
            res_id: item?.res_id,
            key: item?.id,
            old_value_text: item?.old_value_text,
            new_value_text: item?.new_value_text,
            field_description: item?.field_description,
            field_name: item?.field_name,
            model_model: item?.model_model,
            user_id: item?.user_id,
            create_date: item?.create_date ? moment(item?.create_date) : '',
            model_name: item?.model_name,
            name: item?.name,
            method: item?.method === "unlink" ? "Xoá" : item?.method === "create" ? "Tạo" : "Sửa"
        }
    })
}
export const mapEmployeeDtoToEmployeee = (res: IEmployeeeDtoResult[]) => {
    return res && res.length > 0 && res.map((item, index) => {
        const ward = item.ward_id.name !== 'false' ? item.ward_id.name + ',' : '';
        const district = item.district_id.name !== 'false' ? item.district_id.name + ',' : '';
        const city = item.city_id.name !== 'false' ? item.city_id.name + ',' : '';
        return {
            no: index + 1,
            address: `${ward}${district}${city} ` || '-',
            time_keeping_code: item.time_keeping_code,
            key: item.id,
            code: item.code,
            name: item.name,
            job_title: item.job_title || '-',
            mobile_phone: item.mobile_phone || '-',
            work_email: item.work_email || '-',
            department: item?.department_id.name || '-',
            job: item.job_id.name || '-',
            company_id: item?.company_id.name || '-',
            parent_id: item?.parent_id.name || '-',
            coach_id: item?.coach_id.name || '-',
            work_phone: item?.work_phone || '-',
            resource_calendar: item?.resource_calendar_id.name || '-',
            severance_day: item.severance_day ? moment(item.severance_day) : '',
            bank: item?.bank || '-',
            bank_account_number: item?.bank_account_number || '-',
            bank_branch: item?.bank_branch || '-',
            current_place_of_residence: item?.current_place_of_residence || '-',
            issued_by_identification: item?.issued_by_identification.name || '-',
            city: item?.city_id.name || '-',
            district: item?.district_id.name || '-',
            ward: item?.ward_id.name || '-',
            private_email: item?.private_email || '-',
            place_of_birth: item?.place_of_birth || '-',
            gender: item?.gender || '-',
            identification_id: item?.identification_id || '-',
            country: item?.country_id.name || '-',
            study_school: item?.study_school || '-',
            highest_degree: item?.highest_degree || '-',
            study_field: item?.study_field || '-',
            range_of_vehicle: item?.range_of_vehicle || '-',
            car_registration: item?.car_registration || '-',
            license_plates: item?.license_plates || '-',
            car_color: item?.car_color || '-',
            workingday: item.workingday ? moment(item.workingday) : '',
            religion: item.religion_id.name || '-',
            tax_id: item.tax_id || '-',
            part_time_company: item?.part_time_company_id.name || '-',
            part_time_department: item?.part_time_department_id.name || '-',
            part_time_job_title: item.part_time_job_title || '-',
            probationary_salary_rate: item.probationary_salary_rate || '',
            date_sign: item.date_sign ? moment(item.date_sign) : '',
        }
    })
}
export const mapEmployee = (res: IEmployeeeArgsResult[]) => {
    return res && res.length > 0 && res.map((item:any, index:any) => {
        const department = item.department_id ?? []
        const job = item.job_id ?? []
        const company = item.company_id ?? []
        const parent = item.parent_id ?? []
        const coach = item.coach_id ?? []
        const resource_calendar = item.resource_calendar_id ?? []
        const issued_by_identification = item.issued_by_identification ?? []
        const city = item.city_id ?? []
        const district = item.district_vietnam_id ?? []
        const ward = item.ward_vietnam_id ?? []
        const country = item.country_id ?? []
        const state = item.state_id ?? []
        const religion = item.religion_id ?? []
        const part_time_company = item.part_time_company_id ?? []
        const part_time_department = item.part_time_department_id ?? []
        const part_time_job_title = item.part_time_job_title ?? []
        const user = item.user_id ?? []
        const hrEmployeeRelativeIds = item.hr_employee_relative_ids ?? []
        const nation = item.nation_id ?? []
        const bank = item.bank_id ?? []
        const relatives = hrEmployeeRelativeIds.map((relative:any) => ({
            id: relative.id,
            name: relative.name,
            relationship: relative.relationship,
            birthday: relative.birthday,
            phone: relative.phone,
            family_allowances: relative.family_allowances,
            job: relative.job,
            note: relative.note
        }));
        const workLocation = item.work_location ?? []
        return {
            id: index + 1,
            key: item.id,
            code: item.code,
            current_employee_code: item.current_employee_code ?? '',
            social_insurance_number: item.social_insurance_number ?? '',
            name: item.name,
            hr_employee_relatives: relatives,
            job_title: item.job_title ?? '',
            mobile_phone: item.mobile_phone ?? '',
            work_email: item.work_email ?? '',
            department: department[1] ?? '',
            job: job[1] ?? '',
            company_id: company[1] ?? '',
            parent_id: parent[1] ?? '',
            coach_id: coach[1] ?? '',
            work_phone: item.work_phone ?? '',
            resource_calendar: resource_calendar[1] ?? '',
            severance_day: item.severance_day ? moment(item.severance_day, "YYYY-MM-DD").format("DD-MM-YYYY") : '',
            bank: item.bank ?? '',
            bank_account_number: item.bank_account_number ?? '',
            bank_branch: item.bank_branch ?? '',
            current_place_of_residence: item.current_place_of_residence ?? '',
            issued_by_identification: issued_by_identification[1] ?? '',
            city: city[1] ?? '',
            district: district[1] ?? '',
            ward: ward[1] ?? '',
            private_email: item.private_email ?? '',
            place_of_birth: item.place_of_birth ?? '',
            gender: item.gender === "female" ? "Nữ" : item.gender === "male" ? "Nam" : item.gender === "other" ? "khác" : '',
            identification_id: item.identification_id ?? '',
            country: country[1] ?? '',
            study_school: item.study_school ?? '',
            highest_degree: item.highest_degree ?? '',
            study_field: item.study_field ?? '',
            range_of_vehicle: item.range_of_vehicle ?? '',
            car_registration: item.car_registration === "YES" ? "Có" : item.car_registration === "NO" ? "Không" : "",
            license_plates: item.license_plates ?? '',
            car_color: item.car_color ?? '',
            workingday: item.workingday ? moment(item.workingday, "YYYY-MM-DD").format("DD-MM-YYYY") : '',
            time_keeping_code: item.time_keeping_code ?? '',
            religion: religion[1] ?? '',
            tax_id: item.tax_id ?? '',
            part_time_company: part_time_company[1] ?? '',
            part_time_department: part_time_department[1] ?? '',
            part_time_job_title: part_time_job_title[1] ?? '',
            probationary_salary_rate: item.probationary_salary_rate ?? '',
            date_sign: item.date_sign ? moment(item.date_sign, "YYYY-MM-DD").format("DD-MM-YYYY") : '',
            probationary_contract_termination_date: item.probationary_contract_termination_date ? moment(item.probationary_contract_termination_date, "YYYY-MM-DD").format("DD-MM-YYYY") : '',
            user_id: user[1] ?? '',
            time_keeping_count: item.time_keeping_count ?? '',
            general_management_check: item.general_management_check ?? '',
            department_secretary_check: item.department_secretary_check ?? '',
            head_of_department_check: item.head_of_department_check ?? '',
            birthday: item.birthday ? moment(item.birthday, "YYYY-MM-DD").format("DD-MM-YYYY") : '',
            permanent_address: item.permanent_address ?? '',
            nation: nation[1] ?? '',
            certificate: item.certificate === "graduate" ? "Tốt nghiệp" : item.certificate === "bachelor" ? "Cử nhân" : item.certificate === "master" ? "Cử nhân" : item.certificate === "doctor" ? "Tiến sĩ" : item.certificate === "khác" ? "Khác" : '',
            issued_by_identification_text: item?.issued_by_identification_text ?? '',
            issued_by_identification_day: item.issued_by_identification_day ? moment(item.issued_by_identification_day, "YYYY-MM-DD").format("DD-MM-YYYY") : '',
            state: state[1] ?? '',
            marital: item.marital === "single" ? "Độc thân" : item.marital === "married" ? "Đã kết hôn" : item.marital === "widower" ? "Góa" : item.marital === "divorced" ? "Ly hôn" : '',
            level: item.level ?? '',
            weekly_report_is_mandatory: item.weekly_report_is_mandatory ?? '',
            is_accountant: item?.is_accountant ?? '',
            bank_id: bank[1] ?? '',
            bank_name: item.bank_name ?? '',
            mis_id: item.mis_id ?? '',
            work_location_id: workLocation[0] ?? '',
            work_location: workLocation[1] ?? '',
            working_status:item.working_status ?? '',
            official_contract_end_date: item.official_contract_end_date ? moment(item.official_contract_end_date, "YYYY-MM-DD").format("DD-MM-YYYY") : '',
            current_shift_name: item.current_shift_name ?? '',
        }
    }
    )
}
export const mapFormEmployee = (item: IEmployeeeDtoResult) => {
    return Object.assign(
        {},
        item,
        {
            key: item.id,
            code: item.code,
            name: item.name,
            mobile_phone: item.mobile_phone || '',
            work_email: item.work_email || '',
            department: item?.department_id.name || '',
            job: item.job_id.name || '',
            company_id: item?.company_id.name || '',
            parent_id: item?.parent_id.name || '',
            coach_id: item?.coach_id.name || '',
            work_phone: item?.work_phone || '',
            resource_calendar: item?.resource_calendar_id.name || '',
            severance_day: item?.severance_day ?? '',
            bank: item?.bank || '',
            bank_account_number: item?.bank_account_number || '',
            bank_branch: item?.bank_branch || '',
            current_place_of_residence: item?.current_place_of_residence || '',
            issued_by_identification: item?.issued_by_identification.name || '',
            city: item?.city_id.name || '',
            district: item?.district_id.name || '',
            ward: item?.ward_id.name || '',
            private_email: item?.private_email || '',
            place_of_birth: item?.place_of_birth || '',
            gender: item?.gender === "male" ? "Nam" : "Nữ" || '',
            identification_id: item?.identification_id || '',
            country: item?.country_id.name || '',
            study_school: item?.study_school || '',
            highest_degree: item?.highest_degree || '',
            study_field: item?.study_field || '',
            range_of_vehicle: item?.range_of_vehicle || '',
            car_registration: item?.car_registration || '',
            license_plates: item?.license_plates || '',
            car_color: item?.car_color || '',
            workingday: item?.workingday ?? '',
            religion: item.religion_id.name || '',
            tax_id: item.tax_id || '',
            probationary_salary_rate: item.probationary_salary_rate || '',
            date_sign: item.date_sign ? moment(item.date_sign) : '',
        }
    )
}


export const mapDocumentsList = (res: IsDocumentList[]) => {
    return res && res.length > 0 && res.map((item, index) => {
      return {

        id: item.id,                      
        url: item?.url,                    
        from_date: item.from_date 
          ? moment(item.from_date, "YYYY-MM-DD").format("DD-MM-YYYY") 
          : '',                                        
        to_date: item.to_date 
          ? moment(item.to_date, "YYYY-MM-DD").format("DD-MM-YYYY") 
          : '',                                         
                                   
      };
    });
  };