// Arquivo: com/seuprojeto/dto/CreateContactResponse.java

package com.example.init_java.dto;

public class CreateContactResponse {

    private ContactDto contact;
    private String message;

    // Construtor sem argumentos (essencial para desserialização)
    public CreateContactResponse() {
    }

    // Getters e Setters

    public ContactDto getContact() {
        return contact;
    }

    public void setContact(ContactDto contact) {
        this.contact = contact;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}