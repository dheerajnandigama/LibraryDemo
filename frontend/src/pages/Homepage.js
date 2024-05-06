import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid, Box, Button } from '@mui/material';
import styled from 'styled-components';
import HomeImage from '../assets/HomeImage.svg';
import { LightPurpleButton } from '../components/buttonStyles';
import { FullscreenExit } from '@mui/icons-material';

const Homepage = () => {
    return (
        <Grid container spacing={0}>
            <Grid item md={6}>
                <Box
                    height="100%"
                    width="100%"
                    display="flex"
                    alignItems="center"
                    gap={4}
                    p={2}
                >
                    <img src={HomeImage} alt="HomeImage" style={{ width: '100%', padding: '10vh' }} />
                </Box>


            </Grid>
            <Grid item md={6} my={10}>
                <Box
                    height="100%"
                    width="100%"
                    display="flex"
                    flexDirection={'column'}
                    alignItems="center"
                    gap={4}
                    p={2}
                >
                    <StyledTitle>
                        Welcome to
                        <br />
                        School Management
                        <br />
                        System
                    </StyledTitle>
                    <StyledText>
                        Streamline school management, class organization, and add students and faculty.
                        Seamlessly track attendance, assess performance, and provide feedback.
                        Access records, view marks, and communicate effortlessly.
                    </StyledText>
                    <StyledBox>
                        <StyledLink to="/login">
                            <Button variant="contained" size="large" fullWidth>
                                Login
                            </Button>
                        </StyledLink>
                        <StyledText>
                            Don't have an account?{' '}
                            <Link to="/Adminregister" style={{ color: "#319e41" }}>
                                Sign up
                            </Link>
                        </StyledText>
                    </StyledBox>
                </Box>

            </Grid>
        </Grid>
    );
};

export default Homepage;



const StyledBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content:center;
  gap: 16px;
  padding: 24px;
`;

const StyledTitle = styled.h1`
  font-size: 4rem;
  color: #252525;
  /* font-family: "Manrope"; */
  font-weight: bold;
  padding-top: 0;
  letter-spacing: normal;
  line-height: normal;
  text-align: left;
`;

const StyledText = styled.p`
  color: #818589; 
  font-size: 1.3rem;
  margin-top: 30px;
  margin-bottom: 30px; 
  letter-spacing: normal;
  line-height: normal;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;
