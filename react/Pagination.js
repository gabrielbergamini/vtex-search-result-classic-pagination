import React from "react";
// eslint-disable-next-line no-restricted-imports
import { path } from "ramda";
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";
import { useCssHandles } from "vtex.css-handles";

const CSS_HANDLES = [
  "pagination",
  "paginationwrapper",
  "paginationinfo",
  "paginationbutton",
  "paginationbuttonactive",
];

const Pagination = () => {
  const { searchQuery, maxItemsPerPage, page } = useSearchPage();

  // CSS Handles
  const handles = useCssHandles(CSS_HANDLES);

  // total number of products
  const totalNumberProducts = path(
    ["data", "productSearch", "recordsFiltered"],
    searchQuery
  );

  // total number of pages
  const totalNumberOfPages = Math.ceil(totalNumberProducts / maxItemsPerPage);

  // get query data
  const queryData = {
    query: path(["variables", "query"], searchQuery),
    map: path(["variables", "map"], searchQuery),
    orderBy: path(["variables", "orderBy"], searchQuery),
    priceRange: path(["variables", "selectedFacets"], searchQuery)?.find(
      (facet) => facet.key === "priceRange"
    )?.value,
  };

  // create an array with n elements based on the integer value of totalNumberOfPages
  const pages = Array.from(Array(totalNumberOfPages).keys()).map((i) => i + 1);

  // create a new array with the pages that will be displayed based on the current page showing 3 after and 10 before
  const pagesToShow = pages.filter(
    (thePage) =>
      thePage >= page - 3 &&
      thePage <= page + 10 &&
      thePage <= totalNumberOfPages
  );

  // insert '»" at the end if there is a next page
  if (page < totalNumberOfPages) {
    pagesToShow.push("»");
  }

  // insert "«" at the beginning if there is a previous page
  if (page > 1) {
    pagesToShow.unshift("«");
  }

  // insert last page if it is not in the array
  if (pagesToShow[pagesToShow.length - 1] !== totalNumberOfPages) {
    pagesToShow.push("Última");
  }

  // insert first page if it is not in the array
  if (pagesToShow[0] !== 1) {
    pagesToShow.unshift("Primeira");
  }

  // message saying how many products are being shown and how many there are
  const productsShowingMessage = `Mostrando ${
    page * maxItemsPerPage - maxItemsPerPage + 1
  }-${
    page * maxItemsPerPage > totalNumberProducts
      ? totalNumberProducts
      : page * maxItemsPerPage
  } de ${totalNumberProducts} produtos`;

  return (
    <div
      style={{ marginTop: "40px" }}
      className={`${handles.pagination} flex flex-wrap justify-center flex-column items-center`}
    >
      <div
        className={`${handles.paginationinfo} flex justify-center items-center ma2 flex-wrap bg-black-80 ph5 pv3 br4 f6 white`}
        // style={{ display: "flex", width: "100%", justifyContent: "center" }}
      >
        <svg
          className={`w1-ns mr3`}
          style={{ fill: "white" }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z" />
        </svg>

        {productsShowingMessage}
      </div>
      <div
        id="total"
        className={`${handles.paginationwrapper} flex justify-center ma5 flex-wrap`}
      >
        {pagesToShow.map((thePage) =>
          page == thePage ? (
            <>
              <span
                key={thePage}
                className={`${handles.paginationbuttonactive} inline-block bg-black-20 br2 pa4 ma2 black self-start`}
              >
                {thePage}
              </span>
            </>
          ) : (
            <>
              <a
                key={thePage}
                className={`${handles.paginationbutton} no-underline inline-block bg-black-10 br2 pa4 ma2 near-black self-start hover-bg-black-20`}
                href={`/${queryData.query}?page=${
                  thePage !== "Primeira" &&
                  thePage !== "Última" &&
                  thePage !== "»" &&
                  thePage !== "«"
                    ? thePage
                    : thePage == "Primeira"
                    ? 1
                    : thePage == "Última"
                    ? totalNumberOfPages
                    : thePage == "«"
                    ? page - 1
                    : page + 1
                }&map=${queryData.map}&orderBy=${
                  queryData.orderBy
                }&priceRange=${
                  queryData.priceRange ? queryData.priceRange : ""
                }`}
                title={`Ir para ${
                  thePage != "Primeira" &&
                  thePage != "Última" &&
                  thePage != "»" &&
                  thePage != "«"
                    ? `Página ${thePage}`
                    : thePage == "Primeira"
                    ? "Primeira Página"
                    : thePage == "Última"
                    ? "Última Página"
                    : thePage == "«"
                    ? "Página Anterior"
                    : "Próxima Página"
                }`}
              >
                {thePage}
              </a>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Pagination;
