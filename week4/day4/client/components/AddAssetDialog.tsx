import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';

interface Transaction {
  symbol: string;
  amount: number;
  price: number;
}

interface AddAssetDialogProps {
  onAddAsset: (transaction: Transaction) => void;
}

export default function AddAssetDialog({ onAddAsset }: AddAssetDialogProps) {
  const [open, setOpen] = useState(false);
  const [symbol, setSymbol] = useState('');
  const [amount, setAmount] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState({ symbol: '', amount: '', price: '' });
  const { allCoins } = useSocket();

  const filteredCoins = searchTerm.length >= 2 ? allCoins.filter(coin => {
    const coinName = coin.replace('USDT', '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return coinName.includes(search) || coin.toLowerCase().includes(search);
  }).slice(0, 50) : [];

  const handleCoinSelect = (coin: string) => {
    setSymbol(coin);
    setSearchTerm(coin.replace('USDT', ''));
    setShowDropdown(false);
    setErrors(prev => ({ ...prev, symbol: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { symbol: '', amount: '', price: '' };

    if (!symbol) {
      newErrors.symbol = 'Please select a coin';
      isValid = false;
    } else if (!allCoins.includes(symbol)) {
      newErrors.symbol = 'Selected coin does not exist';
      isValid = false;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Enter a valid positive amount';
      isValid = false;
    }

    if (!avgPrice || isNaN(parseFloat(avgPrice)) || parseFloat(avgPrice) <= 0) {
      newErrors.price = 'Enter a valid positive price';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const transaction: Transaction = {
      symbol,
      amount: parseFloat(amount),
      price: parseFloat(avgPrice)
    };

    onAddAsset(transaction);
    setSymbol('');
    setAmount('');
    setAvgPrice('');
    setSearchTerm('');
    setErrors({ symbol: '', amount: '', price: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="whitespace-nowrap">
          <Plus className="h-4 w-4 mr-2" />
          Add Asset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="text-sm font-medium mb-2 block text-foreground">Coin</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coins..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                  if (symbol) setSymbol(''); // Clear symbol if user types
                  setErrors(prev => ({ ...prev, symbol: '' }));
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                className={`pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground ${errors.symbol ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
            </div>
            {errors.symbol && <p className="text-xs text-red-500 mt-1">{errors.symbol}</p>}

            {showDropdown && searchTerm.length >= 2 && (
              <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                {filteredCoins.length > 0 ? (
                  <>
                    <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border">
                      {filteredCoins.length} coins found
                    </div>
                    {filteredCoins.map((coin) => (
                      <button
                        key={coin}
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-muted transition-colors text-sm flex items-center justify-between"
                        onClick={() => handleCoinSelect(coin)}
                      >
                        <span>{coin.replace('USDT', '/USDT')}</span>
                        <span className="text-xs text-muted-foreground">{coin}</span>
                      </button>
                    ))}
                  </>
                ) : (
                  <div className="px-3 py-2 text-sm text-muted-foreground">
                    No coins found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}
            {showDropdown && searchTerm.length > 0 && searchTerm.length < 2 && (
              <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Type at least 2 characters to search
                </div>
              </div>
            )}
            {symbol && (
              <div className="mt-2 text-sm text-muted-foreground">
                Selected: <span className="font-medium text-foreground">{symbol.replace('USDT', '/USDT')}</span>
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Amount</label>
            <Input
              type="number"
              step="any"
              min={0}
              placeholder="0.5"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrors(prev => ({ ...prev, amount: '' }));
              }}
              className={`bg-background border-border text-foreground placeholder:text-muted-foreground ${errors.amount ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Average Price (USD)</label>
            <Input
              type="number"
              step="any"
              min={0}
              placeholder="45000"
              value={avgPrice}
              onChange={(e) => {
                setAvgPrice(e.target.value);
                setErrors(prev => ({ ...prev, price: '' }));
              }}
              className={`bg-background border-border text-foreground placeholder:text-muted-foreground ${errors.price ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
          </div>
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-border hover:bg-muted"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={!symbol || !allCoins.includes(symbol)}
            >
              Add Asset
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}