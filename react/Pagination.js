import React from "react";
// eslint-disable-next-line no-restricted-imports
import { path } from "ramda";
import classNames from "classnames";
import { useSearchPage } from "vtex.search-page-context/SearchPageContext";

const Pagination = () => {
  const { searchQuery, maxItemsPerPage, page } = useSearchPage();

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
      className={classNames("w-100 flex justify-center flex-wrap text-center")}
    >
      <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
        {productsShowingMessage}
      </div>
      <div id="total" style={{ display: "flex", marginTop: "1rem" }}>
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
