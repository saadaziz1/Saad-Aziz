/**
 * Defines how a product can be purchased
 * MONEY  -> normal purchase
 * POINTS -> only loyalty points
 * HYBRID -> either money or points
 */
export enum ProductType {
    MONEY = 'MONEY',
    POINTS = 'POINTS',
    HYBRID = 'HYBRID',
}
