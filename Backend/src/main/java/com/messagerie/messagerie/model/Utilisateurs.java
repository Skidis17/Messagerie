package com.messagerie.messagerie.model;
import com.messagerie.messagerie.pattern.observer.Observer;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "utilisateurs")
public class Utilisateurs implements Observer{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String nom;
    private int code;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    public void actualiser(String message) {
        System.out.println("[" + nom + "] Nouvelle notification : " + message);
    }

    public String getMdp() {
        return password;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setMdp(String mdp) {
        this.password = mdp;
    }

}




