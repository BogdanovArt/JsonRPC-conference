import styled from "styled-components";

interface Props {
  width: number;
  amount: number;
  color: string;
}

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const StyledLine = styled.div<{ width: number; color: string }>`
  min-width: 20px;
  width: calc(${({ width }) => width}% - 30px);
  background-color: ${({ color }) => color};
  height: 4px;
`;

const StyledAmount = styled.div`
  font-weight: 600;
`;

export const Line: React.FC<Props> = ({ width, amount, color }) => {
  return (
    <StyledWrapper>
      <StyledLine width={width} color={color} />
      <StyledAmount>{amount}</StyledAmount>
    </StyledWrapper>
  );
};
