// TypeScript interface for product
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
}

// TypeScript interface for review
export interface Review {
    id: number;
    productId: number;
    rating: number;
    comment: string;
}

// TypeScript interface for cart item
export interface CartItem {
    productId: number;
    quantity: number;
}