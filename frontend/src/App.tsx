import 'src/App.css'
import {PublicClientApplication} from "@azure/msal-browser";

import {MsalProvider} from "@azure/msal-react";

import 'src/global.css';

import Fab from '@mui/material/Fab';

import { Router } from 'src/routes/sections';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import { ThemeProvider } from 'src/theme/theme-provider';

import { Iconify } from 'src/components/iconify';

import MainContent from "src/MainContent";

// ----------------------------------------------------------------------

interface AppProps {
  instance: PublicClientApplication
}
const App = ({instance} : AppProps) => {
  useScrollToTop();

  const githubButton = (
    <Fab
      size="medium"
      aria-label="Github"
      href="https://github.com/minimal-ui-kit/material-kit-react"
      sx={{
        zIndex: 9,
        right: 20,
        bottom: 20,
        width: 44,
        height: 44,
        position: 'fixed',
        bgcolor: 'grey.800',
        color: 'common.white',
      }}
    >
      <Iconify width={24} icon="eva:github-fill" />
    </Fab>
  );

  return (
    <MsalProvider instance={instance}>
    <ThemeProvider>
      <Router />
      {/* <MainContent /> */}
      {githubButton}
    </ThemeProvider>
    </MsalProvider>
  );
}

export default App