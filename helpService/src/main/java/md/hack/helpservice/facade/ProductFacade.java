package md.hack.helpservice.facade;

import md.hack.helpservice.dto.ProductArrayQueryDto;
import md.hack.helpservice.dto.ProductsResponseDto;

public interface ProductFacade {

    ProductsResponseDto responseProductsParse(ProductArrayQueryDto productQueryDto);
}
