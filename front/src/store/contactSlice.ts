import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  jobTitle: string;
  address: string;
  userId: string;
}

interface ContactState {
  contacts: Contact[];
}

const initialState: ContactState = {
  contacts: [],
};

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
});

export const { setContacts, addContact, updateContact, deleteContact } = contactSlice.actions;
export default contactSlice.reducer;
