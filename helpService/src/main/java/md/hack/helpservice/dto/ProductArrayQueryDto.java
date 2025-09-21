package md.hack.helpservice.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record ProductArrayQueryDto(
        @NotBlank List<String> products
) {
}
