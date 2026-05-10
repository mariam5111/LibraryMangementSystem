package com.LMS.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@SpringBootApplication
@EnableConfigurationProperties(GatewayUriConfiguration.class)
@RestController
public class GatewayApplication {

    @Bean
    // creates routes for microservices
    public RouteLocator myRoutes(RouteLocatorBuilder builder, GatewayUriConfiguration uriConfiguration) {
	String authUri = uriConfiguration.getAuthServiceUri();
	String libraryUri = uriConfiguration.getLibraryServiceUri();

	// Routing strategy kal2aty:
	// /authentication/** -> auth service (login/registration endpoints)
	// /library/** when Authorization is confirmed -> forward to library service
	// /library/** when !Authorization -> forward to auth service (so callers can authenticate first)

	return builder.routes()
    // AUTH SERVICE
    .route("auth-route", r -> r.path("/auth/**")
        .filters(f -> f.circuitBreaker(config -> config
            .setName("auth-cb")
            .setFallbackUri("forward:/fallback")))
        .uri(authUri))

    // LIBRARY SERVICE — all lib endpoints
    .route("library-route", r -> r.path(
            "/library/**",
            "/admin/**",
            "/librarian/**",
            "/member/**",
            "/borrow/**")
        .filters(f -> f.circuitBreaker(config -> config
            .setName("library-cb")
            .setFallbackUri("forward:/fallback")))
        .uri(libraryUri))

    // ROOT → LOGIN (optional)
    .route("root-redirect", r -> r.path("/", "/login")
        .filters(f -> f.redirect(302, "/auth/login"))
        .uri("http://localhost:8081"))

    .build();
}

@RequestMapping("/fallback")
    public Mono<java.util.Map<String, String>> fallback() {
    java.util.Map<String, String> response = new java.util.HashMap<>();
    response.put("message", "Service is currently unavailable. Please try again later.");
    return Mono.just(response);
}
	public static void main(String[] args) {
		SpringApplication.run(GatewayApplication.class, args);
	}
@Bean
public org.springframework.web.cors.reactive.CorsWebFilter corsWebFilter() {
    org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource source =
        new org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource();
    org.springframework.web.cors.CorsConfiguration corsConfig =
        new org.springframework.web.cors.CorsConfiguration();
    corsConfig.addAllowedOriginPattern("*");
    corsConfig.setMaxAge(3600L);
    corsConfig.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
    corsConfig.addAllowedHeader("*");
    corsConfig.setAllowCredentials(false);
    source.registerCorsConfiguration("/**", corsConfig);
    return new org.springframework.web.cors.reactive.CorsWebFilter(source);
}

}
