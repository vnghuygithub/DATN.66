export const mapLeaveListView = (res: any[]) =>{
    return res && res.length >0 && res.map((item,index) =>{
        return{
            no: index,
            for_reasons: item.for_reasons === "1" ? "Cá nhân" : item.for_reasons === "2" ? "Công việc": "",
            ...item
        }
    })
}
