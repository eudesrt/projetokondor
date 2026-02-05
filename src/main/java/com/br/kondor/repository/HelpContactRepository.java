package com.br.kondor.repository;

import com.br.kondor.model.HelpContact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HelpContactRepository extends JpaRepository<HelpContact, Long> {
    List<HelpContact> findByActiveTrueOrderByDisplayOrderAsc();

    List<HelpContact> findByActiveTrueAndEmergencyTrue();
}
