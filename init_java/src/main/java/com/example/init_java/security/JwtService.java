package com.example.init_java.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${security.jwt.secret:mySecretKey12345678901234567890123456789012345678901234567890}")
    private String secretKey;

    @Value("${security.jwt.expiration-ms:3600000}") // 1 hora em ms
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(String email, Long id, String name) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", id);
        claims.put("email", email);
        claims.put("name", name);
        return createToken(claims);
    }

    private String createToken(Map<String, Object> claims) {
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return extractClaim(token, claims -> claims.get("email", String.class));
    }

    public Long extractId(String token) {
        return extractClaim(token, claims -> claims.get("id", Long.class));
    }

    public String extractName(String token) {
        return extractClaim(token, claims -> claims.get("name", String.class));
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Sobrecarga compatível com auth/validate (valida por email, id, name e expiração)
    public Boolean validateToken(String token, String email, Long id, String name) {
        final String extractedEmail = extractEmail(token);
        final Long extractedId = extractId(token);
        final String extractedName = extractName(token);
        return (extractedEmail.equals(email) && extractedId.equals(id) && extractedName.equals(name) && !isTokenExpired(token));
    }

    public Boolean validateToken(String token, String email) {
        final String extractedEmail = extractEmail(token);
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }
} 