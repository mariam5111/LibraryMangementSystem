package com.authservice.authservice.Filter;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.stereotype.Component;

import com.authservice.authservice.authService.JwtService;
import com.mongodb.lang.NonNull;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    
    public JwtAuthFilter(UserDetailsService userDetailsService, JwtService jwtService){
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,@NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain) throws ServletException, IOException{

            final String authHeader = request.getHeader("Authorization");

            if(authHeader == null || !authHeader.startsWith("Bearer ")){
                filterChain.doFilter(request, response);
                return; 
            }

            try {
                final String JwtToken = authHeader.substring(7);
                final String username = jwtService.extractUsername(JwtToken);

                if(username == null || SecurityContextHolder.getContext()
                    .getAuthentication() != null){
                    filterChain.doFilter(request, response);
                    return;
                }
                String path = request.getServletPath();

                if (path.startsWith("/auth")) {
                    filterChain.doFilter(request, response);
                    return;
                }
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                if(jwtService.validateToken(JwtToken, userDetails)){
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                // Invalid token - continue without authentication
                // The authorization checks will handle the rest
            }
            filterChain.doFilter(request, response);
        }

    }
    