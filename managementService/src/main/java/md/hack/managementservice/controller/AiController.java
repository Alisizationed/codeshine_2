package md.hack.managementservice.controller;

import md.hack.managementservice.service.LlamaService;
import org.springframework.beans.factory.annotation.Autowired;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
=======
import org.springframework.web.bind.annotation.*;
>>>>>>> 5d61273a0e3e6e7d9214e45c9186cc5e6e9e1a48
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/ai")
public class AiController {

    private final LlamaService llamaService;

    @Autowired
<<<<<<< HEAD
    public AiController(LlamaService llamaService) {
        this.llamaService = llamaService;
    }

    @PostMapping(value = "/stream", produces = "text/event-stream")
    public Flux<String> streamLlamaResponse(@RequestBody String request) {
        System.out.println("Request: " + request);
        return llamaService.promptLlama(Mono.just(request));
=======
    private LlamaService llamaService;
    @GetMapping()
    public Flux<String> getLlamaResponse(@RequestBody Mono<String> request) {
        return llamaService.promptLlama(request);
>>>>>>> 5d61273a0e3e6e7d9214e45c9186cc5e6e9e1a48
    }
}
