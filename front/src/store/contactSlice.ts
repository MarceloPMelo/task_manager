import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Contact } from "@/types/Contact";
import type { SearchInput } from "@/types/SearchInput";
import { contactService } from "@/services/contactService";

interface ContactState {
  contacts: Contact[],
  totalPages: number,
  loading: boolean,
  error: string | null,
}

const initialState: ContactState = {
  contacts: [],
  totalPages: 0,
  loading: false,
  error: null,
};

// Async thunk to fetch contacts with pagination and filters
export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (
    { page, filters }: { page: number; filters?: SearchInput },
    { rejectWithValue }
  ) => {
    try {
      const data = await contactService.getAll(page, filters);
      return data;
    } catch (err: any) {
      return rejectWithValue("Erro ao buscar contatos");
    }
  }
);

const contactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      state.contacts = action.payload;
    },
    addContact: (state, action: PayloadAction<Contact>) => {
      state.contacts.push(action.payload);
    },
    updateContact: (state, action: PayloadAction<Contact>) => {
      const index = state.contacts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
    },
    deleteContact: (state, action: PayloadAction<string>) => {
      state.contacts = state.contacts.filter(c => c.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchContacts.fulfilled,
        (
          state,
          action: PayloadAction<{ contacts: Contact[]; totalPages: number }>
        ) => {
          state.loading = false;
          state.contacts = action.payload.contacts;
          state.totalPages = action.payload.totalPages;
        }
      )
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});




export const { setContacts, addContact, updateContact, deleteContact } = contactSlice.actions;
export default contactSlice.reducer;
