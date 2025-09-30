import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  name: string | null;
  email: string | null;
}

const initialState: User = {
  name: null,
  email: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
