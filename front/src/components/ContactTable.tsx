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
  Typography
} from "@mui/material";
import type { RootState } from "@/store";
import { useEffect, useState } from "react";
import { setContacts} from "@/store/contactSlice";
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

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };


  if (contacts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhum contato encontrado.
      </div>
    );
  }

  return (
    <Box maxWidth="lg" mx="auto" alignItems="center" px={2} py={4} >

      {/* Filtros e ordenação */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        
      </Box>

      {/* Tabela de contatos */}
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
                    backgroundColor: "#f0f0f0", // ou qualquer cor que você quiser
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
    </Box>



  );
}




