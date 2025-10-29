import { Header } from "../components/Header";
import { ContactTable } from "@/components/ContactTable";
import { Box } from "@mui/material";

const HomePage = () => {

  return (
    <Box minHeight="100vh" bgcolor="background.default">
      
      {/* Cabeçalho */}
      <Header />

      {/* Tabela de contatos */}
      <ContactTable />
    </Box>
  );
};

export default HomePage;
