package com.messagerie.messagerie.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "groupes")
@Getter
@Setter
public class Groupes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String code;

    @Column(length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "commandant_id")
    private Utilisateurs commandant;

    @ElementCollection
    @CollectionTable(name = "groupe_membres", joinColumns = @JoinColumn(name = "groupe_id"))
    @Column(name = "membre")
    private List<String> membres;
}
