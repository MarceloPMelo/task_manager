import axios from "axios";
import type { Contact } from "@/types/Contact";
import type { SearchInput } from "@/types/SearchInput";
import type { ContactInput } from "@/types/ContactInput";
import type { patchContact } from "@/types/patchContact";

const BASE_URL = "http://localhost:8080/contacts";
const pageSize = 10;

export const contactService = {
    async getAll(page: number, filters?: SearchInput) {
        try {
            const res = await axios.get(BASE_URL, {
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
            return res.data; // { contacts, totalPages }
        } catch (error: any) {
            throw error.response?.data || { message: "Erro desconhecido", status: 500 };
        }
    },

    async getFilters(): Promise<{ companies: string[]; jobTitles: string[] }> {
        const res = await axios.get(`${BASE_URL}/filters`, {
            withCredentials: true,
        });
        return res.data; // { companies, jobTitles }
    },

    async removeContact(id: Number): Promise<{message: string, contactId: number}> {
        const res = await axios.delete(`${BASE_URL}/${id}`, {
            withCredentials: true,
        });
        return res.data;
    },

    async addContact(contactData: ContactInput): Promise<Contact> {
        try {
            const res = await axios.post(BASE_URL, contactData, { withCredentials: true });
            return res.data.contact;
        } catch (error: any) {
            throw error.response?.data || { message: "Erro desconhecido", status: 500 };
        }
    },

    async updateContact(id: Number, patchData: ContactInput): Promise<Contact> {
        const res = await axios.patch(
            `${BASE_URL}/${id}`,
            patchData,
            { withCredentials: true }
        );
        return res.data.contact;
    }

}