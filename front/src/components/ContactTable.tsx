// src/components/ContactTable.tsx
import type { Contact } from "../types/Contact";
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";

interface ContactTableProps {
  contacts: Contact[];
  onDelete: (id: string) => void;
}

export function ContactTable({ contacts, onDelete }: ContactTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Nenhum contato encontrado.
      </div>
    );
  }

  return (

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


  );
}


