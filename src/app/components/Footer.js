import React from 'react';
import { Container, Grid, Link, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Footer = () => {
    const theme = useTheme();
    return (
        <Box component="footer" sx={{ backgroundColor: theme.palette.primary[20], color: 'white', padding: '20px 0' }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom>About</Typography>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li><Link href="/roadmap" color="inherit">Roadmap</Link></li>
                            <li><Link href="/our-team" color="inherit">Our Team</Link></li>
                        </ul>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom>Legal</Typography>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li><Link href="/legal/imprint" color="inherit">Imprint</Link></li>
                            <li><Link href="/legal/privacy" color="inherit">Privacy</Link></li>
                            <li><Link href="/legal/terms" color="inherit">Terms and Conditions</Link></li>
                        </ul>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="h6" gutterBottom>Contact</Typography>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li><Link href="/contact" color="inherit">Contact</Link></li>
                            <li> warren.gemini.service@gmail.com</li>
                        </ul>
                    </Grid>
                </Grid>
                <Box textAlign="center" mt={4}>
                    <Typography variant="body2">&copy; {new Date().getFullYear()} Warren Gemini. All rights reserved.</Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
