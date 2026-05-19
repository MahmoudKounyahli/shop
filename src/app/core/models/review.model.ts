export interface Review {
  id: string;
  userId: string;
  productId: string;
  stars: number;
  comment: string;
  createdAt: string;
  userName?: string;
}
