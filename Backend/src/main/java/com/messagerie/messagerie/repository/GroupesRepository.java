package com.messagerie.messagerie.repository;

import com.messagerie.messagerie.model.Groupes;
import com.messagerie.messagerie.model.Utilisateurs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupesRepository extends JpaRepository<Groupes, Integer> {
    List<Groupes> findByCommandant(Utilisateurs utilisateur);
}