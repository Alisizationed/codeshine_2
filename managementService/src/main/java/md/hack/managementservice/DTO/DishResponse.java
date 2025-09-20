package md.hack.managementservice.DTO;

import java.util.List;

public record DishResponse(
        String dish,
        List<String> ingredients,
        String recipe
) {}
