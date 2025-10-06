import { ContactTable } from '@/components/ContactTable'
import {Search} from '../components/Search'
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import axios from 'axios';
import { deleteContact, setContacts } from '@/store/contactSlice';
import type { SearchInput } from '@/types/SearchInput';
import { useEffect } from 'react';

const SearchPage = () => {
  const handleDeleteContact = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/contacts/${id}`, {
        withCredentials: true,
      });
      dispatch(deleteContact(id));
    } catch (err) {
      console.error("Erro ao remover contato", err);
    }
  };

  const fetchContacts = async (page: number, filters?: SearchInput) => {
    try {
      const res = await axios.get("http://localhost:8080/contacts", {
        params: {
          page: page - 1,
          size: 10,
          search: filters?.search || undefined,
          company: filters?.company?.length ? filters.company : undefined,
          jobTitle: filters?.jobTitle?.length ? filters.jobTitle : undefined,
          sortBy: filters?.sortBy || undefined,
          direction: filters?.direction || undefined,
        },
        withCredentials: true,
      });

      dispatch(setContacts(res.data.contacts));
      
    } catch (err) {
      console.error("Erro ao buscar contatos:", err);
    }
  };

  useEffect(() => {
    fetchContacts(1);
  }, []);






  const dispatch = useDispatch();
  const contacts = useSelector((state: RootState) => state.contacts.contacts);
  return <ContactTable contacts={contacts} onDelete={handleDeleteContact} />
}

export default SearchPage