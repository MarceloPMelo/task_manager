// src/components/ContactTable.tsx
import {
  Checkbox, Paper, Table,
  TableBody, TableCell,
  TableContainer, TableHead,
  TableRow, Box, IconButton,
  Typography, TextField, Button,
  FormGroup, FormControlLabel,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { SearchInput } from "@/types/SearchInput";
import { fetchContacts } from "@/store/contactSlice";
import { type AppDispatch, type RootState } from "@/store"
import { useDispatch, useSelector } from "react-redux";
import { contactService } from "@/services/contactService";

type Filters = {
  companies: string[];
  jobTitles: string[];
};

const sortOptions = [
  { label: "Name Asc", value: { sortBy: "name", direction: "asc" } },
  { label: "Name Desc", value: { sortBy: "name", direction: "desc" } },
  { label: "Company Asc", value: { sortBy: "company", direction: "asc" } },
  { label: "Company Desc", value: { sortBy: "company", direction: "desc" } },
  { label: "Job Title Asc", value: { sortBy: "jobTitle", direction: "asc" } },
  { label: "Job Title Desc", value: { sortBy: "jobTitle", direction: "desc" } },
  { label: "ID Asc", value: { sortBy: "id", direction: "asc" } },
  { label: "ID Desc", value: { sortBy: "id", direction: "desc" } },
  { label: "Email Asc", value: { sortBy: "email", direction: "asc" } },
  { label: "Email Desc", value: { sortBy: "email", direction: "desc" } },
];

export function ContactTable() {

  const dispatch = useDispatch<AppDispatch>();
  const contacts = useSelector((state: RootState) => state.contacts.contacts);
  const totalPages = useSelector((state: RootState) => state.contacts.totalPages);

  const [currentPage, setCurrentPage] = useState(1);
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

  useEffect(() => {
    dispatch(fetchContacts({page: currentPage, filters: searchInput}));
  }, [currentPage]);

 

  useEffect(() => {
    const fetchFilters = async () => {
      const filters : Filters = await contactService.getFilters();
      setFilters({companies: filters.companies, jobTitles: filters.jobTitles});
    };
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
          dispatch(fetchContacts({page: 1, filters: searchInput}));
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

        <FormGroup>
          <FormControl>
            <InputLabel>Sort By</InputLabel>
            <Select
              labelId="sort"
              id="sort"
              value={searchInput.sortBy && searchInput.direction ? sortOptions.find(option => option.value.sortBy === searchInput.sortBy && option.value.direction === searchInput.direction)?.label || "Clean-Sort" : "Clean-Sort"}
              label="Sort Options"
              onChange={(e) => {
                if (e.target.value === "Clean-Sort") {
                  setSearchInput({ ...searchInput, sortBy: null, direction: null })
                }

                const selectedOption = sortOptions.find(option => option.label === e.target.value);
                if (selectedOption) {
                  setSearchInput({ ...searchInput, sortBy: selectedOption.value.sortBy, direction: selectedOption.value.direction });
                }
              }}
            >
              {sortOptions.map((option) => (
                <MenuItem value={option.label}>{option.label}</MenuItem>
              ))}
              <MenuItem value="Clean-Sort">Clean Sort</MenuItem>
            </Select>
          </FormControl>

        </FormGroup>
        <Button type="submit" variant="contained">
          Buscar
        </Button>
      </Box>

      {/* Tabela de contatos e paginação */}
      <Box flex={1} display="flex" flexDirection="column" gap={3}>
        <TableContainer sx={{ height: 540 }} component={Paper}>
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




