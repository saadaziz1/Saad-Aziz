"use client";

import { usePOS } from "@/hooks/usePOS";
import { Tabs } from "@/components/ui/tabs";
import { POSHeader } from "@/components/organisms/POSHeader";
import { CategoryTabs } from "@/components/organisms/CategoryTabs";
import { ProductGrid } from "@/components/organisms/ProductGrid";
import { CartSidebar } from "@/components/organisms/CartSidebar";

export default function POSPage() {
    const {
        products,
        categories,
        activeCategory,
        setActiveCategory,
        currentDate,
        cart,
        subtotal,
        discount,
        total,
        paymentOpen,
        setPaymentOpen,
        orderType,
        setOrderType,
        addToCart,
        removeFromCart,
        updateQty,
        handlePlaceOrder,
        isLoading
    } = usePOS();

    return (
        <div className="flex flex-col-reverse lg:flex-row h-full w-full max-w-[1600px] mx-auto px-4 lg:px-6 gap-6 overflow-y-auto lg:overflow-hidden pb-24 lg:pb-0 no-scrollbar">
            {/* Main Content */}
            <div className="flex-1 flex flex-col gap-6 h-full shrink-0 lg:overflow-hidden">
                <POSHeader currentDate={currentDate} />

                {/* Tabs and Grid */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    <Tabs value={activeCategory} onValueChange={setActiveCategory} className="h-full flex flex-col">
                        <CategoryTabs categories={categories} />

                        <div className="flex-1 overflow-y-auto no-scrollbar pr-0 lg:pr-2">
                            <ProductGrid
                                products={products}
                                isLoading={isLoading}
                                addToCart={addToCart}
                            />
                        </div>
                    </Tabs>
                </div>
            </div>

            {/* Right Sidebar (Cart) */}
            <div className="w-full lg:w-[400px] h-auto lg:h-full shrink-0">
                <CartSidebar
                    cart={cart}
                    orderType={orderType}
                    setOrderType={setOrderType}
                    updateQty={updateQty}
                    removeFromCart={removeFromCart}
                    subtotal={subtotal}
                    discount={discount}
                    total={total}
                    paymentOpen={paymentOpen}
                    setPaymentOpen={setPaymentOpen}
                    handlePlaceOrder={handlePlaceOrder}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
