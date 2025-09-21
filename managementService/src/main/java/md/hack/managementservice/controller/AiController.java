package md.hack.managementservice.controller;

import md.hack.managementservice.service.LlamaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/ai")
public class AiController {

    private final LlamaService llamaService;

    @Autowired
    public AiController(LlamaService llamaService) {
        this.llamaService = llamaService;
    }

    @PostMapping(value = "/stream", produces = "text/event-stream")
    public Flux<String> streamLlamaResponse(@RequestBody String request) {
        System.out.println("Request: " + request);
        return llamaService.promptLlama(Mono.just(request));
    }
}
