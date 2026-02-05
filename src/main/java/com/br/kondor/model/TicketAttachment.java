package com.br.kondor.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "ticket_attachments")
public class TicketAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;
}
