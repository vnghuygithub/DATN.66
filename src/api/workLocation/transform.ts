export const mapWorkLocation = (item : any) => {
    return item && item.length > 0 && item.map((item: any, index: number) => {
        return {
            stt: index + 1,
            ...item
        }})
}