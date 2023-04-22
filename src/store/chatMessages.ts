import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from ".";

export const initialStateValue = {
  userId: "",
  receiver: "",
  messages: [],
};

export interface ChatMessagesSliceState {
  userId: string;
  receiver: string;
  messages: Array<any>;
}

export const chatMessagesSlice = createSlice<
  ChatMessagesSliceState,
  SliceCaseReducers<ChatMessagesSliceState>
>({
  name: "chatMessages",
  initialState: initialStateValue,
  reducers: {
    setReceiver: (
      state: ChatMessagesSliceState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        receiver: action.payload,
      };
    },

    setMessages: (
      state: ChatMessagesSliceState,
      action: PayloadAction<Array<any>>
    ) => {
      return {
        ...state,
        messages: action.payload,
      };
    },

    setUserId: (
      state: ChatMessagesSliceState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        userId: action.payload,
      };
    },
  },
});

export const { setReceiver, setUserId, setMessages } =
  chatMessagesSlice.actions;

export default chatMessagesSlice.reducer;
