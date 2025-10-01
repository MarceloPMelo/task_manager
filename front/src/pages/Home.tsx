import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../components/Header";
import { ContactTable } from "@/components/ContactTable";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setContacts, deleteContact } from "@/store/contactSlice";
import { toast } from "@/hooks/use-toast";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // ✅ correto

import { ChevronLeft, ChevronRight } from "@mui/icons-material";

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
    <Box minHeight="100vh" bgcolor="background.default">
      <Header />

      <Box maxWidth="lg" mx="auto" px={2} py={4}>
        {/* Filtros e Busca */}
        <Grid container spacing={2} alignItems="flex-end" mb={3} justifyContent="flex-start">
          <Grid size={3}>
            <TextField
              label="Buscar por nome"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nome do contato"
              variant="outlined"
            />
            
          </Grid>

          <Grid size={3}>
            <TextField
              label="Filtrar por empresa"
              fullWidth
              value={company.join(",")}
              onChange={(e) => setCompany(e.target.value.split(",").map((s) => s.trim()))}
              placeholder="Ex: Encora, Google, Amazon"
              variant="outlined"
            />
          </Grid>

          <Grid size={3}>
            <TextField
              label="Filtrar por cargo"
              fullWidth
              value={jobTitle.join(",")}
              onChange={(e) => setJobTitle(e.target.value.split(",").map((s) => s.trim()))}
              placeholder="Ex: Software Engineer, Product Manager"
              variant="outlined"
            />
          </Grid>

          <Grid >
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{ height: "100%" }}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>

        {/* Paginação */}
        {contacts.length > 0 && (
          <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
            <IconButton onClick={handlePrevPage} disabled={currentPage === 1}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="body2" mx={2}>
              Página {currentPage} de {totalPages}
            </Typography>
            <IconButton onClick={handleNextPage} disabled={currentPage === totalPages}>
              <ChevronRight />
            </IconButton>
          </Box>
        )}

        {/* Tabela de contatos */}
        <ContactTable contacts={contacts} onDelete={handleDeleteContact} />
      </Box>
    </Box>
  );
};

export default HomePage;
