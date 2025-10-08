import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Contact } from "@/types/Contact";
import type { SearchInput } from "@/types/SearchInput";
import { contactService } from "@/services/contactService";
import type { ContactInput } from "@/types/ContactInput";

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
      console.log("Erro: " + err.message)
      return rejectWithValue(err.message || "Erro ao buscar contatos");
    }
  }
);

export const addContact = createAsyncThunk(
  "contacts/addContact",
  async (contactData: ContactInput, { rejectWithValue }) => {
    try {
      const data = await contactService.addContact(contactData);
      return data;
    } catch (err: any) {
      console.log("Erro: " + err.message)
      return rejectWithValue(err.message || "Erro ao adicionar contato");
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
    createContact: (state, action: PayloadAction<Contact>) => {
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
      })
      .addCase(addContact.fulfilled, (state, action : PayloadAction<Contact>) => {
        state.contacts.push(action.payload)
      })
  },
});




export const { setContacts, createContact, updateContact, deleteContact } = contactSlice.actions;
export default contactSlice.reducer;
