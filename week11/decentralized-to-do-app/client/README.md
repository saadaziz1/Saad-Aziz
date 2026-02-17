# Decentralized Todo App - Frontend

Built with Next.js, TailwindCSS, and Wagmi for the Kasplex Testnet.

## 🚀 Getting Started

### Prerequisites

*   Node.js & npm installed
*   MetaMask (or compatible wallet) extension
*   Kasplex Testnet configured in your wallet

### Configuration

1.  **Contract Address:**
    Open `client/config/constants.ts` and update `TODO_CONTRACT_ADDRESS` with your deployed smart contract address.

    ```typescript
    // client/config/constants.ts
    export const TODO_CONTRACT_ADDRESS = "0xYourDeployedContractAddress"; 
    ```


2.  **Environment Variables:**
    Create a `.env.local` file in the `client` directory:
    ```bash
    NEXT_PUBLIC_CHAIN_ID=167012
    NEXT_PUBLIC_RPC_URL=https://rpc.kasplextest.xyz
    NEXT_PUBLIC_BLOCK_EXPLORER_URL=https://scan.kasplextest.xyz
    NEXT_PUBLIC_TODO_CONTRACT_ADDRESS=your_deployed_contract_address
    ```

### Running Locally

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npm run dev
    ```

3.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Features

*   **Connect Wallet:** Supports MetaMask and injected wallets.
*   **Create Task:** Add new tasks with descriptions directly to the blockchain.
*   **List Tasks:** View all active and completed tasks, sorted by creation time.
*   **Toggle Completion:** Mark tasks as done/undone.
*   **Delete Task:** Remove tasks from the list (soft delete on-chain).
*   **Real-time Updates:** UI optimistically updates and confirms with blockchain transactions.

## 🎨 Design

Uses a custom "Glassmorphism" UI with:
*   Dark mode aesthetic
*   Smooth gradients and animations
*   Lucide React icons
*   TailwindCSS for styling

## ⚠️ Notes

*   This is a dApp running on a testnet. Transactions require test KAS tokens for gas fees.
*   Ensure your wallet is connected to the correct network (Kasplex Testnet).
