import React from 'react';
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CartItemProps {
    item: any;
    updateQty: (id: string, qty: number) => void;
    removeFromCart: (id: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, updateQty, removeFromCart }) => {
    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center">
                <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden text-[10px] flex items-center justify-center">
                    {item.image ? (
                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                    ) : 'IMG'}
                </div>
                <div className="min-w-0 pr-2">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">$ {item.price}</p>
                </div>
                <div className="flex items-center gap-2 bg-[#2D303E] rounded-lg p-1">
                    <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                        <Minus size={14} />
                    </button>
                    <span className="w-4 text-center text-sm font-medium">{item.qty}</span>
                    <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                        <Plus size={14} />
                    </button>
                </div>
                <div className="font-medium text-sm text-right w-[60px]">$ {(item.price * item.qty).toFixed(2)}</div>
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-3">
                <Input
                    placeholder="Order Note..."
                    maxLength={200}
                    className="bg-[#2D303E] border-none text-xs h-10 text-gray-400 placeholder:text-gray-500 rounded-lg focus-visible:ring-1 focus-visible:ring-primary"
                />
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeFromCart(item.id)}
                    className="border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white h-10 w-10 rounded-lg transition-all"
                >
                    <Trash2 size={18} />
                </Button>
            </div>
        </div>
    );
};
