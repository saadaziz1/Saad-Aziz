'use client';

import { useState } from 'react';
import { Container, Box, Typography, Grid, Paper, Chip, Divider, List, ListItem, ListItemText, Button } from '@mui/material';
import UploadZone from '../src/components/UploadZone';
import ChatWindow from '../src/components/ChatWindow';
import { Description, Info, Psychology, AutoAwesome, Article, InfoOutlined, Chat } from '@mui/icons-material';
import { Tabs, Tab } from '@mui/material';

export default function Home() {
    const [pdfInfo, setPdfInfo] = useState<{ id: string; filename: string; summary: string } | null>(null);
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Container maxWidth="xl" sx={{ py: 5, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ mb: 5, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    fontWeight="900"
                    gutterBottom
                    sx={{
                        background: 'linear-gradient(135deg, #60a5fa 0%, #f472b6 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1.5,
                        textShadow: '0 0 40px rgba(96, 165, 250, 0.3)'
                    }}
                >
                    🧠 AGENTIC PDF BRAIN
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                    Multi-Agent Intelligence for Document Analysis
                </Typography>
            </Box>

            {!pdfInfo ? (
                <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ maxWidth: 500, width: '100%' }}>
                        <UploadZone onUploadSuccess={(id, filename, summary) => setPdfInfo({ id, filename, summary })} />
                    </Box>
                </Box>
            ) : (
                <>
                    {/* Tabbed Summary and Document Info Section */}
                    <Box sx={{ mb: 3 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                border: '1px solid rgba(96, 165, 250, 0.2)',
                                background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(30, 41, 59, 0.95) 100%)',
                                backdropFilter: 'blur(10px)',
                                overflow: 'hidden'
                            }}
                        >
                            <Tabs
                                value={activeTab}
                                onChange={handleTabChange}
                                sx={{
                                    borderBottom: '1px solid rgba(96, 165, 250, 0.2)',
                                    px: 2,
                                    '& .MuiTab-root': {
                                        color: 'text.secondary',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        minHeight: 56,
                                    },
                                    '& .Mui-selected': {
                                        color: 'primary.main',
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: 'primary.main',
                                        height: 3,
                                    }
                                }}
                            >
                                <Tab icon={<Article />} iconPosition="start" label="Summary" />
                                <Tab icon={<InfoOutlined />} iconPosition="start" label="Document Info" />
                                <Tab icon={<Chat />} iconPosition="start" label="Chat with AI" />
                            </Tabs>

                            {/* Tab Panel 0: Summary */}
                            {activeTab === 0 && (
                                <Box sx={{ p: 4 }}>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                        <AutoAwesome color="primary" /> Auto-Generated Summary
                                    </Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, color: 'text.primary' }}>
                                        {pdfInfo.summary}
                                    </Typography>
                                </Box>
                            )}

                            {/* Tab Panel 1: Document Info */}
                            {activeTab === 1 && (
                                <Box sx={{ p: 4 }}>
                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                        <Description color="primary" /> Document Information
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                                                Filename
                                            </Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
                                                {pdfInfo.filename}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                                                Document ID
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem', mt: 1, color: 'primary.light' }}>
                                                {pdfInfo.id}
                                            </Typography>
                                        </Box>
                                        <Divider />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                                                Status
                                            </Typography>
                                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                                <Chip label="Processed" color="success" size="small" />
                                                <Chip label="Ready for Analysis" color="primary" size="small" variant="outlined" />
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                            {/* Tab Panel 2: Chat */}
                            {activeTab === 2 && (
                                <Box sx={{ height: 'calc(100vh - 300px)' }}>
                                    <ChatWindow pdfId={pdfInfo.id} />
                                </Box>
                            )}

                            {/* Unload Button - Always visible at bottom */}
                            <Box sx={{ p: 2, borderTop: '1px solid rgba(96, 165, 250, 0.2)', background: 'rgba(15, 23, 42, 0.5)' }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    onClick={() => setPdfInfo(null)}
                                    sx={{ fontWeight: 600, }}
                                >
                                    Unload Document & Start New Analysis
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </>
            )
            }
        </Container >
    );
}
