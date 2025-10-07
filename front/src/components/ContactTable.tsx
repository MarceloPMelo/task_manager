// src/components/ContactTable.tsx
import { useDispatch, useSelector } from "react-redux";
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  FormGroup,
  FormControlLabel
} from "@mui/material";
import type { RootState } from "@/store";
import { useEffect, useState } from "react";
import { setContacts } from "@/store/contactSlice";
import type { SearchInput } from "@/types/SearchInput";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const pageSize = 10;

type Filters = {
  companies: string[];
  jobTitles: string[];
};

export function ContactTable() {

  const dispatch = useDispatch();
  const contacts = useSelector((state: RootState) => state.contacts.contacts);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [enums, setFilters] = useState<Filters>({
    companies: [],
    jobTitles: [],
  });

  const [searchInput, setSearchInput] = useState<SearchInput>({
    search: null,
    company: null,
    jobTitle: null,
    sortBy: null,
    direction: null,
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
    fetchContacts(currentPage, searchInput);
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

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };


  const handleCompany = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const checked = e.target.checked;
    setSearchInput((prev) => ({
      ...prev,
      company: checked
        ? [...(prev.company ?? []), value]
        : (prev.company ?? []).filter((c) => c !== value),
    }));
  };

  const handleJobTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const checked = e.target.checked;
    setSearchInput((prev) => ({
      ...prev,
      jobTitle: checked
        ? [...(prev.jobTitle ?? []), value]
        : (prev.jobTitle ?? []).filter((j) => j !== value),
    }));
  };

  if (contacts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhum contato encontrado.
      </div>
    );
  }

  return (
    <Box maxWidth="lg" mx="auto" alignItems="flex-start" px={2} py={4} display="flex" gap={3}>
      {/* Filtros e ordenação */}
      <Box
      minWidth={260}
      maxWidth={320}
      flexShrink={0}
      display="flex"
      flexDirection="column"
      gap={2}
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        fetchContacts(1, searchInput);
        setCurrentPage(1);
      }}
      >
      <h1>Filtros de Busca</h1>
      <TextField
        label="Nome"
        name="nome"
        value={searchInput.search}
        onChange={(e) => setSearchInput({ ...searchInput, search: e.target.value })}
      />
      <FormGroup>
        <Typography variant="subtitle1" gutterBottom>Companies</Typography>
        {enums.companies.map((company) => (
          <FormControlLabel
            key={company}
            control={
              <Checkbox value={company}
                checked={(searchInput.company ?? []).includes(company)}
                onChange={handleCompany}
              />
            }
            label={company}
          />
        ))}
      </FormGroup>

      <FormGroup>
        <Typography variant="subtitle1" gutterBottom>Job Titles</Typography>
        {enums.jobTitles.map((jobTitle) => (
          <FormControlLabel
            key={jobTitle}
            control={
              <Checkbox value={jobTitle}
                checked={(searchInput.jobTitle ?? []).includes(jobTitle)}
                onChange={handleJobTitle}
              />
            }
            label={jobTitle}
          />
        ))}
      </FormGroup>
      <Button type="submit" variant="contained">
        Buscar
      </Button>
      </Box>

      {/* Tabela de contatos e paginação */}
      <Box flex={1} display="flex" flexDirection="column">
      <TableContainer sx={{ height: 500 }} component={Paper}>
        <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "primary.main", color: "white" }}>
          <TableCell> <Checkbox /> </TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Phone</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Company</TableCell>
          <TableCell>jobTitle</TableCell>
          <TableCell>address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contacts.length !== 0 && contacts.map((contact, index) => (
          <TableRow key={index}
            hover
            sx={{
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
            }}
          >
            <TableCell> <Checkbox /></TableCell>
            <TableCell align="left">{contact.name}</TableCell>
            <TableCell align="left">{contact.phone}</TableCell>
            <TableCell align="left">{contact.email}</TableCell>
            <TableCell align="left">{contact.company}</TableCell>
            <TableCell align="left">{contact.jobTitle}</TableCell>
            <TableCell align="left">{contact.address}</TableCell>
          </TableRow>
          ))}
        </TableBody>
        </Table>
      </TableContainer>

      {/* Paginação */}
      {contacts.length > 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" mb={3} mt={2}>
        <IconButton onClick={handlePrevPage} disabled={currentPage === 1}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="body2" mx={2}>
          Página {currentPage} de {totalPages}
        </Typography>
        <IconButton
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </IconButton>
        </Box>
      )}
      </Box>
    </Box>
  );
}




