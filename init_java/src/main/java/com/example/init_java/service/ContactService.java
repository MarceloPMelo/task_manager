package com.example.init_java.service;

import com.example.init_java.dto.ContactDto;
import com.example.init_java.dto.PatchContactDto;
import com.example.init_java.exceptions.BadRequestException;
import com.example.init_java.model.Contact;
import com.example.init_java.repository.Contact.ContactRepository;
import com.example.init_java.repository.Contact.ContactSpecification;
import com.example.init_java.repository.User.UserRepository;


import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;

import jakarta.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    public ContactService(ContactRepository contactRepository, UserRepository userRepository) {
        this.contactRepository = contactRepository;
        this.userRepository = userRepository;
    }

    public Map<String, Object> createContact(@Valid Contact contact) {

        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (contactRepository.existsByEmail(contact.getEmail())) {
            throw new BadRequestException("Email já cadastrado");
        }

        contact.setUser(
                userRepository.findById(userId).orElseThrow(() -> new BadRequestException("Usuário não encontrado")));
        Contact createdContact = contactRepository.save(contact);

        
        ContactDto contactDto = toDto(createdContact);

        Map<String, Object> res = new HashMap<>();
        res.put("message", "Contato criado com sucesso");
        res.put("contact", contactDto);

        return res;
    }

    public Map<String, Object> getContacts(
            int page, int size, String search, List<String> company,
            List<String> jobTitle, String sortBy, String direction, MultiValueMap<String, String> allParams) {

        // 1. Validação dos parâmetros de entrada
        validateUniqueParams(allParams);
        validateSortBy(sortBy);

        // 2. Preparação dos dados para a consulta
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Pageable pageable = buildPageable(page, size, sortBy, direction);
        Specification<Contact> spec = buildSpecification(userId, search, company, jobTitle);

        // 3. Execução da consulta
        Page<Contact> contactsPage = contactRepository.findAll(spec, pageable);

        // 4. Formatação da resposta final
        return formatResponse(contactsPage, sortBy, direction);
    }

    public Map<String, Object> deleteContact(Long id) {
        Optional<Contact> optContact = contactRepository.findById(id);
        if (optContact.isEmpty()) {
            throw new BadRequestException("Contato não encontrado");
        }

        contactRepository.deleteById(id);
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Contato deletado com sucesso");
        return res;
    }

    public Map<String, Object> patchContact(Long id, @Valid PatchContactDto updates) {
        Optional<Contact> optContact = contactRepository.findById(id);
        if (optContact.isEmpty()) {
            throw new BadRequestException("Contato não encontrado");
        }

        Contact existingContact = optContact.get();

        if (updates.getName() != null)
            existingContact.setName(updates.getName());
        if (updates.getPhone() != null)
            existingContact.setPhone(updates.getPhone());
        if (updates.getEmail() != null)
            existingContact.setEmail(updates.getEmail());
        if (updates.getCompany() != null)
            existingContact.setCompany(updates.getCompany());
        if (updates.getJobTitle() != null)
            existingContact.setJobTitle(updates.getJobTitle());
        if (updates.getAddress() != null)
            existingContact.setAddress(updates.getAddress());

        contactRepository.save(existingContact);

        ContactDto contactDto = toDto(existingContact);
        Map<String, Object> res = new HashMap<>();
        res.put("message", "Contato atualizado com sucesso");
        res.put("contact", contactDto);
        return res;
    }

    public Map<String, Object> getDistinctFields() {
        Map<String, Object> res = new HashMap<>();
        res.put("companies", contactRepository.findDistinctCompanies());
        res.put("jobTitles", contactRepository.findDistinctJobTitles());
        return res;
    }

    // ------------------------ Métodos auxiliares ------------------------

    protected void validateUniqueParams(MultiValueMap<String, String> allParams) {
        List<String> uniqueParams = List.of("sortBy", "direction", "search");
        for (String param : uniqueParams) {
            if (allParams.getOrDefault(param, List.of()).size() > 1) {
                throw new BadRequestException("O parâmetro '" + param + "' não pode ser enviado mais de uma vez.");
            }
        }
    }

    protected void validateSortBy(String sortBy) {
        if (sortBy != null && !sortBy.isEmpty()) {
            List<String> allowedSortFields = List.of("id", "name", "email", "company", "jobTitle");
            if (!allowedSortFields.contains(sortBy)) {
                throw new BadRequestException("Campo inválido para ordenação: " + sortBy);
            }
        }
    }

    protected Pageable buildPageable(int page, int size, String sortBy, String direction) {
        if (sortBy != null && !sortBy.isEmpty()) {
            Sort sort = direction.equalsIgnoreCase("desc")
                    ? Sort.by(sortBy).descending()
                    : Sort.by(sortBy).ascending();
            return PageRequest.of(page, size, sort);
        }
        return PageRequest.of(page, size);
    }

    protected ContactDto toDto(Contact contact) {
        return new ContactDto(
                contact.getId(),
                contact.getName(),
                contact.getPhone(),
                contact.getEmail(),
                contact.getCompany(),
                contact.getJobTitle(),
                contact.getAddress(),
                contact.getUser().getId());
    }

    protected Specification<Contact> buildSpecification(Long userId, String search, List<String> company,
            List<String> jobTitle) {
        Specification<Contact> spec = Specification.where(ContactSpecification.belongsToUser(userId));

        if (search != null && !search.trim().isEmpty()) {
            spec = spec.and(ContactSpecification.nameContains(search));
        }
        if (company != null && !company.isEmpty()) {
            spec = spec.and(ContactSpecification.companyIn(company));
        }
        if (jobTitle != null && !jobTitle.isEmpty()) {
            spec = spec.and(ContactSpecification.jobTitleIn(jobTitle));
        }

        return spec;
    }

    protected Map<String, Object> formatResponse(Page<Contact> contactsPage, String sortBy, String direction) {
        List<ContactDto> contactList = contactsPage.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("contacts", contactList);
        response.put("currentPage", contactsPage.getNumber());
        response.put("totalPages", contactsPage.getTotalPages());
        response.put("totalElements", contactsPage.getTotalElements());
        response.put("size", contactsPage.getSize());
        response.put("hasNext", contactsPage.hasNext());
        response.put("hasPrevious", contactsPage.hasPrevious());
        response.put("sortBy", sortBy);
        response.put("direction", direction);

        return response;
    }
}
