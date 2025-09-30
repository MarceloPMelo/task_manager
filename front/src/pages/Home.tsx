import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { ContactTable } from "@/components/ContactTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setContacts, deleteContact } from "@/store/contactSlice";
import { toast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

const pageSize = 10;

const HomePage = () => {
  const dispatch = useAppDispatch();
  const contacts = useAppSelector((state) => state.contacts.contacts);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Campos de filtro
  const [search, setSearch] = useState("");
  const [company, setCompany] = useState<string[]>([]);
  const [jobTitle, setJobTitle] = useState<string[]>([]);

  const fetchContacts = async (page: number) => {
    try {
      const res = await axios.get("http://localhost:8080/contacts", {
        params: {
          page: page - 1,
          size: pageSize,
          search: search || undefined,
          company: company.length > 0 ? company : undefined,
          jobTitle: jobTitle.length > 0 ? jobTitle : undefined,
        },
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
      toast({ title: "Contato removido", description: "O contato foi removido com sucesso." });

      if (contacts.length === 1 && currentPage > 1) setCurrentPage(currentPage - 1);
      else fetchContacts(currentPage);
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

  const handleSearch = () => {
    setCurrentPage(1); // volta para a primeira página ao buscar
    fetchContacts(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-2 md:space-y-0 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Buscar por nome</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Nome do contato"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Filtrar por empresa</label>
            <input
              type="text"
              value={company.join(",")}
              onChange={(e) => setCompany(e.target.value.split(",").map(s => s.trim()))}
              className="w-full border rounded p-2"
              placeholder="Ex: Encora, Google, Amazon"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Filtrar por cargo</label>
            <input
              type="text"
              value={jobTitle.join(",")}
              onChange={(e) => setJobTitle(e.target.value.split(",").map(s => s.trim()))}
              className="w-full border rounded p-2"
              placeholder="Ex: Software Engineer, Product Manager"
            />
          </div>

          <div>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Paginação */}
        {contacts.length > 0 && (
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground mb-4">
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
