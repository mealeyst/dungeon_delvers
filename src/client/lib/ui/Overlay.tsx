import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

type OverlayViewProps = {
  className?: string;
};

type OverlayProps = {
  dark?: boolean;
  position?: {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
}

export const OverlayView: FunctionComponent<OverlayViewProps> = ({
  className,
  children,
}) => <main className={className}>{children}</main>;

const Overlay = styled(OverlayView)<OverlayProps>`
  position: absolute;
  bottom: ${({ position }) => (position && position.bottom ? position.bottom : 0)};
  left: ${({ position }) => (position && position.left ? position.left : 0)};
  right: ${({ position }) => (position && position.right ? position.right : 0)};
  top: ${({ position }) => (position && position.top ? position.top : 0)};
  background: ${({ dark }) => (dark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.1)')};
  backdrop-filter: blur(10px);
`;

export default Overlay;
