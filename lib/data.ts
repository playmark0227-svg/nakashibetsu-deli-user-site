import { Girl, FilterOptions } from '@/lib/types';
import { girls, shops, reviews, pricePlans } from '@/data/mockData';

export function getAllShops() {
  return shops;
}

export function getShopById(id: string) {
  return shops.find((shop) => shop.id === id);
}

export function getAllGirls() {
  return girls;
}

export function getGirlById(id: string) {
  return girls.find((girl) => girl.id === id);
}

export function getGirlsByShop(shopId: string) {
  return girls.filter((girl) => girl.shopId === shopId);
}

export function getNewGirls(limit: number = 4) {
  return girls
    .filter((girl) => girl.isNew)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getTopRankedGirls(limit: number = 10) {
  return girls
    .sort((a, b) => a.ranking - b.ranking)
    .slice(0, limit);
}

export function filterGirls(filters: FilterOptions): Girl[] {
  return girls.filter((girl) => {
    if (filters.shopId && girl.shopId !== filters.shopId) return false;
    if (filters.ageMin && girl.age < filters.ageMin) return false;
    if (filters.ageMax && girl.age > filters.ageMax) return false;
    if (filters.heightMin && girl.height < filters.heightMin) return false;
    if (filters.heightMax && girl.height > filters.heightMax) return false;
    if (filters.bustMin && girl.bust < filters.bustMin) return false;
    if (filters.bustMax && girl.bust > filters.bustMax) return false;
    if (filters.isNew !== undefined && girl.isNew !== filters.isNew) return false;
    if (filters.availableOptions && filters.availableOptions.length > 0) {
      const hasAllOptions = filters.availableOptions.every((option) =>
        girl.availableOptions.includes(option)
      );
      if (!hasAllOptions) return false;
    }
    return true;
  });
}

export function getReviewsByGirl(girlId: string) {
  return reviews.filter((review) => review.girlId === girlId);
}

export function getReviewsByShop(shopId: string) {
  return reviews.filter((review) => review.shopId === shopId);
}

export function getPricesByShop(shopId: string) {
  return pricePlans.filter((plan) => plan.shopId === shopId);
}

export function getAverageRating(girlId: string): number {
  const girlReviews = reviews.filter((review) => review.girlId === girlId);
  if (girlReviews.length === 0) return 0;
  const sum = girlReviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / girlReviews.length) * 10) / 10;
}

export function getAllAvailableOptions(): string[] {
  const options = new Set<string>();
  girls.forEach((girl) => {
    girl.availableOptions.forEach((option) => options.add(option));
  });
  return Array.from(options);
}
