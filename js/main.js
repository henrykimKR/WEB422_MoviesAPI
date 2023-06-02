/*********************************************************************************
 *  WEB422 – Assignment 2
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part of this assignment has been copied manually or electronically from any other source
 *  (including web sites) or distributed to other students.
 *
 *  Name: ___Seonghoon Kim_______ Student ID: ____143080216______ Date: ___2023-06-02____
 *
 ********************************************************************************/

// Variables
let page = 1;
const perPage = 10;

// Functions
// Loading The Data
function loadMovieData(title = null) {
  let url = title
    ? `https://angry-puce-kitten.cyclic.app/api/movies?page=${page}&perPage=${perPage}&title=${title}`
    : `https://angry-puce-kitten.cyclic.app/api/movies?page=${page}&perPage=${perPage}`;

  // Saves an element with a .pagination class to a pagination variable.
  const pagination = document.querySelector(".pagination");
  // If a title is given, hide it by adding a d-none class to the .pagination element.
  // If the title is null, remove the d-none class from the .pagination element to make it visible.
  title
    ? pagination.classList.add("d-none")
    : pagination.classList.remove("d-none");
  fetch(url)
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      addRowsToTable(data);
      addClickEventsToRows();
    });
}

// Functions that convert data into <tr> elements
function createTableRow(data) {
  const { _id, year, title, plot, rated, runtime } = data;

  const hours = Math.floor(runtime / 60);
  const minutes = (runtime % 60).toString().padStart(2, "0");

  const html = `
      <tr data-id="${_id}">
        <td>${year}</td>
        <td>${title}</td>
        <td>${plot || "N/A"}</td>
        <td>${rated || "N/A"}</td>
        <td>${hours}:${minutes}</td>
      </tr>
    `;

  return html;
}

// Function that adds <tr> elements to the table
function addRowsToTable(data) {
  const moviesTableBody = document.querySelector("#moviesTable tbody");
  moviesTableBody.innerHTML = data.map(createTableRow).join("");

  // Update "current-page"
  const currentPageElement = document.querySelector("#current-page");
  currentPageElement.textContent = page;
}

// Click event for each movie row
function addClickEventsToRows() {
  const rows = document.querySelectorAll("#moviesTable tbody tr");
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      const movieId = row.getAttribute("data-id");
      // 확인용
      console.log(movieId);
      const url = `https://angry-puce-kitten.cyclic.app/api/movies/${movieId}`;
      console.log(url);

      fetch(`https://angry-puce-kitten.cyclic.app/api/movies/${movieId}`)
        .then((res) => res.json())
        .then((movieData) => {
          //   console.log(movieData);
          const modalTitle = document.querySelector(
            "#detailsModal .modal-title"
          );
          modalTitle.innerHTML = movieData.title;

          const modalBody = document.querySelector("#detailsModal .modal-body");
          modalBody.innerHTML = `
            <img class="img-fluid w-100" src="${movieData.poster}"><br><br>
            <strong>Directed By:</strong> ${
              movieData.directors ? movieData.directors.join(", ") : "N/A"
            }<br><br>
            <p>${movieData.fullplot}</p>
            <strong>Cast:</strong> ${
              movieData.cast ? movieData.cast.join(", ") : "N/A"
            }<br><br>
            <strong>Awards:</strong> ${
              movieData.awards ? movieData.awards.text : "N/A"
            }<br>
            <strong>IMDB Rating:</strong> ${
              movieData.imdb ? movieData.imdb.rating : "N/A"
            } (${movieData.imdb ? movieData.imdb.votes : "N/A"} votes)
            `;
        });

      const detailsModal = new bootstrap.Modal(
        document.querySelector("#detailsModal"),
        { backdrop: "static", keyboard: false, focus: true }
      );
      detailsModal.show();
    });
  });
}

// DOMContentLoaded event

document.addEventListener("DOMContentLoaded", () => {
  // Load movie data
  loadMovieData();

  // Click event for "previous page" button
  const previousPage = document.querySelector("#previous-page");
  previousPage.addEventListener("click", () => {
    if (page > 1) {
      page--;
      loadMovieData();
    }
  });

  // Click event for "next page" button
  const nextPage = document.querySelector("#next-page");
  nextPage.addEventListener("click", () => {
    page++;
    loadMovieData();
  });

  // Submit event for search form
  const searchForm = document.querySelector("#searchForm");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const searchTitle = document.querySelector("#title").value;
    loadMovieData(searchTitle);
  });

  // Click event for "clearForm" button
  const clearForm = document.querySelector("#clearForm");
  clearForm.addEventListener("click", () => {
    document.querySelector("#title").value = "";
    loadMovieData();
  });
});
