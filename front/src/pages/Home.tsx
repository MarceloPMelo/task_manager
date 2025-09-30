import { useEffect } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { ContactTable } from "@/components/ContactTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setContacts, deleteContact } from "@/store/contactSlice";
import { toast } from "@/hooks/use-toast";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const contacts = useAppSelector((state) => state.contacts.contacts);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/contacts", { withCredentials: true });
        dispatch(setContacts(res.data.contacts));
      } catch (err) {
        console.error("Erro ao buscar contatos:", err);
      }
    };

    fetchContacts();
  }, [dispatch]);

  const handleDeleteContact = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/contacts/${id}`, { withCredentials: true });
      dispatch(deleteContact(id));
      toast({
        title: "Contato removido",
        description: "O contato foi removido com sucesso.",
      });
    } catch (err) {
      console.error("Erro ao remover contato", err);
    }
  };

  const totalCount = contacts.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Estatísticas */}
        {totalCount > 0 && (
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
            <span>•</span>
            <span>Total: {totalCount} contatos</span>
            <span>•</span>
          </div>
        )}

        {/* Tabela de contatos */}
        <ContactTable contacts={contacts} onDelete={handleDeleteContact} />
      </main>
    </div>
  );
};

export default HomePage;
