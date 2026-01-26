'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, TextField, IconButton, Paper, Typography, List, ListItem, Avatar, CircularProgress, Divider, Chip } from '@mui/material';
import { Send, SmartToy, Person, Route } from '@mui/icons-material';
import { useChatMutation } from '../store/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    agentPath?: string[];
}

// Helper function to parse and format JSON responses
const formatContent = (content: string): { isJson: boolean; formatted: string } => {
    try {
        // Strip markdown code fences if present
        let cleanContent = content.trim();
        if (cleanContent.startsWith('```json') || cleanContent.startsWith('```')) {
            cleanContent = cleanContent.replace(/^```json?\s*\n?/i, '').replace(/\n?```\s*$/, '');
        }

        // Try to parse as JSON
        const parsed = JSON.parse(cleanContent);

        // Format nicely for display
        if (typeof parsed === 'object' && parsed !== null) {
            let formatted = '';

            if (parsed.type) {
                formatted += `📄 Document Type: ${parsed.type}\n\n`;
            }

            if (parsed.themes && Array.isArray(parsed.themes)) {
                formatted += `🎯 Key Themes:\n${parsed.themes.map((t: string) => `  • ${t}`).join('\n')}\n\n`;
            }

            if (parsed.entities && Array.isArray(parsed.entities)) {
                formatted += `👤 Entities:\n${parsed.entities.map((e: string) => `  • ${e}`).join('\n')}`;
            }

            return { isJson: true, formatted: formatted || JSON.stringify(parsed, null, 2) };
        }
    } catch {
        // Not JSON, return as-is
    }

    return { isJson: false, formatted: content };
};

export default function ChatWindow({ pdfId }: { pdfId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [chat, { isLoading }] = useChatMutation();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const userMsg = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');

        try {
            const result = await chat({ pdfId, query: userMsg }).unwrap();
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: result.answer,
                agentPath: result.agentPath
            }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Handoff error: Specialists unreachable." }]);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden'
        }}>
            <Box sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end'
            }}>
                <Chip label="ONLINE" size="small" color="success" variant="outlined" sx={{ fontSize: 10 }} />
            </Box>
            <Box ref={scrollRef} sx={{ flexGrow: 1, overflowY: 'auto', p: 2, pt: 3 }}>
                <List>
                    {messages.map((msg, i) => {
                        const { formatted } = formatContent(msg.content);
                        return (
                            <ListItem key={i} sx={{ flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                    {msg.role === 'assistant' && <SmartToy sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />}
                                    <Typography variant="caption" color="text.secondary">
                                        {msg.role === 'assistant' ? 'Brain System' : 'Analyst'}
                                    </Typography>
                                    {msg.role === 'user' && <Person sx={{ fontSize: 16, ml: 1, color: 'secondary.main' }} />}
                                </Box>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        maxWidth: '85%',
                                        bgcolor: msg.role === 'assistant'
                                            ? 'rgba(30, 41, 59, 0.9)'
                                            : 'linear-gradient(135deg, rgba(96, 165, 250, 0.2) 0%, rgba(59, 130, 246, 0.3) 100%)',
                                        border: msg.role === 'assistant'
                                            ? '1px solid rgba(96, 165, 250, 0.2)'
                                            : '1px solid rgba(96, 165, 250, 0.4)',
                                        borderRadius: msg.role === 'assistant' ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                                        boxShadow: msg.role === 'assistant'
                                            ? '0 2px 8px rgba(0, 0, 0, 0.2)'
                                            : '0 2px 12px rgba(96, 165, 250, 0.2)'
                                    }}
                                >
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                                        {formatted}
                                    </Typography>
                                    {msg.agentPath && msg.agentPath.length > 0 && (
                                        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Route sx={{ fontSize: 12, color: 'text.secondary' }} />
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 9 }}>
                                                Path: {msg.agentPath.join(' → ')}
                                            </Typography>
                                        </Box>
                                    )}
                                </Paper>
                            </ListItem>
                        );
                    })}
                    {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                            <CircularProgress size={24} thickness={5} />
                        </Box>
                    )}
                </List>
            </Box>
            <Divider />
            <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Issue instructions to agents..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                />
                <IconButton color="primary" onClick={handleSend} disabled={isLoading || !input.trim()}>
                    <Send />
                </IconButton>
            </Box>
        </Box>
    );
}
