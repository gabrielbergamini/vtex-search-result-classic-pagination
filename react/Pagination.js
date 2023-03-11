import React from "react";
// eslint-disable-next-line no-restricted-imports
import { path } from "ramda";
import classNames from "classnames";
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";

const Pagination = () => {
  const { searchQuery, maxItemsPerPage, page } = useSearchPage();

  const totalNumberProducts = path(
    ["data", "productSearch", "recordsFiltered"],
    searchQuery
  );

  const totalNumberOfPages = Math.ceil(totalNumberProducts / maxItemsPerPage);

  const queryData = {
    query: path(["variables", "query"], searchQuery),
    map: path(["variables", "map"], searchQuery),
    orderBy: path(["variables", "orderBy"], searchQuery),
    priceRange: path(["variables", "selectedFacets"], searchQuery)?.find(
      (facet) => facet.key === "priceRange"
    )?.value,
  };

  // create an array with n elements based on a integer value
  const pages = Array.from(Array(totalNumberOfPages).keys()).map((i) => i + 1);

  // create a new array with the pages that will be displayed based on the current page showing 10 after and 10 before
  const pagesToShow = pages.filter(
    (thePage) =>
      thePage >= page - 10 &&
      thePage <= page + 10 &&
      thePage <= totalNumberOfPages
  );

  // create last page if it is not in the array
  if (pagesToShow[pagesToShow.length - 1] !== totalNumberOfPages) {
    pagesToShow.push(totalNumberOfPages);
  }

  // create first page if it is not in the array
  if (pagesToShow[0] !== 1) {
    pagesToShow.unshift(1);
  }

  // validate if last page needs ... in the beginning
  const needsDotsAtTheBeginning = pagesToShow[1] !== 2;

  // validate if last page needs ... in the end
  const needsDotsAtTheEnd =
    pagesToShow[pagesToShow.length - 2] !== totalNumberOfPages - 1;

  return (
    <div
      style={{ marginTop: "40px" }}
      className={classNames("w-100 flex justify-center")}
    >
      <div id="total">
        {pagesToShow.map((thePage) =>
          page == thePage ? (
            <>
              <span
                key={thePage}
                style={{
                  backgroundColor: "#BBB",
                  borderRadius: "5px",
                  padding: "10px",
                  margin: "4px",
                  color: "#111111",
                }}
              >
                {thePage}
              </span>
            </>
          ) : (
            <>
              <span id="needsDotsAtTheEnd">
                {needsDotsAtTheEnd && thePage == totalNumberOfPages && "..."}
              </span>
              <a
                key={thePage}
                style={{
                  backgroundColor: "#DDD",
                  borderRadius: "5px",
                  padding: "10px",
                  margin: "4px",
                  color: "#111111",
                  textDecoration: "none",
                }}
                href={`/${queryData.query}?page=${thePage}&map=${queryData.map}`}
              >
                {thePage}
              </a>
              <span id="needsDotsAtTheBeginning">
                {needsDotsAtTheBeginning && thePage == 1 && "..."}
              </span>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Pagination;
