package com.example.init_java.dto;
import java.util.List;

public class PaginatedContactsResponse {

    // Campos privados para encapsular os dados
    private int size;
    private int totalPages;
    private boolean hasPrevious;
    private boolean hasNext;
    private String sortBy;
    private int currentPage;
    private List<ContactDto> contacts; // Usando o DTO de contato já existente
    private long totalElements;
    private String direction;

    // Construtor sem argumentos (padrão)
    // Essencial para frameworks como o Jackson (usado pelo Spring)
    public PaginatedContactsResponse() {
    }

    // --- Getters e Setters manuais para cada campo ---

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public boolean isHasPrevious() {
        return hasPrevious;
    }

    public void setHasPrevious(boolean hasPrevious) {
        this.hasPrevious = hasPrevious;
    }

    public boolean isHasNext() {
        return hasNext;
    }

    public void setHasNext(boolean hasNext) {
        this.hasNext = hasNext;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public int getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(int currentPage) {
        this.currentPage = currentPage;
    }

    public List<ContactDto> getContacts() {
        return contacts;
    }

    public void setContacts(List<ContactDto> contacts) {
        this.contacts = contacts;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }
}