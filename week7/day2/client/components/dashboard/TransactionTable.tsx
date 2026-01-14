'use client';

import React from 'react';
import {
    Paper,
    Box,
    Typography,
    IconButton,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material';
import { motion } from 'framer-motion';
import { History, MoreVert } from '@mui/icons-material';

const transactions = [
    { id: 1, type: 'Received', asset: 'BTC', amount: '0.045 BTC', status: 'Completed', date: '2024-03-24' },
    { id: 2, type: 'Sent', asset: 'ETH', amount: '1.25 ETH', status: 'Pending', date: '2024-03-23' },
    { id: 3, type: 'Swapped', asset: 'SOL', amount: '45 SOL', status: 'Completed', date: '2024-03-22' },
    { id: 4, type: 'Received', asset: 'BNB', amount: '2.5 BNB', status: 'Completed', date: '2024-03-21' },
];

const TransactionTable = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <Paper sx={{
                p: { xs: 2, md: 4 },
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 4
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <History color="primary" /> Recent Transactions
                    </Typography>
                    <IconButton size="small"><MoreVert /></IconButton>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Type</TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Asset</TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Amount</TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((tx) => (
                                <TableRow key={tx.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontWeight: 500 }}>{tx.type}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{tx.asset}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>{tx.amount}</TableCell>
                                    <TableCell>
                                        <Box component="span" sx={{
                                            px: 1.5, py: 0.5, borderRadius: 10, fontSize: '0.75rem', fontWeight: 700,
                                            bgcolor: tx.status === 'Completed' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                                            color: tx.status === 'Completed' ? '#4caf50' : '#ff9800'
                                        }}>
                                            {tx.status}
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary' }}>{tx.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </motion.div>
    );
};

export default TransactionTable;
