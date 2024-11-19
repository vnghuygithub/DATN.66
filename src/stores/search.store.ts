import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getGlobalState } from '@/utils/getGloabal';

const initialState: any = {
  ...getGlobalState(),

  searchData: [],
  trigger: 0,
};

const searchData = createSlice({
  name: 'searchData',
  initialState,
  reducers: {
    setSearchData(state, action: PayloadAction<any>) {
      state.searchData = action.payload;
      state.trigger += 1;
    },
    clearSearchData(state) {
      state.searchData = [];
    },
  },
});

export const { setSearchData,clearSearchData } = searchData.actions;


export default searchData.reducer;
