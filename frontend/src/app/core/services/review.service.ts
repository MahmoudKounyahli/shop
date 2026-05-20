import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Review } from '../models/review.model';
import { env } from '../config/env';

// ── Backend DTO shape ─────────────────────────────────────────────────────────

interface ReviewDto { id: number; userId: string; productId: number; stars: number; comment: string; createdAt: string; userName: string; }

// ── Mapper ────────────────────────────────────────────────────────────────────

function toReview(dto: ReviewDto): Review {
  return { id: String(dto.id), userId: dto.userId, productId: String(dto.productId), stars: dto.stars, comment: dto.comment, createdAt: dto.createdAt, userName: dto.userName };
}

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);

  getByProduct(productId: string): Observable<Review[]> {
    return this.http
      .get<ReviewDto[]>(`${env.apiUrl}/reviews/product/${productId}`)
      .pipe(map(dtos => dtos.map(toReview)));
  }

  submit(review: Omit<Review, 'id' | 'createdAt'>): Observable<Review> {
    return this.http
      .post<ReviewDto>(`${env.apiUrl}/reviews`, {
        productId: Number(review.productId),
        stars: review.stars,
        comment: review.comment,
      })
      .pipe(map(toReview));
  }
}
