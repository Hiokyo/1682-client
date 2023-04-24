import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";

export const initialState = {
  availableMethods: [],
  methodUsed: {},
  currentOrder: "",
};

export interface PaymentMethod {
  name: string;
  _id: string;
  note: string;
}

export interface PaymentSliceState {
  availableMethods: Array<PaymentMethod>;
  methodUsed: PaymentMethod | any;
  currentOrder: string;
}

export const paymentSlice = createSlice<
  PaymentSliceState,
  SliceCaseReducers<PaymentSliceState>
>({
  name: "payment",
  initialState,
  reducers: {
    setAvailableMethods: (
      state: PaymentSliceState,
      action: PayloadAction<Array<PaymentMethod>>
    ) => {
      return {
        ...state,
        availableMethods: action.payload,
      };
    },

    setMethodUsed: (
      state: PaymentSliceState,
      action: PayloadAction<PaymentMethod>
    ) => {
      return {
        ...state,
        methodUsed: action.payload,
      };
    },

    setCurrentOrder: (
      state: PaymentSliceState,
      action: PayloadAction<string>
    ) => {
      return {
        ...state,
        currentOrder: action.payload,
      };
    },
  },
});

export const { setAvailableMethods, setMethodUsed, setCurrentOrder } =
  paymentSlice.actions;

export default paymentSlice.reducer;
