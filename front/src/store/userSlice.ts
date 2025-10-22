import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { userService } from "@/services/userService";

export interface User {
  name: string | null;
  email: string | null;
}

const initialState: User = {
  name: null,
  email: null,
};

export const login = createAsyncThunk(
  "users/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await userService.login(email, password);
      return { name: response.name, email: response.email };
    } catch (err: any) {
      console.log("Erro: " + err.message)
      return rejectWithValue(err.message || "Erro ao buscar contatos");
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action : PayloadAction<User>) => {
        state.name = action.payload.name;
        state.email = action.payload.email;
      })
  }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
