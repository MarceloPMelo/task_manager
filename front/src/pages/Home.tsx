import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { ContactTable } from "@/components/ContactTable";
import { useDispatch, useSelector } from "react-redux";
import type {RootState} from "../store/index"
import { setContacts, deleteContact } from "@/store/contactSlice";
import { toast } from "@/hooks/use-toast";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import type { SearchInput } from "@/types/SearchInput";

const pageSize = 10;

type Filters = {
  companies: string[];
  jobTitles: string[];
};


const HomePage = () => {
  const dispatch = useDispatch();
  const contacts = useSelector((state: RootState) => state.contacts.contacts);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    companies: [],
    jobTitles: [],
  });

  const fetchContacts = async (page: number, filters?: SearchInput) => {
    try {
      const res = await axios.get("http://localhost:8080/contacts", {
        params: {
          page: page - 1,
          size: pageSize,
          search: filters?.search || undefined,
          company: filters?.company?.length ? filters.company : undefined,
          jobTitle: filters?.jobTitle?.length ? filters.jobTitle : undefined,
          sortBy: filters?.sortBy || undefined,
          direction: filters?.direction || undefined,
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

  const fetchFilters = async () => {
    const res = await axios.get("http://localhost:8080/contacts/filters", {
      withCredentials: true,
    });
    setFilters(res.data);
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const handleDeleteContact = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/contacts/${id}`, {
        withCredentials: true,
      });
      dispatch(deleteContact(id));
      toast({
        title: "Contato removido",
        description: "O contato foi removido com sucesso.",
      });

      if (contacts.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
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
    <Box minHeight="100vh" bgcolor="background.default">
      <Header />

      <Box maxWidth="lg" mx="auto" px={2} py={4}>

        {/* Tabela de contatos */}
        <ContactTable contacts={contacts} onDelete={handleDeleteContact} />
      </Box>
    </Box>
  );
};

export default HomePage;
