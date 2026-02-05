package com.br.kondor.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "help_contacts")
public class HelpContact {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    private String role;

    @Column(name = "is_emergency")
    private boolean emergency = false;

    private boolean whatsapp = false;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    private boolean active = true;
}
