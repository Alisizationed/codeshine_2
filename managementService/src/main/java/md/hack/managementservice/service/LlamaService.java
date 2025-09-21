package md.hack.managementservice.service;

import lombok.AllArgsConstructor;
import md.hack.managementservice.repository.LlamaRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@AllArgsConstructor
@Service
public class LlamaService {
    private LlamaRepository llamaRepository;

    public Flux<String> promptLlama(Mono<String> input) {
        return llamaRepository.streamPrompt(input);
    }
}
