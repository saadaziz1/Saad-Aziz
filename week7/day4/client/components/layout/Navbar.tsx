"use client";

import { Box, Container, Stack, Link, IconButton } from "@mui/material";

import { useState } from "react";

const categories = ["WOMAN", "MEN", "ALL"];

export const Navbar = () => {
    const [active, setActive] = useState("ALL");

    return (
        <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #eee", px: 6 }}>
            <Container maxWidth="xl">
                <Stack
                    direction="row"
                    height={79}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    {/* Left navigation */}
                    <Stack direction="row" spacing={3}>
                        {categories.map((item) => (
                            <Link
                                key={item}
                                href="#"
                                underline="none"
                                onClick={() => setActive(item)}
                                sx={{
                                    color: "#000",
                                    fontSize: "18px",
                                    fontWeight: active === item ? 700 : 400,
                                    borderBottom:
                                        active === item
                                            ? "2px solid #000"
                                            : "2px solid transparent",
                                    pb: 0.5,
                                    transition: "all 0.25s ease",
                                    cursor: "pointer",

                                    "&:hover": {
                                        borderBottom: "2px solid #000",
                                    },
                                }}
                            >
                                {item}
                            </Link>
                        ))}
                    </Stack>

                    {/* Logo */}
                    <Box sx={{ cursor: "pointer" }}>
                        <h3 className="text-[32px] font-light tracking-widest">
                            YOUR<span className="font-bold">SNEAKER</span>
                        </h3>
                    </Box>

                    {/* Right icons */}
                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton size="small">
                            <svg width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.9912 1C14.704 0.998743 16.3432 1.66361 17.5488 2.8418C18.7537 4.01929 19.4274 5.61254 19.4287 7.26953C19.4293 8.09042 19.2643 8.90421 18.9434 9.66406C18.6224 10.4238 18.1514 11.1162 17.5557 11.7002C16.9599 12.2841 16.2512 12.7489 15.4697 13.0664C14.688 13.384 13.8486 13.5472 13.001 13.5479C12.1534 13.5485 11.3144 13.3858 10.5322 13.0693C9.75007 12.7529 9.04013 12.2893 8.44336 11.7061C7.8469 11.1231 7.37476 10.432 7.05273 9.67285C6.73072 8.91358 6.56514 8.10006 6.56445 7.2793C6.56318 5.62242 7.23361 4.02785 8.43652 2.84863C9.64027 1.66873 11.2785 1.00132 12.9912 1ZM1 21.1367C0.999092 20.8844 1.04918 20.634 1.14746 20.3994C1.24592 20.1645 1.3911 19.9489 1.57617 19.7666C1.76128 19.5843 1.9824 19.4381 2.22754 19.3379C2.41158 19.2627 2.60626 19.2149 2.80469 19.1953L3.00391 19.1855H22.999L23.1982 19.1953C23.3963 19.2152 23.5908 19.2636 23.7744 19.3389C24.0191 19.4392 24.24 19.5854 24.4248 19.7676C24.6095 19.9497 24.7543 20.1648 24.8525 20.3994C24.9508 20.634 25.0009 20.8845 25 21.1367V23.1035C25 24.5488 23.9872 26.0023 21.8301 27.1484C19.6939 28.2833 16.6154 29 13 29C9.38481 29 6.30627 28.2825 4.16992 27.1475C2.01218 26.001 1 24.5486 1 23.1074V21.1367Z" stroke="black" strokeWidth="2" />
                            </svg>

                        </IconButton>
                        <IconButton size="small">
                            <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.4785 19.4783L26.0002 26" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M11.326 21.6521C17.0289 21.6521 21.652 17.029 21.652 11.326C21.652 5.62313 17.0289 1 11.326 1C5.6231 1 1 5.62313 1 11.326C1 17.029 5.6231 21.6521 11.326 21.6521Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                        </IconButton>
                        <IconButton size="small">
                            <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.16667 1L1 6V23.5C1 24.163 1.29266 24.7989 1.81359 25.2678C2.33453 25.7366 3.04107 26 3.77778 26H23.2222C23.9589 26 24.6655 25.7366 25.1864 25.2678C25.7073 24.7989 26 24.163 26 23.5V6L21.8333 1H5.16667Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M1 6.12695H26" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M19.125 11.2539C19.125 12.614 18.5324 13.9184 17.4775 14.8801C16.4226 15.8418 14.9918 16.3821 13.5 16.3821C12.0082 16.3821 10.5774 15.8418 9.52252 14.8801C8.46763 13.9184 7.875 12.614 7.875 11.2539" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                        </IconButton>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
};
