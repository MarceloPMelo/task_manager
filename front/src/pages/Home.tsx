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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import type { SearchInput } from "@/types/SearchInput";

const pageSize = 10;

type Filters = {
  companies: string[];
  jobTitles: string[];
};

// ✅ Schema de validação
const FilterSchema = Yup.object().shape({
  search: Yup.string().max(50, "Máximo 50 caracteres"),
  company: Yup.array().of(Yup.string()),
  jobTitle: Yup.array().of(Yup.string()),
});

// ✅ Componente de Select Multi
interface MySelectProps {
  name: string;
  label: string;
  options: string[];
  value: string[];
  setFieldValue: (field: string, value: any) => void;
}

const MySelect: React.FC<MySelectProps> = ({
  name,
  label,
  options,
  value,
  setFieldValue,
}) => {
  const handleChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setFieldValue(name, typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => selected.join(", ")}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            <Checkbox checked={value.indexOf(option) > -1} />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
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
    <Box minHeight="100vh" bgcolor="background.default">
      <Header />

      <Box maxWidth="lg" mx="auto" px={2} py={4}>
        {/* Formulário de busca e filtros com Formik */}
        <Formik
          initialValues={{
            search: "",
            company: [] as string[],
            jobTitle: [] as string[],
            sortBy: [] as string[],
            direction: "",
          }}
          validationSchema={FilterSchema}
          onSubmit={(values) => {
            setCurrentPage(1);
            fetchContacts(1, values);
          }}
        >
          {({ errors, touched, handleChange, values, setFieldValue }) => (
            <Form>
              <Grid
                container
                spacing={2}
                alignItems="flex-end"
                mb={3}
                justifyContent="flex-start"
              >
                <Grid >
                  <TextField
                    name="search"
                    label="Buscar por nome"
                    fullWidth
                    value={values.search}
                    onChange={handleChange}
                    placeholder="Nome do contato"
                    variant="outlined"
                    error={touched.search && Boolean(errors.search)}
                    helperText={touched.search && errors.search}
                  />
                </Grid>

                <Grid size={2}>
                  <MySelect
                    name="company"
                    label="Empresas"
                    options={filters.companies}
                    value={values.company}
                    setFieldValue={setFieldValue}
                  />
                </Grid>

                <Grid  size={2}>
                  <MySelect
                    name="jobTitle"
                    label="Cargos"
                    options={filters.jobTitles}
                    value={values.jobTitle}
                    setFieldValue={setFieldValue}
                  />
                </Grid>

                <Grid >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ height: "100%" }}
                  >
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>

        {/* Paginação */}
        {contacts.length > 0 && (
          <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
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

        {/* Tabela de contatos */}
        <ContactTable contacts={contacts} onDelete={handleDeleteContact} />
      </Box>
    </Box>
  );
};

export default HomePage;
