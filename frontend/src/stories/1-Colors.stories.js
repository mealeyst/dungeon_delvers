import React from 'react';
import styled, { withTheme } from 'styled-components';

export default {
  title: 'Colors'
};


const BaseSwatches = withTheme(({className, theme: { colors }}) => {
  return (
    <div className={className}>
      {
        Object.keys(colors).map((color) => {
          return (
            <div className='row'>
              {
                Object.keys(colors[color]).map((shade) => {
                  const style = colors[color][shade];
                  return (
                    <div className='color' key={`${color}-${shade}`}>
                      <span className='swatch' style={{backgroundColor: style}}/>
                      <label><span>{color}</span> <span>{shade}</span></label>
                    </div>
                  );
                })
              }
            </div>
          )
        })
      }
    </div>
  )
})

const StyledSwatches = styled(BaseSwatches)`
  .row {
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .color {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    label {
      margin-top: 10px;
      span {
        text-transform: capitalize;
      }
    }
  }
  .swatch {
    margin-left: 10px;
    margin-right: 10px;
    display: block;
    border-radius: 5px;
    height: 80px;
    width: 80px;
    box-shadow: 0px 0px 2px rgba(0,0,0,0.65)
  }
`

export const colorSwatches = () => {
  return ( <StyledSwatches /> );
}
