package md.hack.managementservice.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.Objects;

@RequiredArgsConstructor
@Repository
@Log4j2
public class LlamaRepository {

    private final WebClient webClient;

    public Flux<String> streamPrompt(Mono<String> promptMono) {
        return promptMono.flatMapMany(prompt -> {
            log.info("Prompt: {}", prompt);

            Map<String, Object> body = Map.of(
                    "model", "llama3.1:8b",
                    "prompt", prompt,
                    "max_tokens", 512
            );

            return webClient.post()
                    .uri("/api/generate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToFlux(String.class)
                    .filter(Objects::nonNull);
        });
    }
}
