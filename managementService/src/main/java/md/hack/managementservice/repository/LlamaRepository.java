package md.hack.managementservice.repository;

<<<<<<< HEAD
=======
import java.util.Objects;
>>>>>>> 5d61273a0e3e6e7d9214e45c9186cc5e6e9e1a48
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

<<<<<<< HEAD
import java.util.Map;
import java.util.Objects;

=======
>>>>>>> 5d61273a0e3e6e7d9214e45c9186cc5e6e9e1a48
@RequiredArgsConstructor
@Repository
@Log4j2
public class LlamaRepository {

<<<<<<< HEAD
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
=======
  private final WebClient webClient;

  public Flux<String> streamPrompt(Mono<String> prompt) {
    log.info("Prompt: {}", prompt);
    return prompt.flatMapMany(
        p -> webClient
                    .post()
                    .uri("/api/generate")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(p)
                    .retrieve()
                    .bodyToFlux(String.class)
                    .filter(Objects::nonNull));
  }
>>>>>>> 5d61273a0e3e6e7d9214e45c9186cc5e6e9e1a48
}
