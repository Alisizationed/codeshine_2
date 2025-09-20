package md.hack.managementservice.controller;

import md.hack.managementservice.DTO.DishResponse;
import md.hack.managementservice.service.LlamaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/ai")
public class AiController {
    @Autowired
    private LlamaService llamaService;
    @GetMapping()
    public Mono<DishResponse> getLlamaResponse(@RequestBody Mono<String> request) {
        return llamaService.getFullAdvice(request);
    }
}
