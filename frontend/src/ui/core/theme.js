import React, { Fragment } from 'react';
import { ThemeProvider } from 'styled-components';
import { DungeonDelverGlobalFonts } from 'ui/core/fonts';
import { colors } from 'ui/core/colors';
import { fonts } from 'ui/core/fonts';

const theme = {
  colors: colors,
  fonts: fonts
}

export const DungeonDelverTheme = ({children}) => {
  return (
    <ThemeProvider theme={theme}>
      <Fragment>
        <DungeonDelverGlobalFonts />
        {children}
      </Fragment>
    </ThemeProvider>
  )
}
