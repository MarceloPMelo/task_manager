import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { ContactTable } from "@/components/ContactTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setContacts, deleteContact } from "@/store/contactSlice";
import { toast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

const pageSize = 10; // número de contatos por página

const HomePage = () => {
  const dispatch = useAppDispatch();
  const contacts = useAppSelector((state) => state.contacts.contacts);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchContacts = async (page: number) => {
    try {
      const res = await axios.get("http://localhost:8080/contacts", {
        params: { page: page - 1, size: pageSize },
        withCredentials: true,
      });

      dispatch(setContacts(res.data.contacts));
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Erro ao buscar contatos:", err);
    }
  };

  useEffect(() => {
    fetchContacts(currentPage);
  }, [currentPage]);

  const handleDeleteContact = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/contacts/${id}`, { withCredentials: true });
      dispatch(deleteContact(id));
      toast({
        title: "Contato removido",
        description: "O contato foi removido com sucesso.",
      });

      // Se o último item da página atual foi removido, volte uma página se não estiver na primeira
      if (contacts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchContacts(currentPage);
      }
    } catch (err) {
      console.error("Erro ao remover contato", err);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Paginação */}
        {contacts.length > 0 && (
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Tabela de contatos */}
        <ContactTable contacts={contacts} onDelete={handleDeleteContact} />
      </main>
    </div>
  );
};

export default HomePage;
