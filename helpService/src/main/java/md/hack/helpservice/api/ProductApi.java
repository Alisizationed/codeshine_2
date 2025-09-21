package md.hack.helpservice.api;

import md.hack.helpservice.dto.ProductArrayQueryDto;
import md.hack.helpservice.dto.ProductsResponseDto;
import md.hack.helpservice.facade.ProductFacade;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/products-api")
public class ProductApi {

    @Autowired
    private final ProductFacade productFacade;

    public ProductApi(ProductFacade productFacade) {
        this.productFacade = productFacade;
    }

    @GetMapping("/get-products-by-")
    public ResponseEntity<ProductsResponseDto> getParseProductsInfo(ProductArrayQueryDto queryDto){
        return ResponseEntity.ok().body(productFacade.responseProductsParse(queryDto));
    }
}
