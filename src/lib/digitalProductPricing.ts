import type { DigitalProduct } from '@/redux/api/digitalProductApi';

type PriceFields = Pick<DigitalProduct, 'priceBDT' | 'discountPriceBDT' | 'priceINR' | 'discountPriceINR'>;

/** The amount actually charged, taking a 100% discount (0) into account. */
export const getEffectiveBdtPrice = (product: PriceFields): number =>
    product.discountPriceBDT ?? product.priceBDT ?? 0;

export const getEffectiveInrPrice = (product: PriceFields): number =>
    product.discountPriceINR ?? product.priceINR ?? 0;

export const isBdtFree = (product: PriceFields): boolean => getEffectiveBdtPrice(product) <= 0;

export const isInrFree = (product: PriceFields): boolean => getEffectiveInrPrice(product) <= 0;

/** True only when a customer can claim the product without any payment. */
export const isFullyFree = (product: PriceFields): boolean =>
    isBdtFree(product) && isInrFree(product);

export const hasBdtDiscount = (product: PriceFields): boolean =>
    product.discountPriceBDT != null && product.discountPriceBDT < product.priceBDT;

export const hasInrDiscount = (product: PriceFields): boolean =>
    product.discountPriceINR != null && product.discountPriceINR < product.priceINR;
