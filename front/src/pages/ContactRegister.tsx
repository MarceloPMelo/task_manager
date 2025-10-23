import { Header } from "../components/Header";
import { ContactForm } from "@/components/ContactForm";
import { useDispatch } from "react-redux";
import { addContact } from "../store/contactSlice";
import type { ContactInput } from "../types/ContactInput";
import { type AppDispatch } from "@/store";

import { Box, Container, Typography } from "@mui/material";

const ContactRegister = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddContact = async (contactData: ContactInput) => {
    dispatch(addContact(contactData));
  };

  return (
    <Box
      minHeight="100vh"
      bgcolor="background.default"
      display="flex"
      flexDirection="column"
    >
      {/* Header com navegação */}
      <Header />

      {/* Conteúdo principal */}
      <Container
        maxWidth="lg"
        sx={{
          mt: 4,
          mb: 4,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          Cadastrar Contato
        </Typography>

        <ContactForm onAddContact={handleAddContact} />
      </Container>
    </Box>
  );
};

export default ContactRegister;
