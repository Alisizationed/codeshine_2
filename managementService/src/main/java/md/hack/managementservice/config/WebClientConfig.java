package md.hack.managementservice.config;

import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import javax.net.ssl.SSLException;

@Configuration
public class WebClientConfig {
    @Value("${ai.url}")
<<<<<<< HEAD
    private String aiUrl;
=======
    private String accountsUrl;
>>>>>>> 5d61273a0e3e6e7d9214e45c9186cc5e6e9e1a48
    @Bean
    public WebClient insecureWebClient() {
        HttpClient httpClient = HttpClient.create().secure(sslContextSpec -> {
            try {
                sslContextSpec.sslContext(SslContextBuilder
                        .forClient()
                        .trustManager(InsecureTrustManagerFactory.INSTANCE).build());
            } catch (SSLException e) {
                throw new RuntimeException(e);
            }
        });

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(aiUrl)
                .build();
    }
}
