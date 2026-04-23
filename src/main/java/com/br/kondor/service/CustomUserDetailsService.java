package com.br.kondor.service;

import com.br.kondor.model.User;
import com.br.kondor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

        @Autowired
        private UserRepository userRepository;

        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                User user = userRepository.findByUsername(username.trim())
                                .orElseThrow(() -> new UsernameNotFoundException(
                                                "Usuario nao encontrado: " + username));

                System.out.println("[DEBUG] User found: " + user.getUsername() + ", active: " + user.isActive() + ", password length: " + (user.getPassword() != null ? user.getPassword().length() : 0));

                return new org.springframework.security.core.userdetails.User(
                                user.getUsername().trim(),
                                user.getPassword(),
                                user.isActive(),
                                true, true, true,
                                user.getRoles().stream()
                                                .map(role -> new SimpleGrantedAuthority(role.getName()))
                                                .collect(Collectors.toList()));
        }
}
