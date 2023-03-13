import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@material-ui/core";

import { IBasicObject } from "types/index";

import { Overrides } from "./ExpandStyleOverrides";
import styles from "./Expand.module.scss";

const styleOverrides = makeStyles(Overrides);

interface Props {
  title: string;
  initial?: boolean;
  style?: IBasicObject;
  children: JSX.Element | JSX.Element[];
}

export const Expand = ({ children, title, style, initial = true }: Props) => {
  const classes = styleOverrides();

  const [expanded, setExpanded] = useState(initial);

  const handleChange = (event: any, newState: boolean) => {
    setExpanded(newState);
  };

  return (
    <div style={style} className={styles.Wrapper}>
      <Accordion
        expanded={expanded}
        onChange={handleChange}
        className={classes.Wrapper}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <div className={[styles.Icon, expanded && styles.Flipped].join(" ")}>
            <img src="svg/chevron.svg" />
          </div>
          <div
            className={[styles.Title, !expanded && styles.TitleClosed].join(
              " "
            )}
          >
            {title}
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.Content}>{children}</div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
