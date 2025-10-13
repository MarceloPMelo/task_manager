package com.example.init_java.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;

import com.example.init_java.model.Contact;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import com.example.init_java.service.ContactService;

import jakarta.validation.Valid;
import com.example.init_java.dto.PatchContactDto;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;


import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/contacts")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createContact(@Valid @RequestBody Contact contact) {
        Map<String, Object> response = contactService.createContact(contact);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> company,
            @RequestParam(required = false) List<String> jobTitle,
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam MultiValueMap<String, String> allParams) {

        return ResponseEntity.ok(contactService.getContacts( page, size, search, company, jobTitle, sortBy, direction, allParams));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteContact(@PathVariable Long id) {
        return ResponseEntity.ok(contactService.deleteContact(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> patchContact(
            @PathVariable Long id,
            @Valid @RequestBody PatchContactDto updates) {
        return ResponseEntity.ok(contactService.patchContact(id, updates));
    }

    @GetMapping("/filters")
    public ResponseEntity<Map<String, Object>> getDistinctFields() {
        return ResponseEntity.ok(contactService.getDistinctFields());
    }
}
