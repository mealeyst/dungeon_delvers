import React, { Fragment } from 'react';
import styled, { withTheme } from 'styled-components';

export default {
  title: 'Fonts'
}

const exampleText = 'The quick brown fox jumps over the lazy dog';
const fontStyles = ['normal', 'bold', 'italic', 'bold-italic']

const BaseTextSamples = withTheme(({className, theme: { fonts }}) => {
  return (
    <div className={className}>
      {Object.keys(fonts.families).map((family) => {
        return Object.keys(fonts.sizes).map((size) => {
          return Object.keys(fonts.styles).map((style) => {
            return (
              <div>
                <label>{family} {size} {style}</label>
                <span className={`${family} size${size} ${style}`}>
                  {exampleText}
                </span>
              </div>
            )
          })
        })
      })}
    </div>
  )
})

const getFamily = (fonts) => {
  let css = ``
  Object.keys(fonts.families).map((family) => (
    css = `${css} .${family} {${fonts.families[family]}}`
  ))
  Object.keys(fonts.styles).map((style) => (
    css = `${css} .${style} {${fonts.styles[style]}}`
  ))
  Object.keys(fonts.sizes).map((size) => (
    css = `${css} .size${size} {${fonts.sizes[size]}}`
  ))
  console.log(css)
  return css
}

const StyledTextSamples = styled(BaseTextSamples)`
  display: flex;
  flex-wrap: wrap;
  > * {
    display: flex;
    flex-wrap: wrap;
    flex-basis: 100%;
    margin-top: 10px;
    margin-bottom: 10px;
    > label, span {
      display: flex;
      flex-basis: 100%;
    }
  }
  ${props => getFamily(props.theme.fonts)}
`
export const textSamples = () => {
  return (<StyledTextSamples />);
}
