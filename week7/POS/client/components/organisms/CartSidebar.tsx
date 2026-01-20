import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CartItem } from "../molecules/CartItem";
import { cn } from "@/lib/utils";
import { PaymentDialog } from "./PaymentDialog";

interface CartSidebarProps {
    cart: any[];
    orderType: string;
    setOrderType: (type: string) => void;
    updateQty: (id: string, qty: number) => void;
    removeFromCart: (id: string) => void;
    subtotal: number;
    discount: number;
    total: number;
    paymentOpen: boolean;
    setPaymentOpen: (open: boolean) => void;
    handlePlaceOrder: () => void;
    isLoading: boolean;
}

export const CartSidebar: React.FC<CartSidebarProps> = (props) => {
    const {
        cart, orderType, setOrderType, updateQty,
        removeFromCart, subtotal, discount, total,
        paymentOpen, setPaymentOpen, handlePlaceOrder, isLoading
    } = props;

    return (
        <Card className="w-full lg:w-[400px] bg-[#1F1D2B] border-none flex flex-col h-full rounded-tr-none rounded-br-none rounded-tl-xl rounded-bl-xl overflow-hidden shrink-0 shadow-2xl">
            <div className="p-6 pb-0">
                <h2 className="text-xl font-semibold mb-6">Orders #34562</h2>
                <div className="flex gap-3 mb-6">
                    {["IN_STORE", "PICKUP", "SHIPPING"].map((type) => (
                        <Button
                            key={type}
                            variant={orderType === type ? "default" : "outline"}
                            onClick={() => setOrderType(type)}
                            className={cn(
                                "px-4 h-9 rounded-lg text-sm transition-all",
                                orderType === type ? "bg-primary text-white" : "bg-transparent text-primary border-gray-700 hover:bg-[#252836]"
                            )}
                        >
                            {type.replace("_", " ")}
                        </Button>
                    ))}
                </div>

                <div className="grid grid-cols-[1fr_auto_auto] gap-4 mb-4 text-sm font-semibold border-b border-gray-700 pb-2">
                    <span>Item</span>
                    <span>Qty</span>
                    <span>Price</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
                <div className="flex flex-col gap-6 pb-6">
                    {cart.length > 0 ? (
                        cart.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                updateQty={updateQty}
                                removeFromCart={removeFromCart}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500 gap-4">
                            <p>Your cart is empty</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 bg-[#1F1D2B] border-t border-gray-700 shrink-0">
                <div className="flex justify-between text-muted-foreground text-sm mb-2">
                    <span>Discount</span>
                    <span>$ {discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white font-semibold text-lg mb-6">
                    <span>Total</span>
                    <span>$ {total.toFixed(2)}</span>
                </div>

                <PaymentDialog
                    paymentOpen={paymentOpen}
                    setPaymentOpen={setPaymentOpen}
                    cartEmpty={cart.length === 0}
                    handlePlaceOrder={handlePlaceOrder}
                    isLoading={isLoading}
                    cart={cart}
                    subtotal={subtotal}
                    discount={discount}
                    total={total}
                    orderType={orderType}
                />
            </div>
        </Card>
    );
};
