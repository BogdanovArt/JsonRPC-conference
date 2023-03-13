import { Icon } from "@oktell/icons";
import clsx from "clsx";
import { HTMLAttributes } from "react";
import styled, { css } from "styled-components";

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: number;
  disabled?: boolean;
}

const Disabled = css`
  pointer-events: none;
  background-color: var(--bg-other);
`;

const Button = styled.div<{ size: number; disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  min-width: ${({ size }) => size}px;
  min-height: ${({ size }) => size}px;
  background: var(--accent-color);
  cursor: pointer;
  ${({ disabled }) => (disabled ? Disabled : "")}
  .button-icon {
    display: flex;
    align-items: center;
    svg {
      width: 13px;
      height: 13px;
    }
    .svg-shape.color-text {
      fill: var(--bg-primary);
    }
  }
`;

export const AddButton: React.FC<Props> = ({
  size = 20,
  disabled,
  className,
  ...rest
}) => {
  return (
    <Button
      disabled={disabled}
      size={size}
      className={clsx(className, "readonly")}
      {...rest}
    >
      <Icon name="add" className="button-icon" />
    </Button>
  );
};
