package md.hack.helpservice.facade;

import jakarta.annotation.PostConstruct;
import md.hack.helpservice.dto.ProductArrayQueryDto;
import md.hack.helpservice.dto.ProductsResponseDto;
import md.hack.helpservice.parser.ParserLinelaWebsite;
import md.hack.helpservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class ProductFacadeImpl implements ProductFacade{

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ParserLinelaWebsite parserLinelaWebsite;

    @Override
    public ProductsResponseDto responseProductsParse(ProductArrayQueryDto productQueryDto) {
        return null;
    }

    @PostConstruct
    private void writeDataInDb() throws IOException {
        String[] urls = {
                "https://linella.md/en/catalog/fruits",
                "https://linella.md/en/catalog/vegetables",
                "https://linella.md/en/catalog/salads_i_greens",
                "https://linella.md/en/catalog/pickles",
                "https://linella.md/en/catalog/fast_food",
                "https://linella.md/en/catalog/salate",
                "https://linella.md/en/catalog/cheese",
                "https://linella.md/en/catalog/cream_cheese_",
                "https://linella.md/en/catalog/chocolate_tablets",
                "https://linella.md/en/catalog/wafers",
                "https://linella.md/en/catalog/chicken_meat",
                "https://linella.md/en/catalog/marinated_",
                "https://linella.md/en/catalog/dog_food",
                "https://linella.md/en/catalog/cat_litter"
        };

        for (String u : urls){
            productRepository.saveAll(parserLinelaWebsite.getParseProducts(u));
        }
    }
}
