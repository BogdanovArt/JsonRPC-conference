import styled, { css } from "styled-components";

const Show = css`
  opacity: 1;
  z-index: 3;
`;

export const Visible = styled.div<{ show?: boolean }>`
  position: absolute;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  opacity: 0;
  transition: opacity var(--transition);
  ${({ show }) => (show ? Show : "")}
`;
