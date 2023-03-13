import { HTMLAttributes, useMemo } from "react";
import styled, { css } from "styled-components";

import { Logo } from "components/layout/Default";

import { SelectorExtended } from "../../types";
import { getFormattedDate } from "utils/index";
import { Avatar } from "@oktell/header-panel";
import { format } from "date-fns";

interface Props {
  show?: boolean;
  selector?: SelectorExtended;
}

const Hidden = css`
  opacity: 0;
  pointer-events: none;
`;

const Wrapper = styled.div<{ active?: boolean }>`
  position: fixed;
  display: flex;
  flex-direction: column;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  padding: 16px 24px 65px;
  background: #3e3e3e;
  color: #fff;
  font-family: var(--secondary-font);
  opacity: 1;
  z-index: 2001;
  transition: opacity 1s;
  ${({ active }) => (active ? "" : Hidden)}
`;

const Hint = styled.span`
  color: #7c7c7c;
`;

const StartInfo = styled.div<{ bold?: boolean }>`
  display: flex;
  gap: 6px;
  font-family: var(--secondary-font);
  font-size: 24px;
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Owner = styled.p`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
`;

const Title = styled.h2`
  font-size: 48px;
  font-weight: 700;
  margin: 8px 0;
`;

const User = styled.div`
  display: flex;
  flex-direction: column;
`;

interface TimeProps extends HTMLAttributes<HTMLDivElement> {
  start: string;
  end?: string;
  durationSec?: number;
  bold?: boolean;
}

export const TimeInfo = ({
  start,
  bold,
  end,
  durationSec,
  ...rest
}: TimeProps) => {
  const timeData = useMemo(() => {
    let time;
    if (!start) {
      return null;
    }

    const [dateStart, timeStart] = start.split(" ");
    time = timeStart;

    if (end) {
      const [dateEnd, timeEnd] = end.split(" ");
      time += `-${timeEnd}`;
    } else if (durationSec) {
      const dateStart = new Date(start).getTime();
      const dateEnd = new Date(dateStart + durationSec * 1000);
      time += `-${format(dateEnd, "HH:mm")}`;
    }

    return [dateStart.split("-").reverse().join("."), time];
  }, [start, end, durationSec]);

  return timeData ? (
    <StartInfo bold={bold} {...rest}>
      <span>{timeData[0]}</span>
      <Hint>{timeData[1]}</Hint>
    </StartInfo>
  ) : null;
};

export const Greeting: React.FC<Props> = ({ show, selector }) => {
  return (
    <Wrapper active={show} className="greeting">
      <Logo />
      <div style={{ flex: 1 }} />
      <Block>
        <div>
          <Title>{selector?.displayname}</Title>
          <TimeInfo start={selector?.timestartutc} bold />
        </div>
        {selector?.user ? (
          <User>
            <Avatar size={129} name={selector.user} />
            <Owner>{selector.user}</Owner>
            <div>(организатор)</div>
          </User>
        ) : null}
      </Block>
    </Wrapper>
  );
};
