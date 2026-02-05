package com.br.kondor.service;

import com.br.kondor.model.HelpContact;
import com.br.kondor.repository.HelpContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HelpContactService {

    @Autowired
    private HelpContactRepository repository;

    public List<HelpContact> findAllActive() {
        return repository.findByActiveTrueOrderByDisplayOrderAsc();
    }

    public List<HelpContact> findAll() {
        return repository.findAll();
    }

    public HelpContact save(HelpContact contact) {
        return repository.save(contact);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public HelpContact findById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Contact not found"));
    }

    public void toggleActive(Long id) {
        HelpContact contact = findById(id);
        contact.setActive(!contact.isActive());
        repository.save(contact);
    }
}
