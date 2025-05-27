package com.messagerie.messagerie.dto;

public class UserDto {
    private Integer id;
    private String code;
    private String nom;
    private String role;

    // Constructors
    public UserDto() {
    }

    public UserDto(Integer id, String code, String nom, String role) {
        this.id = id;
        this.code = code;
        this.nom = nom;
        this.role = role;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


}