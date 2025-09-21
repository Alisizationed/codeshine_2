package md.hack.helpservice.mapper;

import md.hack.helpservice.dto.ProductDto;
import md.hack.helpservice.dto.ProductsResponseDto;
import md.hack.helpservice.entity.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductsResponseDto toProductsResponseDto(Product product);
    Product toProduct(ProductDto productDto);
}
