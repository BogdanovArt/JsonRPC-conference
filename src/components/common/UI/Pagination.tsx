import React, { useEffect, useState } from "react";
import { Pagination } from '@material-ui/lab'
import { makeStyles } from "@material-ui/styles";
import { Overrides } from "./PaginationStyleOverrides";
import styles from "./Pagination.module.scss";

const styleOverrides = makeStyles(Overrides);

interface PaginationProps {
  itemsCountPage?: number;
  itemsCount: number;
  onChange: any;
}

export const PaginationCustom = ({ itemsCountPage = 20, itemsCount, onChange}: PaginationProps) => {
  const classes = styleOverrides();
  const [page, setPage] = useState<number>(1)
  const countPages = Math.ceil(itemsCount / itemsCountPage);
  const startPageItems = (page - 1) * itemsCountPage;
  const endPageItems = page * itemsCountPage;

  const changePageNumber = (event: any, number: number) => {
    setPage(number)
  }

  useEffect(() => {
    onChange(startPageItems, endPageItems)
  }, [startPageItems, endPageItems])

  return (
    <div className={styles.Wrapper}>
      <Pagination onChange={changePageNumber} count={countPages} boundaryCount={2} className={classes.Pagination}/>
    </div>
  )
}