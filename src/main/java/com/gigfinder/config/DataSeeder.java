package com.gigfinder.config;

import com.gigfinder.model.ClientProfile;
import com.gigfinder.model.User;
import com.gigfinder.model.enums.Role;
import com.gigfinder.repository.ClientProfileRepository;
import com.gigfinder.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Optional;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedDefaultUsers(UserRepository userRepository,
                                              ClientProfileRepository clientProfileRepository,
                                              PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed ADMIN
            ensureUser(userRepository, passwordEncoder,
                    "Admin", "admin@test.com", "7000000000", "admin1234", Role.ADMIN);

            // Seed CLIENT with basic client profile
            Optional<User> clientOpt = ensureUser(userRepository, passwordEncoder,
                    "Client User", "user@test.com", "7000000001", "secret12", Role.CLIENT);
            if (clientOpt.isPresent()) {
                User client = clientOpt.get();
                clientProfileRepository.findByUser(client).orElseGet(() ->
                        clientProfileRepository.save(ClientProfile.builder()
                                .user(client)
                                .address("N/A")
                                .preferredPaymentMethod(null)
                                .locationLat(BigDecimal.ZERO)
                                .locationLng(BigDecimal.ZERO)
                                .build())
                );
            }
        };
    }

    private Optional<User> ensureUser(UserRepository userRepository,
                                      PasswordEncoder passwordEncoder,
                                      String name,
                                      String email,
                                      String phone,
                                      String rawPassword,
                                      Role role) {
        return userRepository.findByEmail(email).or(() -> {
            User user = User.builder()
                    .name(name)
                    .email(email)
                    .phone(phone)
                    .passwordHash(passwordEncoder.encode(rawPassword))
                    .role(role)
                    .build();
            return Optional.of(userRepository.save(user));
        });
    }
}


