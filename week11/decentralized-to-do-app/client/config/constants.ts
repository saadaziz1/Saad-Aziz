export const TODO_ABI = [
    {
        "type": "function",
        "name": "createTask",
        "inputs": [
            { "name": "_title", "type": "string", "internalType": "string" },
            { "name": "_description", "type": "string", "internalType": "string" }
        ],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "toggleTask",
        "inputs": [{ "name": "_id", "type": "uint256", "internalType": "uint256" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "deleteTask",
        "inputs": [{ "name": "_id", "type": "uint256", "internalType": "uint256" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "getAllTasks",
        "inputs": [],
        "outputs": [
            {
                "name": "",
                "type": "tuple[]",
                "internalType": "struct DecentralizedTodo.Task[]",
                "components": [
                    { "name": "id", "type": "uint256", "internalType": "uint256" },
                    { "name": "title", "type": "string", "internalType": "string" },
                    { "name": "description", "type": "string", "internalType": "string" },
                    { "name": "completed", "type": "bool", "internalType": "bool" },
                    { "name": "timestamp", "type": "uint256", "internalType": "uint256" },
                    { "name": "exists", "type": "bool", "internalType": "bool" }
                ]
            }
        ],
        "stateMutability": "view"
    },
    {
        "type": "event",
        "name": "TaskCreated",
        "inputs": [
            { "name": "owner", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "id", "type": "uint256", "indexed": true, "internalType": "uint256" },
            { "name": "title", "type": "string", "indexed": false, "internalType": "string" },
            { "name": "description", "type": "string", "indexed": false, "internalType": "string" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "TaskToggled",
        "inputs": [
            { "name": "owner", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "id", "type": "uint256", "indexed": true, "internalType": "uint256" },
            { "name": "completed", "type": "bool", "indexed": false, "internalType": "bool" }
        ],
        "anonymous": false
    },
    {
        "type": "event",
        "name": "TaskDeleted",
        "inputs": [
            { "name": "owner", "type": "address", "indexed": true, "internalType": "address" },
            { "name": "id", "type": "uint256", "indexed": true, "internalType": "uint256" }
        ],
        "anonymous": false
    }
] as const;

// PLACEHOLDER ADDRESS - User must update this!
export const TODO_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_TODO_CONTRACT_ADDRESS as `0x${string}`) || "0x0000000000000000000000000000000000000000"; 
