import { createGlobalStyle, css } from 'styled-components';

const fontFamilies = {
  Lato: css`font-family: 'Lato', sans-serif;`,
  Almendra: css`font-family: 'Almendra', serif;`
}
const fontSizes = {
  '12px': css`font-size: 12px;`,
  '14px': css`font-size: 14px;`,
  '16px': css`font-size: 16px;`,
  '18px': css`font-size: 18px;`,
  '20px': css`font-size: 20px;`,
  '24px': css`font-size: 24px;`,
  '30px': css`font-size: 30px`,
  '36px': css`font-size: 36px;`,
  '48px': css`font-size: 48px;`,
  '60px': css`font-size: 60px;`,
  '72px': css`font-size: 72px;`
}

const fontStyles = {
  bold: css`
    font-style: normal;
    font-weight: 600;
  `,
  boldUppercase: css`
    font-style: normal;
    font-weight: 600;
    text-transform: uppercase;
  `,
  boldItalic: css`
    font-style: italic;
    font-weight: 600;
  `,
  boldItalicUppercase: css`
    font-style: normal;
    font-weight: 600;
    text-transform: uppercase;
  `,
  italic: css`
    font-style: italic;
    font-weight: 400;
  `,
  normal: css`
    font-style: normal;
    font-weight: 400;
  `,
  uppercase: css`
    text-transform: uppercase;
    font-weight: 400;
  `
}

export const fonts = {
  families: fontFamilies,
  sizes: fontSizes,
  styles: fontStyles
}

export const DungeonDelverGlobalFonts = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Almendra|Lato&display=swap');
`
