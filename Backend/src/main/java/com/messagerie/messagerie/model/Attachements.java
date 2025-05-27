package com.messagerie.messagerie.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Attachements {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //    setters
    @ManyToOne
    @JoinColumn(name = "message_id")
    private Messages message_id;

    private String nomFichier;
    private String typeFichier;
    private String cheminFichier;

}
