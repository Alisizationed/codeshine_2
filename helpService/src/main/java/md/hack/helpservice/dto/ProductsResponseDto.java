package md.hack.helpservice.dto;

import jakarta.validation.constraints.NotBlank;

public record ProductsResponseDto(
        @NotBlank String url,
        @NotBlank String productName,
        @NotBlank String marketSource,
        @NotBlank Double price
) {
}