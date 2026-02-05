package com.br.kondor.repository;

import com.br.kondor.model.User;
import com.br.kondor.model.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    List<User> findByStatus(UserStatus status);

    @Query("SELECT u FROM User u WHERE " +
            "(:status IS NULL OR u.status = :status) AND " +
            "(:keyword IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(u.unit) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    java.util.List<User> searchUsers(com.br.kondor.model.UserStatus status, String keyword);
}
