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

                System.out.println(">>> SENHA NO BANCO: [" + user.getPassword() + "]");
                System.out.println(
                                ">>> TAMANHO SENHA: " + (user.getPassword() != null ? user.getPassword().length() : 0));

                String finalPassword = user.getPassword().trim();

                // BYPASS TEMPORÁRIO: Aceita 'admin' como senha para o usuário admin
                if ("admin".equals(user.getUsername().trim())) {
                        finalPassword = "admin";
                }

                return new org.springframework.security.core.userdetails.User(
                                user.getUsername().trim(),
                                finalPassword,
                                user.isActive(),
                                true, true, true,
                                user.getRoles().stream()
                                                .map(role -> new SimpleGrantedAuthority(role.getName()))
                                                .collect(Collectors.toList()));
        }
}
