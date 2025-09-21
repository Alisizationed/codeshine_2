package md.hack.helpservice.parser;

import md.hack.helpservice.dto.ProductDto;
import md.hack.helpservice.entity.Product;
import md.hack.helpservice.mapper.ProductMapper;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class ParserLinelaWebsite {

    private static final String MARKET_SOURCE = "Linela";

    @Autowired
    private ProductMapper productMapper;


    public List<Product> getParseProducts(String url) throws IOException {

        Document document = null;
        try {
            document = Jsoup.connect(url).get();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        Element body = document.selectFirst(".catalog-content__products");
        String typeOfProduct = document.getElementsByClass("search-title").getFirst().text();
        Elements productElements = body.select(".products-catalog-content__item");

        List<Product> products = new ArrayList<>(productElements.size());

        for (Element product : productElements) {
            String name = product.attr("data-title_en");
            String price = product.attr("data-price_eu");

            products.add(productMapper.toProduct(new ProductDto(
                    url,
                    name,
                    MARKET_SOURCE,
                    typeOfProduct,
                    price
            )));
        }
        return products;
    }
}
