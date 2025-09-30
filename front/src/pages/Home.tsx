import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { ContactCard } from "@/components/ContactCard";
import type { Contact } from "@/components/ContactCard";
import { toast } from "@/hooks/use-toast";

export interface ContactInput {
    name: string;
    phone: string;
    email: string;
    company: string;
    jobTitle: string;
    address: string;
  }

const HomePage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);


  useEffect(() => {
    axios.get("http://localhost:8080/contacts", { withCredentials: true })
      .then(res => setContacts(res.data.contacts))
      .catch(err => console.error(err));
  }, []);  

  const handleDeleteContact = async (id: string) => {

    try {
      const res = await axios.delete(
        `http://localhost:8080/contacts/${id}`,
        { withCredentials: true }
      );

      setContacts(prev => prev.filter(contact => contact.id !== id));
      console.log(res);
      toast({
        title: "Contato removido",
        description: "O contato foi removido com sucesso.",
      });

    } catch (err) {
      console.error("Erro ao remover contato", err);
    }
  };;
  const totalCount = contacts.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          

          {/* Contacts Stats */}
          {contacts.length > 0 && (
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <span>•</span>
              <span>Total: {totalCount} contatos</span>
              <span>•</span>
            </div>
          )}

          {/* Tasks List */}
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <p className="text-lg mb-2">Nenhum contato ainda</p>
                  <p className="text-sm">
                    Comece adicionando seu primeiro contato acima
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 max-w-2xl mx-auto">
                {contacts.map(contact => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onDelete={handleDeleteContact}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
