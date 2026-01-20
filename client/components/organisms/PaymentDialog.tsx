import React from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, CreditCard, Wallet, ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface PaymentDialogProps {
    paymentOpen: boolean;
    setPaymentOpen: (open: boolean) => void;
    cartEmpty: boolean;
    handlePlaceOrder: () => void;
    isLoading: boolean;
    cart: any[];
    subtotal: number;
    discount: number;
    total: number;
    orderType: string;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = (props) => {
    const {
        paymentOpen, setPaymentOpen, cartEmpty, handlePlaceOrder, isLoading,
        cart, subtotal, discount, total, orderType
    } = props;

    return (
        <Sheet open={paymentOpen} onOpenChange={setPaymentOpen}>
            <SheetTrigger asChild>
                <Button
                    disabled={cartEmpty}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-[0_8px_24px_rgba(234,124,105,0.4)] font-semibold transition-all active:scale-[0.98]"
                >
                    Continue to Payment
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-screen sm:max-w-screen md:max-w-[900px] lg:max-w-[1000px] p-0 border-none bg-transparent flex flex-col md:flex-row gap-0 *:data-[slot=sheet-close]:hidden shadow-none h-[100vh] z-[100]">
                <SheetTitle className="sr-only">Payment Details</SheetTitle>
                <SheetDescription className="sr-only">Confirm your order and pay</SheetDescription>

                {/* Left Side: Confirmation / Order List */}
                <div className="flex-1 md:flex-[1.2] flex flex-col border-b md:border-b-0 md:border-r border-[#393C49] bg-[#1F1D2B] md:rounded-l-2xl min-h-0 overflow-hidden">
                    {/* Header Fixed */}
                    <div className="p-4 md:p-6 pb-2 shrink-0">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="p-0 hover:bg-transparent -ml-2 mb-2 md:mb-4 w-fit h-fit text-white hover:text-primary transition-colors"
                            onClick={() => setPaymentOpen(false)}
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </Button>

                        <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                                <h2 className="text-2xl md:text-[28px] font-bold text-white tracking-tight leading-none mb-2">Confirmation</h2>
                                <p className="text-[#ABBBC2] font-medium text-sm">Orders #34562</p>
                            </div>
                            <Button className="bg-primary hover:bg-primary/90 h-10 w-10 md:h-12 md:w-12 rounded-lg shadow-lg border-none text-white p-0 shrink-0 flex items-center justify-center">
                                <Plus className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>

                    {/* Scrollable List */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-6 min-h-0">
                        <div className="flex flex-col gap-4 md:gap-6 py-2">
                            {cart.map((item, index) => (
                                <div key={index} className="flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-3 items-center flex-1 overflow-hidden">
                                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-[#2D303E] text-xs text-gray-500">Img</div>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-0.5 overflow-hidden">
                                                <p className="font-medium text-white text-sm truncate">{item.name}</p>
                                                <p className="text-xs text-[#ABBBC2]">$ {item.price}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 md:gap-4 shrink-0">
                                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#2D303E] flex items-center justify-center text-white font-medium text-sm md:text-base">
                                                {item.qty}
                                            </div>
                                            <div className="font-medium text-white min-w-[50px] text-right text-base">$ {(item.price * item.qty).toFixed(2)}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 h-10 md:h-12">
                                        <Input
                                            placeholder="Order Note..."
                                            maxLength={200}
                                            className="bg-[#2D303E] border-none text-[#E0E6E9] h-full rounded-lg placeholder:text-[#ABBBC2] text-sm flex-1 focus-visible:ring-1 focus-visible:ring-primary"
                                        />
                                        <Button variant="outline" className="border-[#primary] border text-primary hover:bg-primary hover:text-white h-full w-10 md:w-12 shrink-0 rounded-lg transition-colors bg-transparent p-0 flex items-center justify-center">
                                            <Plus className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Fixed */}
                    <div className="p-4 md:p-6 pt-2 md:pt-4 border-t border-[#393C49] bg-[#1F1D2B] shrink-0">
                        <div className="flex justify-between text-[#ABBBC2] text-sm mb-2 md:mb-4">
                            <span>Discount</span>
                            <span className="font-medium">$ {discount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-white text-xl font-bold">
                            <span>Sub total</span>
                            <span>$ {total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Payment Form */}
                <div className="flex-1 min-w-0 md:min-w-[380px] flex flex-col bg-[#1F1D2B] h-full md:border-l border-[#393C49] md:rounded-r-2xl min-h-0 overflow-hidden">
                    {/* Header Fixed */}
                    <div className="p-4 md:p-6 border-b border-[#393C49] shrink-0">
                        <h2 className="text-2xl md:text-[28px] font-bold mb-2 text-white leading-none">Payment</h2>
                        <p className="text-[#ABBBC2] font-medium text-sm">3 payment method available</p>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-6 py-4 md:py-6 min-h-0">
                        <div className="space-y-4 md:space-y-6">
                            <div>
                                <h3 className="font-semibold mb-3 md:mb-4 text-white text-base md:text-lg">Payment Method</h3>
                                <div className="grid grid-cols-3 gap-2 md:gap-3">
                                    <div className="border border-[#ABBBC2] bg-[#252836] rounded-lg h-[56px] md:h-[64px] flex flex-col items-center justify-center gap-1 cursor-pointer relative hover:border-primary transition-all group">
                                        <div className="absolute top-1.5 right-1.5 bg-primary rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-white shadow-sm">✓</div>
                                        <CreditCard className="w-5 h-5 text-[#ABBBC2] group-hover:text-white transition-colors" />
                                        <span className="text-[10px] md:text-[11px] font-medium text-white truncate w-full text-center px-1">Credit Card</span>
                                    </div>
                                    <div className="border border-[#393C49] bg-[#1F1D2B] rounded-lg h-[56px] md:h-[64px] flex flex-col items-center justify-center gap-1 cursor-pointer text-[#ABBBC2] hover:bg-[#252836] hover:text-white transition-all">
                                        <span className="text-lg font-bold">P</span>
                                        <span className="text-[10px] md:text-[11px] font-medium truncate w-full text-center px-1">Paypal</span>
                                    </div>
                                    <div className="border border-[#393C49] bg-[#1F1D2B] rounded-lg h-[56px] md:h-[64px] flex flex-col items-center justify-center gap-1 cursor-pointer text-[#ABBBC2] hover:bg-[#252836] hover:text-white transition-all">
                                        <Wallet className="w-5 h-5" />
                                        <span className="text-[10px] md:text-[11px] font-medium truncate w-full text-center px-1">Cash</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-[#E0E6E9]">Cardholder Name</Label>
                                    <Input defaultValue="Levi Ackerman" maxLength={100} className="bg-[#2D303E] border-[#393C49] text-white h-10 md:h-12 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-[#E0E6E9]">Card Number</Label>
                                    <Input
                                        defaultValue="2564 1421 0897 1244"
                                        maxLength={19}
                                        className="bg-[#2D303E] border-[#393C49] text-white h-10 md:h-12 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-[#E0E6E9]">Expiration Date</Label>
                                        <Input defaultValue="02/2022" maxLength={7} className="bg-[#2D303E] border-[#393C49] text-white h-10 md:h-12 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium text-[#E0E6E9]">CVV</Label>
                                        <Input
                                            type="password"
                                            defaultValue="123"
                                            min="0"
                                            maxLength={4}
                                            onInput={(e: any) => {
                                                if (e.target.value < 0) e.target.value = 0;
                                                e.target.value = e.target.value.slice(0, 4);
                                            }}
                                            className="bg-[#2D303E] border-[#393C49] text-white h-10 md:h-12 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary tracking-widest"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#393C49]">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-[#E0E6E9]">Order Type</Label>
                                    <Select defaultValue="dine-in">
                                        <SelectTrigger className="w-full bg-[#1F1D2B] border-[#393C49] text-white rounded-lg h-10 md:h-12">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1F1D2B] border-[#393C49] text-white">
                                            <SelectItem value="dine-in">Dine In</SelectItem>
                                            <SelectItem value="togo">To Go</SelectItem>
                                            <SelectItem value="delivery">Delivery</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-[#E0E6E9]">Table no.</Label>
                                    <Input
                                        defaultValue="140"
                                        type="number"
                                        min="0"
                                        maxLength={5}
                                        onInput={(e: any) => {
                                            if (e.target.value < 0) e.target.value = 0;
                                            e.target.value = e.target.value.slice(0, 5);
                                        }}
                                        className="bg-[#1F1D2B] border-[#393C49] text-white h-10 md:h-12 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Fixed */}
                    <div className="p-4 md:p-6 pt-2 md:pt-4 mt-auto flex gap-4 shrink-0">
                        <Button
                            variant="outline"
                            className="flex-1 h-10 md:h-12 border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors font-semibold bg-transparent"
                            onClick={() => setPaymentOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 h-10 md:h-12 bg-primary hover:bg-primary/90 text-white rounded-lg shadow-[0_8px_24px_rgba(234,124,105,0.4)] font-semibold"
                            onClick={handlePlaceOrder}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Confirm Payment"}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
