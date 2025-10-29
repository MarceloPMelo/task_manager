import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Contact } from "@/types/Contact";
import type { SearchInput } from "@/types/SearchInput";
import { contactService } from "@/services/contactService";
import type { ContactInput } from "@/types/ContactInput";
import type { Filters } from "@/types/Filters";

interface ContactState {
  contacts: Contact[],
  totalPages: number,
  filters: Filters,
  selectedContactsId: number[]
}

const initialState: ContactState = {
  contacts: [],
  totalPages: 0,
  filters: {companies: [], jobTitles: []},
  selectedContactsId: []

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

export const fetchFilters = createAsyncThunk(
  "contacts/fetchFilters",
  async (_, { rejectWithValue }) => {
    try{
      const data = await contactService.getFilters()
      return data;
    } catch (err: any) {
      console.log("Erro: " + err.message)
      return rejectWithValue(err.message || "Erro ao acessar filtros")
    }
  }
)

export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (contactId: Number, {rejectWithValue}) => {

    try{
      const data = await contactService.removeContact(contactId)
      return data.contactId;
    } catch (err: any) {
      console.log("Erro: " + err.message)
      return rejectWithValue(err.message || "Erro ao deletar contato co id: " + contactId)
    }
  }
)

export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async (
    { contactId, updateContent }: { contactId: Number; updateContent: ContactInput },
    { rejectWithValue }
  ) => {
    try {
      const data = await contactService.updateContact(contactId, updateContent);
      return data;
    } catch (err: any) {
      console.log("Erro: " + err.message);
      return rejectWithValue(
        err.message || `Erro ao atualizar contato com id: ${contactId}`
      );
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
    editContact: (state, action: PayloadAction<Contact>) => {
      const index = state.contacts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
    },
    removeContact: (state, action: PayloadAction<Number>) => {
      state.contacts = state.contacts.filter(c => c.id !== action.payload);
    },
    setSelectedContactsId: (state, action: PayloadAction<number[]>) => {
      state.selectedContactsId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchContacts.fulfilled,
        (
          state,
          action: PayloadAction<{ contacts: Contact[]; totalPages: number }>
        ) => {
          state.contacts = action.payload.contacts;
          state.totalPages = action.payload.totalPages;
        })
      .addCase(addContact.fulfilled, (state, action : PayloadAction<Contact>) => {
        state.contacts.push(action.payload)
      })
      .addCase(fetchFilters.fulfilled, (state, action : PayloadAction<Filters>) => {
        state.filters = action.payload
      })
      .addCase(deleteContact.fulfilled, (state, action : PayloadAction<Number>) => {
        state.contacts = state.contacts.filter((c) => c.id !== action.payload)
      })
      .addCase(updateContact.fulfilled, (state, action : PayloadAction<Contact>) => {
        const index = state.contacts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
      }
      })
  },
});

export const { setContacts, createContact, editContact, removeContact, setSelectedContactsId } = contactSlice.actions;
export default contactSlice.reducer;
