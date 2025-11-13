export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number; // 1-5
  title?: string;
  comment: string;
  verified_purchase: boolean;
  helpful_count?: number;
  created_at: string;
  images?: string[];
}

export interface ReviewListResponse {
  reviews: ProductReview[];
  meta: {
    page: number;
    total: number;
    per_page: number;
    average_rating: number;
  };
}

