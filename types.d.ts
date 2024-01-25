interface Product {
    id: number;
    name: string;
    restock_level: number;
    brand_id: { id: number; name: string };
    category_id: { id: number; name: string };
    unit_id: { id: number; name: string };
    classification_id: { id: number; name: string };
}

interface Response {
    links: {next: string, previous: string};
    total_pages: number;
    total_items: number;
    page: number;
    page_size: number;
    message: string;
}

interface ProductResponse {
    Response,
    data: Product;
}

interface Category {
    id: number;
    name: string;
}

interface CategoryResponse {
    Response,
    data: Category[];
}

interface Brand {
    id: number;
    name: string;
}

interface BrandResponse {
    Response,
    data: Brand[];
}

interface Unit {
    id: number;
    name: string;
}

interface UnitResponse {
    Response,
    data: Unit[];
} 

interface Classification {
    id: number;
    name: string;
}

interface ClassificationResponse {
    Response,
    data: Classification[];
}
interface FormError{
    status: undefined | number;
    text: string;
}

