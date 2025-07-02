package Gestaodetarefa.demo.auth;

import Gestaodetarefa.demo.Jwt.JwtService;
import Gestaodetarefa.demo.User.Role;
import Gestaodetarefa.demo.User.User;
import Gestaodetarefa.demo.User.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = new User();
        // --- Linhas Modificadas ---
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        // --------------------------
        user.setEmail(request.getEmail());
        user.setPassword(passEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        repository.save(user);
        var jwt = jwtService.generateToken(user);
        return new AuthenticationResponse(jwt);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        var jwt = jwtService.generateToken(user);
        return new AuthenticationResponse(jwt);
    }
}