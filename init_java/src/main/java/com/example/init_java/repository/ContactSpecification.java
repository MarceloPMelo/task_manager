package com.example.init_java.repository;

import com.example.init_java.model.Contact;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

public class ContactSpecification {

    public static Specification<Contact> belongsToUser(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Contact> nameContains(String search) {
        return (root, query, cb) ->
            cb.like(cb.lower(root.get("name")), "%" + search.toLowerCase() + "%");
    }

    public static Specification<Contact> companyIn(List<String> companies) {
        return (root, query, cb) -> root.get("company").in(companies);
    }

    public static Specification<Contact> jobTitleIn(List<String> jobTitles) {
        return (root, query, cb) -> root.get("jobTitle").in(jobTitles);
    }
}


//SELECT * FROM contacts
//WHERE user_id = :userId
//AND LOWER(name) LIKE '%joao%'
//AND company IN ('Google', 'Microsoft')
//AND job_title IN ('Dev', 'Manager')
