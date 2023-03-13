import { Icon, IconName } from "@oktell/icons";
import { CSSProperties, HTMLAttributes } from "react";

import styled, { css } from "styled-components";
import { useSelector } from "react-redux";
import { getBreakPoint } from "store/core/getters";

const Reverse = css`
  flex-direction: row-reverse;
`;

const Color = (color?: string, dark?: boolean) => {
  const colorsDark = css`
    border-color: ${color};
    color: var(--bg-primary);
    background-color: ${color};

    svg {
      .svg-shape.color-text {
        fill: var(--bg-primary);
      }
      .svg-stroke.color-text {
        stroke: var(--bg-primary);
      }
    }
  `;

  const colorsLight = css`
    border-color: ${color};
    color: var(--text-color);
    @media (max-width: 600px) {
      border: 1px solid ${color};
    }
    svg {
      .svg-shape.color-text {
        fill: ${color};
      }
      .svg-stroke.color-text {
        stroke: ${color};
      }
    }
  `;

  const defaultDark = css`
    border-color: var(--text-color);
    color: var(--bg-primary);
    background-color: var(--text-color);
    svg {
      .svg-shape.color-text {
        fill: var(--bg-primary);
      }
      .svg-stroke.color-text {
        stroke: var(--bg-primary);
      }
    }
  `;

  const defaultLight = css`
    border-color: var(--text-color);
    color: var(--text-color);
    @media (max-width: 600px) {
      border: 1px solid ${color};
    }
    svg {
      .svg-shape.color-text {
        fill: var(--text-color);
      }
      .svg-stroke.color-text {
        stroke: var(--text-color);
      }
    }
  `;

  switch (true) {
    case !!color && dark:
      return colorsDark;
    case !!color:
      return colorsLight;
    case dark:
      return defaultDark;
    default:
      return defaultLight;
  }
};

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  color?: string;
  icon?: IconName;
  reverse?: boolean;
  dark?: boolean;
  disabled?: boolean;
  textMobile?: boolean;
}

interface StyledProps {
  childrenExists?: boolean;
}

const StyledButton = styled.button<ButtonProps & StyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  background: var(--bg-primary);
  height: 48px;
  padding: ${({ childrenExists }) => (childrenExists ? "0 24px" : "0 14px")};
  gap: 8px;
  cursor: pointer;

  & > div {
    svg {
      @media (max-width: 600px) {
        width: 16px;
        height: 16px;
      }
    }
  }
  ${({ reverse }) => (reverse ? Reverse : "")}
  ${({ dark, color }) => Color(color, dark)}
  @media (max-width: 600px) {
    width: 48px;
    height: 32px;
  }
  &:disabled {
    cursor: default;
    opacity: 0.5;
    ${Color()}
  }
`;

const IconStyles: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const IconButton: React.FC<ButtonProps> = ({
  icon,
  dark,
  reverse,
  disabled,
  color,
  textMobile,
  children,
  ...rest
}) => {
  const childExists = !!children;
  const breakpoint = useSelector(getBreakPoint);
  const isDesktop = ["lg", "xl"].includes(breakpoint);
  return (
    <StyledButton
      disabled={disabled}
      color={color}
      dark={dark}
      reverse={reverse}
      childrenExists={childExists}
      {...rest}
    >
      {icon ? <Icon name={icon} style={IconStyles} /> : null}
      {isDesktop || textMobile ? <span>{children}</span> : null}
    </StyledButton>
  );
};
