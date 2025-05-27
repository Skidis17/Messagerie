package com.messagerie.messagerie.repository;

import com.messagerie.messagerie.model.Utilisateurs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.messagerie.messagerie.model.Role;
import java.util.List;
import java.util.Optional;

@Repository
public interface UtilisateursRepository extends JpaRepository<Utilisateurs, Long> {
    Optional<Utilisateurs> findByNom(String nom);
//    List<Utilisateurs> findByRole(Role role);
}
