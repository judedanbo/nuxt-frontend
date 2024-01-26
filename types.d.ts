interface Response {
    links: {next: string, previous: string};
    total_pages: number;
    total_items: number;
    page: number;
    page_size: number;
    message: string;
}
interface Category {
    id: number | undefined;
    name: string | undefined;
}

interface CategoryResponse {
    Response,
    data: Category[];
}

interface Brand {
    id: number | undefined;
    name: string | undefined;
}

interface BrandResponse {
    Response,
    data: Brand[];
}

interface Unit {
    id: number | undefined;
    name: string | undefined;
}

interface UnitResponse {
    Response,
    data: Unit[];
} 

interface Classification {
    id: number | undefined;
    name: string | undefined;
}

interface ClassificationResponse {
    Response,
    data: Classification[];
}

interface ProductForm {
    id?: number | undefined;
    name: string | undefined;
    restock_level: number | undefined;
    brand_id: number | undefined;
    category_id: number| undefined;
    unit_id: number | undefined;
    classification_id: number | undefined;
}

interface Product {
    id: number;
    name: string;
    restock_level: number;
    brand_id: Brand;
    category_id: Category;
    unit_id: Unit;
    classification_id: Classification;
}

interface ProductResponse {
    Response,
    data: Product;
}
interface FormError{
    status: undefined | number;
    text: string;
}


