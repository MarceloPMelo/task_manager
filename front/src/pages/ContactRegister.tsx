// src/pages/ContactRegister.tsx
import { Header } from "../components/Header";
import { ContactForm } from "@/components/ContactForm";
import { useDispatch } from "react-redux";
import { addContact } from '../store/contactSlice';
import type { ContactInput } from "../types/ContactInput";
import { type AppDispatch } from "@/store"

const ContactRegister = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddContact = async (contactData: ContactInput) => {
    dispatch(addContact(contactData))
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com navegação */}
      <Header />

      {/* Conteúdo principal */}
      <main className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Cadastrar Contato</h2>
        <ContactForm onAddContact={handleAddContact} />
      </main>
    </div>
  );
};

export default ContactRegister;
