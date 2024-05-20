const PAGE_SIZE = 10;
let startPage = 1;
let endPage = 5;
let currentPage = 1;
let pokemons = [];
let totalPages;

const updatePaginationDiv = (currentPage, startPage, endPage) => {
  $("#pagination").empty();
  for (let i = startPage; i <= endPage; i++) {
    $("#pagination").append(
      `<button class="btn btn-secondary page ml-1 numberedButtons ${
        i === currentPage ? "active" : ""
      }" value="${i}">${i}</button>`
    );
  }
};

const paginate = async (currentPage, PAGE_SIZE, pokemons) => {
  $("#pokeCards").empty();
  selected_pokemons = pokemons.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  selected_pokemons.forEach(async (pokemon) => {
    const res = await axios.get(pokemon.url);
    $("#pokeCards").append(`
      <div class="pokeCard card" pokeName=${res.data.name}   >
        <h3>${res.data.name.toUpperCase()}</h3> 
        <img src="${res.data.sprites.front_default}" alt="${res.data.name}"/>
        <button type="button" class="btn btn-secondary" data-toggle="modal" data-target="#pokeModal">
          More
        </button>
        </div>  
        `);
  });
};

const setup = async () => {
  // test out poke api using axios here
  $("#pokeCards").empty();
  let response = await axios.get(
    "https://pokeapi.co/api/v2/pokemon?offset=0&limit=1302"
  );
  pokemons = response.data.results;
  paginate(currentPage, PAGE_SIZE, pokemons);
  totalPages = Math.ceil(pokemons.length / PAGE_SIZE);
  updatePaginationDiv (currentPage, startPage, endPage);
  // pop up modal when clicking on a pokemon card
  // add event listener to each pokemon card
  $("body").on("click", ".pokeCard", async function (e) {
    const pokemonName = $(this).attr("pokeName");
    const res = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const types = res.data.types.map((type) => type.type.name);
    $(".modal-body").html(`
        <div style="width:200px">
        <img src="${
          res.data.sprites.other["official-artwork"].front_default
        }" alt="${res.data.name}"/>
        <div>
        <h3>Abilities</h3>
        <ul>
        ${res.data.abilities
          .map((ability) => `<li>${ability.ability.name}</li>`)
          .join("")}
        </ul>
        </div>

        <div>
        <h3>Stats</h3>
        <ul>
        ${res.data.stats
          .map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`)
          .join("")}
        </ul>

        </div>

        </div>
          <h3>Types</h3>
          <ul>
          ${types.map((type) => `<li>${type}</li>`).join("")}
          </ul>
      
        `);
    $(".modal-title").html(`
        <h2>${res.data.name.toUpperCase()}</h2>
        <h5>${res.data.id}</h5>
        `);
  });

  // add event listener to pagination buttons
  $("body").on("click", ".numberedButtons", async function (e) {
    currentPage = Number(e.target.value);
    await paginate(currentPage, PAGE_SIZE, pokemons);
    //update pagination buttons
    updatePaginationDiv (currentPage, startPage, endPage);
  });
};

$(document).ready(setup);
