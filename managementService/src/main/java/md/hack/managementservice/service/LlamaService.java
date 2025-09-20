package md.hack.managementservice.service;

import lombok.AllArgsConstructor;
import md.hack.managementservice.DTO.DishResponse;
import md.hack.managementservice.repository.LlamaRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.List;

@AllArgsConstructor
@Service
public class LlamaService {

    private final LlamaRepository llamaRepository;

    public Mono<DishResponse> getFullAdvice(Mono<String> userWish) {
        return llamaRepository.getDishAdvice(userWish)
                .flatMap(dish ->
                        llamaRepository.getIngredients(dish)
                                .flatMap(ingredients ->
                                        llamaRepository.getRecipe(dish, ingredients)
                                                .map(recipe -> new DishResponse(dish, ingredients, recipe))
                                )
                );
    }

    public Mono<String> getDishOnly(Mono<String> userWish) {
        return llamaRepository.getDishAdvice(userWish);
    }

    public Mono<List<String>> getIngredientsForDish(String dish) {
        return llamaRepository.getIngredients(dish);
    }

    public Mono<String> getRecipeForDish(String dish, List<String> ingredients) {
        return llamaRepository.getRecipe(dish, ingredients);
    }
}
