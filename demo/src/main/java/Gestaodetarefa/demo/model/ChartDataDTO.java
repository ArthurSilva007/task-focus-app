package Gestaodetarefa.demo.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChartDataDTO {
    private List<String> labels; // Ex: ["A FAZER", "EM PROGRESSO", "CONCLUÍDO"]
    private List<Long> data;     // Ex: [5, 2, 10]
}