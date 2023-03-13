import styled, { css } from "styled-components";

export const UsersLayout = styled.div<{ users: number }>`
  display: flex;
  flex: 1;
  gap: 1px;
  flex-wrap: wrap;
  overflow: hidden;
`;

export const UserCard = styled.div<{ proportion: number }>`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  background: var(--black-color);
  text-align: center;
  outline: 1px solid var(--bg-selector);
  color: var(--white-color);
  ${({ proportion }) => css`
    flex-basis: calc(100% / ${proportion} - 1px);
    max-width: calc(100% / ${proportion} - 1px);
  `}
`;


export const UserCardEmpty = styled.div<{ proportion: number }>`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  background: var(--bg-selector-user);
  text-align: center;
  outline: 1px solid var(--bg-selector);
  ${({ proportion }) => css`
    flex-basis: calc(100% / ${proportion} - 1px);
    max-width: calc(100% / ${proportion} - 1px);
  `}
`;

export const VideoCellCard = styled.div<{ proportion: number }>`
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  background: var(--bg-selector-user);
  text-align: center;
  outline: 1px solid var(--bg-selector);
  ${({ proportion }) => css`
    flex-basis: calc(100% / ${proportion});
    max-width: calc(100% / ${proportion});
  `}
`;

export const IconWrap = styled.div<{ pathCount: number }>`
  ${({ pathCount }) => css`
    svg .svg-shape.color-text:nth-of-type(${pathCount}) {
      fill: var(--black-color);
    }
  `}
`;
