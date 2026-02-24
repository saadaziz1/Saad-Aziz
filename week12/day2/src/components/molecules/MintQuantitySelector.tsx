import React from 'react';
import { Button } from '../atoms/Button';
import { Minus, Plus } from 'lucide-react';

interface MintQuantitySelectorProps {
    quantity: number;
    onIncrement: () => void;
    onDecrement: () => void;
    disabled?: boolean;
}

export const MintQuantitySelector: React.FC<MintQuantitySelectorProps> = ({
    quantity,
    onIncrement,
    onDecrement,
    disabled
}) => {
    return (
        <div className="flex items-center gap-4 bg-zinc-950 border border-zinc-800 p-2 rounded-xl">
            <Button
                variant="secondary"
                size="icon"
                onClick={onDecrement}
                disabled={disabled || quantity <= 1}
            >
                <Minus className="w-4 h-4" />
            </Button>

            <span className="w-8 text-center text-xl font-black font-mono text-white">
                {quantity}
            </span>

            <Button
                variant="secondary"
                size="icon"
                onClick={onIncrement}
                disabled={disabled || quantity >= 3}
            >
                <Plus className="w-4 h-4" />
            </Button>
        </div>
    );
};
