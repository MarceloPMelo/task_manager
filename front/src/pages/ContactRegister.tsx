// src/pages/ContactRegister.tsx
import axios from "axios";
import { Header } from "../components/Header";
import { ContactForm } from "@/components/ContactForm";
import { useDispatch } from "react-redux";
import { addContact } from '../store/contactSlice';
import type { ContactInput } from "../types/ContactInput";

const ContactRegister = () => {
  const dispatch = useDispatch();

  const handleAddContact = async (contactData: ContactInput) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/contacts",
        contactData,
        { withCredentials: true }
      );

      // Atualiza a lista de contatos no estado usando addContact
      dispatch(addContact(res.data.contact));
      console.log("[ContactRegister] Contato adicionado:", res.data.contact);

    } catch (err: any) {
      if (err.response) {
        console.error("Erro ao adicionar contato:", err.response.data.message);
      } else {
        console.error("Erro ao adicionar contato:", err.message);
      }
    }
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
