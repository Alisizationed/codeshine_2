package md.hack.helpservice.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
public class Product {

    @Id
    private String id;
    private String url;
    private String productName;
    private String marketSource;
    private String productType;
    private Double price;

    public Product(String id, String url, String productName, String marketSource, String productType, Double price) {
        this.id = id;
        this.url = url;
        this.productName = productName;
        this.marketSource = marketSource;
        this.productType = productType;
        this.price = price;
    }

    public Product() {
    }
}
