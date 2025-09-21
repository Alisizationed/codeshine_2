package md.hack.helpservice.dto;

import jakarta.validation.constraints.NotBlank;

public record ProductDto(
    @NotBlank String url,
    @NotBlank String productName,
    @NotBlank String marketSource,
    @NotBlank String productType,
    @NotBlank String price
) {
}
