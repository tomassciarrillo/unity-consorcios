package com.unity.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;

    /* tuve problemas con rol admin en el front.
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }*/


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/announcements/**")
                        .hasAnyAuthority("RESIDENT", "BUILDING_ADMIN", "SUPER_ADMIN", "ROLE_RESIDENT", "ROLE_BUILDING_ADMIN", "ROLE_SUPER_ADMIN")

                        // 1. Permitimos el GET de expensas de la unidad a Residentes y Admins
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/expenses/unit/**")
                        .hasAnyAuthority("RESIDENT", "BUILDING_ADMIN", "SUPER_ADMIN", "ROLE_RESIDENT", "ROLE_BUILDING_ADMIN", "ROLE_SUPER_ADMIN")

                        // 2. NUEVA REGLA ESPECÍFICA: Permitir el PUT para pagar expensas al rol RESIDENT (y Admins por las dudas)
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/expenses/pay/**")
                        .hasAnyAuthority("RESIDENT", "BUILDING_ADMIN", "SUPER_ADMIN", "ROLE_RESIDENT", "ROLE_BUILDING_ADMIN", "ROLE_SUPER_ADMIN")

                        // 3. Regla general para el resto de endpoints de expensas (Crear/Generar queda exclusivo de Admin)
                        .requestMatchers("/api/expenses/**")
                        .hasAnyAuthority("BUILDING_ADMIN", "SUPER_ADMIN", "ROLE_BUILDING_ADMIN", "ROLE_SUPER_ADMIN")

                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

