package Gestaodetarefa.demo.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String firstname; // Adicionado
    private String lastname;  // Adicionado
    private String email;
    private String password;
}