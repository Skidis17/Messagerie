package com.messagerie.messagerie.service;

import com.messagerie.messagerie.model.UserPrincipal;
import com.messagerie.messagerie.model.Utilisateurs;
import com.messagerie.messagerie.repository.UtilisateursRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UtilisateursRepository repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        System.out.println("Loading user: " + username);
        Optional<Utilisateurs> user = repo.findByNom(username);
        if (user.isEmpty()) {
            System.out.println("User not found");
            throw new UsernameNotFoundException("User not found");
        }

        return new UserPrincipal(user.get());
    }
}
