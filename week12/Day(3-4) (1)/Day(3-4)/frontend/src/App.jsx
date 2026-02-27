import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  ArrowDownUp,
  RefreshCw,
  BarChart3,
  ChevronDown,
  Info,
  ExternalLink,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

// ABIs
import ERC20_ABI from './abis/ERC20.json';
import SWAP_ABI from './abis/SimpleSwap.json';

const TOKEN_A_ADDRESS = import.meta.env.VITE_TOKEN_A_ADDRESS;
const TOKEN_B_ADDRESS = import.meta.env.VITE_TOKEN_B_ADDRESS;
const SWAP_ADDRESS = import.meta.env.VITE_SWAP_CONTRACT_ADDRESS;

function App() {
  const { address: account, isConnected } = useAccount();

  const [activeTab, setActiveTab] = useState('swap');
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('0.0');
  const [isTokenA, setIsTokenA] = useState(true);

  // Liquidity states
  const [liqAmountA, setLiqAmountA] = useState('');
  const [liqAmountB, setLiqAmountB] = useState('');

  // Pool stats
  const [reserves, setReserves] = useState(['0', '0']);
  const [balances, setBalances] = useState(['0', '0']);
  const [loading, setLoading] = useState(false);

  // Dynamic Token Symbols
  const [tokenASymbol, setTokenASymbol] = useState('TKN-A');
  const [tokenBSymbol, setTokenBSymbol] = useState('TKN-B');

  // Reset all user data on disconnect
  useEffect(() => {
    if (!isConnected) {
      setBalances(['0', '0']);
      setAmountIn('');
      setAmountOut('0.0');
      setLiqAmountA('');
      setLiqAmountB('');
      setReserves(['0', '0']);
    }
  }, [isConnected]);

  const getContracts = async (needSigner = false) => {
    if (!window.ethereum) return null;
    const provider = new ethers.BrowserProvider(window.ethereum);
    let runner = provider;
    if (needSigner) {
      try { runner = await provider.getSigner(); } catch (e) { /* use provider */ }
    }
    return {
      tokenA: new ethers.Contract(TOKEN_A_ADDRESS, ERC20_ABI, runner),
      tokenB: new ethers.Contract(TOKEN_B_ADDRESS, ERC20_ABI, runner),
      swap: new ethers.Contract(SWAP_ADDRESS, SWAP_ABI, runner)
    };
  };

  const fetchPoolData = async () => {
    try {
      const contracts = await getContracts();
      if (!contracts) return;

      const res = await contracts.swap.getReserves();
      setReserves([ethers.formatEther(res[0]), ethers.formatEther(res[1])]);

      try {
        const symA = await contracts.tokenA.symbol();
        const symB = await contracts.tokenB.symbol();
        setTokenASymbol(symA);
        setTokenBSymbol(symB);
      } catch (err) {
        console.error('Could not fetch token symbols', err);
      }

      if (account) {
        const balA = await contracts.tokenA.balanceOf(account);
        const balB = await contracts.tokenB.balanceOf(account);
        setBalances([ethers.formatEther(balA), ethers.formatEther(balB)]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPoolData();
    const interval = setInterval(fetchPoolData, 10000);
    return () => clearInterval(interval);
  }, [account, isConnected]);

  useEffect(() => {
    const getPreview = async () => {
      if (!amountIn || isNaN(amountIn) || amountIn === '0') {
        setAmountOut('0.0');
        return;
      }
      try {
        const contracts = await getContracts();
        if (!contracts) return;
        const preview = await contracts.swap.getSwapAmount(
          ethers.parseEther(amountIn),
          isTokenA
        );
        setAmountOut(ethers.formatEther(preview));
      } catch (err) {
        setAmountOut('0.0');
      }
    };
    getPreview();
  }, [amountIn, isTokenA, reserves]);

  const handleSwap = async () => {
    if (!isConnected) { toast.error('Please connect your wallet first'); return; }
    setLoading(true);
    const id = toast.loading('Processing swap...', { className: 'toast-custom' });
    try {
      const { tokenA, tokenB, swap } = await getContracts(true);
      const amount = ethers.parseEther(amountIn);
      const tokenIn = isTokenA ? tokenA : tokenB;

      toast.loading('Approving token...', { id });
      const approveTx = await tokenIn.approve(SWAP_ADDRESS, amount);
      await approveTx.wait();

      toast.loading('Swapping tokens...', { id });
      const swapTx = isTokenA ? await swap.swapAforB(amount) : await swap.swapBforA(amount);
      await swapTx.wait();

      setAmountIn('');
      fetchPoolData();
      toast.success('Swap successful! 🎉', { id });
    } catch (err) {
      toast.error(err.reason || 'Transaction failed', { id });
    }
    setLoading(false);
  };

  const handleAddLiquidity = async () => {
    if (!isConnected) { toast.error('Please connect your wallet first'); return; }
    setLoading(true);
    const id = toast.loading('Adding liquidity...', { className: 'toast-custom' });
    try {
      const { tokenA, tokenB, swap } = await getContracts(true);
      const valA = ethers.parseEther(liqAmountA);
      const valB = ethers.parseEther(liqAmountB);

      toast.loading(`Approving ${tokenASymbol}...`, { id });
      await (await tokenA.approve(SWAP_ADDRESS, valA)).wait();

      toast.loading(`Approving ${tokenBSymbol}...`, { id });
      await (await tokenB.approve(SWAP_ADDRESS, valB)).wait();

      toast.loading('Executing liquidity add...', { id });
      await (await swap.addLiquidity(valA, valB)).wait();

      setLiqAmountA('');
      setLiqAmountB('');
      fetchPoolData();
      toast.success('Liquidity added! 💧', { id });
    } catch (err) {
      toast.error(err.reason || 'Failed to add liquidity', { id });
    }
    setLoading(false);
  };

  const formatBalance = (val) => parseFloat(val).toFixed(4);

  return (
    <div className="app-wrapper">
      <Toaster position="bottom-right" />
      <div className="mesh-container">
        <div className="mesh-ball ball-1"></div>
        <div className="mesh-ball ball-2"></div>
      </div>

      <nav className="navbar">
        <div className="brand">
          <div className="brand-logo">
            <Zap size={24} color="white" fill="white" />
          </div>
          <span className="brand-name">Bhai Dex</span>
        </div>
        {/* RainbowKit Connect Button */}
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="address"
        />
      </nav>

      <main>
        <motion.div
          className="swap-card"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="card-header">
            <span className="card-title">Token Exchange</span>
            <div style={{ color: 'var(--text-muted)', cursor: 'pointer' }} onClick={fetchPoolData}>
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </div>
          </div>

          <div className="tabs-minimal">
            <button
              className={`tab-btn ${activeTab === 'swap' ? 'active' : ''}`}
              onClick={() => setActiveTab('swap')}
            >
              Swap
            </button>
            <button
              className={`tab-btn ${activeTab === 'liquidity' ? 'active' : ''}`}
              onClick={() => setActiveTab('liquidity')}
            >
              Liquidity
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'swap' ? (
              <motion.div
                key="swap-content"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="token-section">
                  <div className="section-label">
                    <span>From</span>
                    <span>Balance: {formatBalance(isTokenA ? balances[0] : balances[1])}</span>
                  </div>
                  <div className="input-row">
                    <input
                      type="number"
                      className="main-input"
                      placeholder="0.0"
                      value={amountIn}
                      onChange={(e) => setAmountIn(e.target.value)}
                    />
                    <div className="token-selector">
                      <div className="token-icon"></div>
                      <span>{isTokenA ? tokenASymbol : tokenBSymbol}</span>
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <div className="divider-action">
                  <button className="swap-trigger" onClick={() => setIsTokenA(!isTokenA)}>
                    <ArrowDownUp size={18} />
                  </button>
                </div>

                <div className="token-section">
                  <div className="section-label">
                    <span>To (Estimated)</span>
                    <span>Balance: {formatBalance(isTokenA ? balances[1] : balances[0])}</span>
                  </div>
                  <div className="input-row">
                    <input
                      type="text"
                      className="main-input"
                      readOnly
                      value={amountOut}
                    />
                    <div className="token-selector">
                      <div className="token-icon" style={{ filter: 'hue-rotate(90deg)' }}></div>
                      <span>{isTokenA ? tokenBSymbol : tokenASymbol}</span>
                      <ChevronDown size={16} />
                    </div>
                  </div>
                </div>

                <button
                  className="btn-primary"
                  disabled={
                    loading ||
                    !amountIn ||
                    !isConnected ||
                    parseFloat(amountIn) > parseFloat(isTokenA ? balances[0] : balances[1])
                  }
                  onClick={handleSwap}
                >
                  {loading ? <RefreshCw className="animate-spin" /> :
                   !isConnected ? 'Connect Wallet' :
                   parseFloat(amountIn) > parseFloat(isTokenA ? balances[0] : balances[1]) ? 'Insufficient Balance' :
                   'Execute Swap'}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="liq-content"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="token-section" style={{ marginBottom: '1rem' }}>
                  <div className="section-label">Deposit {tokenASymbol}</div>
                  <div className="input-row">
                    <input
                      type="number"
                      className="main-input"
                      placeholder="0.0"
                      value={liqAmountA}
                      onChange={(e) => setLiqAmountA(e.target.value)}
                    />
                    <div className="token-selector">
                      <div className="token-icon"></div>
                      <span>{tokenASymbol}</span>
                    </div>
                  </div>
                </div>

                <div className="token-section">
                  <div className="section-label">Deposit {tokenBSymbol}</div>
                  <div className="input-row">
                    <input
                      type="number"
                      className="main-input"
                      placeholder="0.0"
                      value={liqAmountB}
                      onChange={(e) => setLiqAmountB(e.target.value)}
                    />
                    <div className="token-selector">
                      <div className="token-icon" style={{ filter: 'hue-rotate(90deg)' }}></div>
                      <span>{tokenBSymbol}</span>
                    </div>
                  </div>
                </div>

                <button
                  className="btn-primary"
                  disabled={loading || !liqAmountA || !liqAmountB || !isConnected}
                  onClick={handleAddLiquidity}
                >
                  {loading ? <RefreshCw className="animate-spin" /> : 'Add Liquidity'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="stats-box">
            <div className="detail-row">
              <span className="label-dim" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <BarChart3 size={14} /> Pool Reserves
              </span>
              <span className="value-bright" style={{ color: 'var(--accent-green)', fontWeight: 600 }}>Active</span>
            </div>
            <div className="detail-row">
              <span className="label-dim">{tokenASymbol} Reserve</span>
              <span className="value-bright">{formatBalance(reserves[0])}</span>
            </div>
            <div className="detail-row">
              <span className="label-dim">{tokenBSymbol} Reserve</span>
              <span className="value-bright">{formatBalance(reserves[1])}</span>
            </div>
            <div className="detail-row" style={{ marginTop: '0.4rem', paddingTop: '0.4rem', borderTop: '1px solid var(--border-light)' }}>
              <span className="label-dim">Price</span>
              <span className="value-bright">
                1 {tokenASymbol} = {reserves[0] !== '0' ? (parseFloat(reserves[1]) / parseFloat(reserves[0])).toFixed(4) : '0'} {tokenBSymbol}
              </span>
            </div>
          </footer>
        </motion.div>

        <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', opacity: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info size={14} />
            <span style={{ fontSize: '0.8rem' }}>Constant Product AMM (x*y=k)</span>
          </div>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
            Docs <ExternalLink size={12} />
          </a>
        </div>
      </main>
    </div>
  );
}

export default App;
