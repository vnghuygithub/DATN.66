import { request } from "@/api/request";
import { message } from "antd";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from 'react-router-dom';
const RegisterSuccessPage = () => {
    const location = useLocation();
    const registerNewUser = async (registerId: string) => {
        const res = await request('get', `user/create/${registerId}`);
        if (res?.result?.error?.code && res.result.error.code == 400) {
            message.error(res.result.error.message);
            return;
        }
        return res
    }
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const registerId = params.get('register_id');
        if (registerId) {
            registerNewUser(registerId)
        }
    }, [location])
    return (
        <>
            <div style={{display: "flex", justifyContent: "center"}}>
            <h1>Register Success ! Please open the app to <Link to="/login">login</Link></h1>
            </div>
        </>
    )
}

export default RegisterSuccessPage;