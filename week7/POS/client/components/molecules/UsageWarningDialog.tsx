"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface UsageWarningDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    products: any[];
    isLoading?: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
}

export const UsageWarningDialog: React.FC<UsageWarningDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    products,
    isLoading = false,
    title = "Dependency Warning",
    description = "The following products use this raw material. If you continue, these products will be set to 'Out of Stock'.",
    confirmText = "Proceed and Deactivate Products"
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#1F1D2B] border-gray-700 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-amber-500">
                        <AlertTriangle size={20} />
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-400 mt-2">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 max-h-[200px] overflow-y-auto no-scrollbar space-y-2">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product._id} className="flex items-center gap-3 bg-[#2D303E] p-3 rounded-lg border border-gray-700/50">
                                {product.image && (
                                    <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                                )}
                                <div>
                                    <p className="font-medium text-sm">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.category}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-4 text-center text-gray-400 italic text-sm">
                            No active products are currently using this material.
                        </div>
                    )}
                </div>

                <DialogFooter className="mt-6 flex gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary/90 text-white"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
