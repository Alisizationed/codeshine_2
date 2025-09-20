package md.hack.managementservice.repository;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;

@RequiredArgsConstructor
@Repository
@Log4j2
public class LlamaRepository {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    private record OllamaRequest(String model, String prompt, String format) {}

    private <T> Mono<T> sendAndParse(String prompt, TypeReference<T> typeRef) {
        return webClient.post()
                .uri("/api/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(new OllamaRequest("llama3", prompt, "json"))
                .retrieve()
                .bodyToFlux(String.class)
                .collectList()
                .map(list -> String.join("", list))
                .map(full -> {
                    try {
                        return objectMapper.readValue(full, typeRef);
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to parse Ollama response: " + full, e);
                    }
                });
    }

    public Mono<String> getDishAdvice(Mono<String> wish) {
        return wish.flatMap(w -> {
            String prompt = "The user wants: " + w +
                    ". Suggest ONE dish they can prepare. " +
                    "Return ONLY the name of the dish as a JSON string (example: \"Pasta Carbonara\").";
            return sendAndParse(prompt, new TypeReference<String>() {});
        });
    }

    public Mono<List<String>> getIngredients(String dish) {
        String prompt = "List the ingredients required to make " + dish +
                ". Return ONLY a JSON array of strings.";
        return sendAndParse(prompt, new TypeReference<List<String>>() {});
    }

    public Mono<String> getRecipe(String dish, List<String> ingredients) {
        String prompt = "Write a simple recipe for " + dish +
                " using the following ingredients: " + ingredients +
                ". Return ONLY the recipe text as a JSON string.";
        return sendAndParse(prompt, new TypeReference<String>() {});
    }
}
