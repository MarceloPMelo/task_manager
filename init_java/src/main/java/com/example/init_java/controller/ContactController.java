package com.example.init_java.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;

import com.example.init_java.model.Contact;

import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;

import com.example.init_java.exceptions.InvalidTokenException;

import com.example.init_java.exceptions.BadRequestException;
import com.example.init_java.repository.Contact.ContactRepository;
import com.example.init_java.repository.Contact.ContactSpecification;
import com.example.init_java.repository.User.UserRepository;

import org.springframework.data.jpa.domain.Specification; // necessário para usar Specification

import com.example.init_java.security.JwtService;

import jakarta.validation.Valid;

import com.example.init_java.model.User;
import com.example.init_java.dto.ContactDto;
import com.example.init_java.dto.PatchContactDto;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/contacts")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ContactController {

    private final ContactRepository contactRepository;
    private JwtService jwtService;
    private UserRepository userRepository;

    public ContactController(ContactRepository contactRepository, UserRepository userRepository,
            JwtService jwtService) {
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    // POST /contacts → cria um novo contato vinculado ao usuário do token
    @PostMapping
    public ResponseEntity<Map<String, Object>> createContact(
            @CookieValue(value = "jwt", defaultValue = "") String token,
            @Valid @RequestBody Contact contact) {

        Map<String, Object> res = new HashMap<>();
        if (token.isEmpty()) {
            throw new InvalidTokenException("Token não encontrado");
        }

        Long userId = jwtService.extractId(token);
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new BadRequestException("Usuário não encontrado");
        }

        if (contactRepository.existsByEmail(contact.getEmail())) {
            throw new BadRequestException("Email já cadastrado");
        }

        // vincula usuário ao contato
        contact.setUser(userOpt.get());
        Contact createdContact = contactRepository.save(contact);

        // monta DTO
        ContactDto contactDto = new ContactDto(
                createdContact.getId(),
                createdContact.getName(),
                createdContact.getPhone(),
                createdContact.getEmail(),
                createdContact.getCompany(),
                createdContact.getJobTitle(),
                createdContact.getAddress(),
                createdContact.getUser().getId());

        res.put("message", "Contato criado com sucesso");
        res.put("contact", contactDto);
        return ResponseEntity.status(200).body(res);

    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getContacts(
            @CookieValue(value = "jwt", defaultValue = "") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> company,
            @RequestParam(required = false) List<String> jobTitle,
            @RequestParam(required = false) String sortBy, // <-- sem default
            @RequestParam(required = false, defaultValue = "asc") String direction,
            @RequestParam MultiValueMap<String, String> allParams) {

        List<String> uniqueParams = List.of("sortBy", "direction", "search");
        for (String param : uniqueParams) {
            if (allParams.getOrDefault(param, List.of()).size() > 1) {
                throw new BadRequestException("O parâmetro '" + param + "' não pode ser enviado mais de uma vez.");
            }
        }

        // Validação de sortBy permitido
        if (sortBy != null && !sortBy.isEmpty()) {
            List<String> allowedSortFields = List.of("id", "name", "email", "company", "jobTitle");
            if (!allowedSortFields.contains(sortBy)) {
                throw new BadRequestException("Campo inválido para ordenação: " + sortBy);
            }
        }

        Long userId = jwtService.extractId(token);

        // Se sortBy for nulo, não aplica ordenação
        Pageable pageable;
        if (sortBy != null && !sortBy.isEmpty()) {
            Sort sort = direction.equalsIgnoreCase("desc")
                    ? Sort.by(sortBy).descending()
                    : Sort.by(sortBy).ascending();
            pageable = PageRequest.of(page, size, sort);
        } else {
            pageable = PageRequest.of(page, size); // sem sort
        }

        Specification<Contact> spec = Specification.where(ContactSpecification.belongsToUser(userId));

        if (search != null && !search.isEmpty()) {
            spec = spec.and(ContactSpecification.nameContains(search));
        }
        if (company != null && !company.isEmpty()) {
            spec = spec.and(ContactSpecification.companyIn(company));
        }
        if (jobTitle != null && !jobTitle.isEmpty()) {
            spec = spec.and(ContactSpecification.jobTitleIn(jobTitle));
        }

        Page<Contact> contactsPage = contactRepository.findAll(spec, pageable);

        List<ContactDto> contactList = contactsPage.getContent().stream()
                .map(contact -> new ContactDto(
                        contact.getId(),
                        contact.getName(),
                        contact.getPhone(),
                        contact.getEmail(),
                        contact.getCompany(),
                        contact.getJobTitle(),
                        contact.getAddress(),
                        contact.getUser().getId()))
                .toList();

        Map<String, Object> res = new HashMap<>();
        res.put("contacts", contactList);
        res.put("currentPage", contactsPage.getNumber());
        res.put("totalPages", contactsPage.getTotalPages());
        res.put("totalElements", contactsPage.getTotalElements());
        res.put("size", contactsPage.getSize());
        res.put("hasNext", contactsPage.hasNext());
        res.put("hasPrevious", contactsPage.hasPrevious());
        res.put("sortBy", sortBy);
        res.put("direction", direction);

        return ResponseEntity.ok(res);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTask(
            @PathVariable Long id) {

        Map<String, Object> res = new HashMap<>();

        Optional<Contact> optTask = contactRepository.findById(id);
        if (optTask.isEmpty()) {
            throw new BadRequestException("Contato não encontrado");
        }

        try {
            contactRepository.deleteById(id);
            res.put("message", "Contato deletado com sucesso");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.status(500).body(res);
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Map<String, Object>> patchContact(
            @PathVariable Long id,
            @Valid @RequestBody PatchContactDto updates) {

        Map<String, Object> res = new HashMap<>();

        Optional<Contact> optContact = contactRepository.findById(id);
        if (optContact.isEmpty()) {
            throw new BadRequestException("Contato não encontrado");
        }

        try {
            Contact existingContact = optContact.get();

            // Atualiza apenas os campos presentes no body
            if (updates.getName() != null) {
                existingContact.setName(updates.getName());
            }
            if (updates.getPhone() != null) {
                existingContact.setPhone(updates.getPhone());
            }
            if (updates.getEmail() != null) {
                existingContact.setEmail(updates.getEmail());
            }
            if (updates.getCompany() != null) {
                existingContact.setCompany(updates.getCompany());
            }
            if (updates.getJobTitle() != null) {
                existingContact.setJobTitle(updates.getJobTitle());
            }
            if (updates.getAddress() != null) {
                existingContact.setAddress(updates.getAddress());
            }

            contactRepository.save(existingContact);

            // Monta DTO de resposta
            ContactDto contactDto = new ContactDto(
                    existingContact.getId(),
                    existingContact.getName(),
                    existingContact.getPhone(),
                    existingContact.getEmail(),
                    existingContact.getCompany(),
                    existingContact.getJobTitle(),
                    existingContact.getAddress(),
                    existingContact.getUser().getId());

            res.put("message", "Contato atualizado com sucesso");
            res.put("contact", contactDto);
            return ResponseEntity.ok(res);

        } catch (Exception e) {
            res.put("error", e.getMessage());
            return ResponseEntity.status(500).body(res);
        }
    }

    @GetMapping("/filters")
    public ResponseEntity<Map<String, Object>> getDistinctFields() {
        Map<String, Object> res = new HashMap<>();
        res.put("companies", contactRepository.findDistinctCompanies());
        res.put("jobTitles", contactRepository.findDistinctJobTitles());
        return ResponseEntity.status(200).body(res);

    }

}