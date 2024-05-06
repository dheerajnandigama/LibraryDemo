import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useSelector } from 'react-redux';

const AdminProfile = () => {
    const { currentUser } = useSelector((state) => state.user);
    const theme = useTheme();

    return (
        <Container
            fixed
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh', // Make the container full height of the viewport
            }}
        >
            <Card sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: 650 }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h2">
                            {currentUser.name}
                        </Typography>
                        <Typography variant="h5" color="text.secondary" component="div" sx={{ mt: 2 }}>
                            Email: {currentUser.email}
                        </Typography>
                        <Typography component="div" variant="h4" sx={{ mt: 15 }}>
                            School: {currentUser.schoolName}
                        </Typography>
                    </CardContent>
                </Box>
                <CardMedia
                    component="img"
                    sx={{ width: 400, height: 400 }}
                    image={require('../../assets/admin.png')}
                    alt="Admin Image"
                />
            </Card>
        </Container>
    );
}

export default AdminProfile;
