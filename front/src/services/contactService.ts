import axios from "axios";
import type { Contact } from "@/types/Contact";
import type { SearchInput } from "@/types/SearchInput";

const BASE_URL = "http://localhost:8080/contacts";
const pageSize = 10;

export const contactService = {
    async getAll(page: number, filters?: SearchInput) {
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
    },

    async getFilters() : Promise<{ companies: string[]; jobTitles: string[] }> {
        const res = await axios.get(`${BASE_URL}/filters`, {
            withCredentials: true,
        });
        return res.data; // { companies, jobTitles }
    }



}