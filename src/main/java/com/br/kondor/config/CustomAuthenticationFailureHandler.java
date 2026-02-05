package com.br.kondor.config;

import com.br.kondor.model.User;
import com.br.kondor.model.UserStatus;
import com.br.kondor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Component
public class CustomAuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {

        if (exception instanceof DisabledException) {
            String username = request.getParameter("username");
            Optional<User> userOptional = userRepository.findByUsername(username);

            if (userOptional.isPresent()) {
                User user = userOptional.get();
                if (user.getStatus() == UserStatus.PENDING) {
                    getRedirectStrategy().sendRedirect(request, response, "/login?pending=true");
                    return;
                } else if (user.getStatus() == UserStatus.REJECTED) {
                    getRedirectStrategy().sendRedirect(request, response, "/login?rejected=true");
                    return;
                }
            }
        }

        super.setDefaultFailureUrl("/login?error=true");
        super.onAuthenticationFailure(request, response, exception);
    }
}
