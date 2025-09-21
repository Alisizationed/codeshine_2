package md.hack.managementservice.repository;

import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RequiredArgsConstructor
@Repository
@Log4j2
public class LlamaRepository {

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
}
