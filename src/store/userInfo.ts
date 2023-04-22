import {
  createSlice,
  PayloadAction,
  SliceCaseReducers,
} from "@reduxjs/toolkit";
import { UserInfoState } from "~/types/index";

export const initialStateValue = "";

export interface UserSliceState {
  userInfo: UserInfoState | undefined | null;
  userData: any;
  messages: Array<any>;
}

export const userSlice = createSlice<
  UserSliceState,
  SliceCaseReducers<UserSliceState>
>({
  name: "userSlice",
  initialState: {
    userData: undefined,
    userInfo: undefined,
    messages: [],
  },
  reducers: {
    setUserInfo: (
      state: UserSliceState,
      action: PayloadAction<UserSliceState>
    ) => {
      const userData = action.payload;
      return {
        ...state,
        userData,
      };
    },

    setUserMessages: (
      state: UserSliceState,
      action: PayloadAction<Array<any>>
    ) => {
      return {
        ...state,
        messages: action.payload,
      };
    },
  },
});

export const { setUserInfo, setUserMessages } = userSlice.actions;

export default userSlice.reducer;
