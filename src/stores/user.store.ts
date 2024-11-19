import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import { apiLogin } from '@/api/user.api';
import {
  IApiLoginResponse,
  ILoginContentParams,
  ILoginForm,
  ILoginParams,
} from '@/interface/user/login';
import { Locale, UserState } from '@/interface/user/user';
import { createAsyncAction } from './utils';
import { getGlobalState } from '@/utils/getGloabal';
import store from '@/stores';
import { setGlobalState } from '@/stores/global.store';
import { setLoginInfo } from './login.store';
import { message as $message } from 'antd';

const initialState: UserState = {
  ...getGlobalState(),

  locale: (localStorage.getItem('locale')! || 'vi_VN') as Locale,
  newUser: JSON.parse(localStorage.getItem('newUser')!) ?? true,
  menuList: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserItem(state, action: PayloadAction<Partial<UserState>>) {
      Object.assign(state, action.payload);
    },
  },

});

export const loginAsync = (payload: ILoginForm) => {
  return async (dispatch: Dispatch) => {
    const params: ILoginContentParams = {
      login: payload.login.trim(),
      password: payload.password,
      db: 'apecerp_sit',
    };

    const body: ILoginParams = {
      params,
    };
    
    
    const res = (await apiLogin(body)) as IApiLoginResponse;
    console.log(res);
    
    if (res) {
      if (res.result?.data?.access_token) {
        localStorage.setItem('token', res.result.data.access_token);
        localStorage.setItem('company_id', res.result.data.company_id);
        console.log('ADMIN', res.result.data.is_general_manager);
      }
      return res.result.data;
    } else {
      $message.error('Đăng nhập thất bại');
    }
  };
};
export const { setUserItem } = userSlice.actions;

export default userSlice.reducer;

export const logoutAsync = () => {
  localStorage.clear();
  return async (dispatch: Dispatch) => {
    dispatch(
      setLoginInfo({
        name: '',
        job: '',
      })
    );
    store.dispatch(
      setGlobalState({
        loading: false,
      })
    );
  };
};
