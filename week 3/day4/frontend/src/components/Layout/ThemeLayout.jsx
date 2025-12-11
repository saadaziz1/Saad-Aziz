import React, { useMemo } from 'react'
import { useThemeStore } from '../../stores/themeStore'
import { getTheme } from '../../theme'
import { CssBaseline, ThemeProvider } from '@mui/material'

const ThemeLayout = ({children}) => {
    const themeMode = useThemeStore((state => state.theme))
   const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
       
        {children}
        
        </ThemeProvider>
  )
}

export default ThemeLayout