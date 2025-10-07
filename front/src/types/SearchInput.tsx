export interface SearchInput {
    search: string | null;
    company: string[] | null;
    jobTitle: string[] | null;
    sortBy : string | null;
    direction : string | null;
}