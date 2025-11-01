// Shared Product model used across product, category, and cart features
// Keeping it as an interface for flexibility; can be converted to class if methods are needed later.
export interface Product {
	_id: string;
	name: string;
	sku: string;
	description: string;
	price: number;
	discount: number; // percentage 0-100
	categoryId: string | { _id: string; name: string };
	brand: string;
	images: string[];
	stock: number;
	rating: number;
	numReviews: number;
	attributes: {
		color: string;
		material: string;
		warranty: string;
	};
	isFeatured: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

// Helper to compute discounted price consistently
export function getDiscountedPrice(product: Product): number {
	return product.price * (1 - product.discount / 100);
}
