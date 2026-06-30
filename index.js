/*             Feel free to use this skeleton I have provided or delete everything and do your own thing!             */

//If you would like to, you can create a variable to store the API_URL here.
//This is optional. if you do not want to, skip this and move on.
let baseApiUrl = "https://fsa-puppy-bowl.herokuapp.com/api/2605-Paige";
/////////////////////////////
/*This looks like a good place to declare any state or global variables you might need*/
let state = { players: [] };
////////////////////////////

/**
 * Fetches all players from the API. Done!
 * This function should not be doing any rendering Done!
 * Instead, this function should be keeping our state up to date
 */
const fetchAllPlayers = async () => {
  //TODO
  const response = await fetch(`${baseApiUrl}/players`);
  const result = await response.json();
  state.players = result.data.players;
  return state.players;
};

const renderRoster = () => {
  const rosterContainer = document.getElementById("roster");
  rosterContainer.innerHTML = "";

  if (state.players.length === 0) {
    rosterContainer.innerHTML = "<p>No puppies to show</p>";
    return;
  }

  state.players.forEach((player) => {
    const playerInfo = document.createElement("div");
    playerInfo.className = "playerInfo";
    playerInfo.innerHTML = `
      <h3>${player.name}</h3>
      <img src="${player.imageUrl}" alt="${player.name}" style="width: 150px;" />
    `;
    playerInfo.addEventListener("click", async () => {
      const fullPluppyData = await fetchSinglePlayer(player.id);
      renderDetails(fullPluppyData);
    });
    rosterContainer.appendChild(playerInfo);
  });
};

/**
 * Fetches a single player from the API. Done!
 * This function should not be doing any rendering Done!
 * Instead, this function should be keeping our state up to date
 * @param {number} playerId
 */
/**
 * Note: In order to call fetchSinglePlayer() a player's id is required.
 * Unless we know the id of the player we are trying to fetch, we cannot call fetchSinglePlayer()
 */
const fetchSinglePlayer = async (playerId) => {
  //TODO
  const response = await fetch(`${baseApiUrl}/players/${playerId}`);
  // console.log(response);
  const result = await response.json();
  // console.log(singlePlayerData);
  return result.data.player;
};

// fetchSinglePlayer(57328);

const renderDetails = (player) => {
  const detailsContainer = document.getElementById("stats");
  let teamName;
  if (player.team) {
    teamName = player.team.name;
  } else {
    teamName = "Unassigned";
  }

  detailsContainer.innerHTML = `<h2>Puppy Selection</h2>
    <div class="detailsCard">
      <h3>${player.name}</h3>
      <p>ID: ${player.id}</p>
      <p>Breed: ${player.breed}</p>
      <p>Status: ${player.status}</p>
      <p>Team: ${teamName}</p>
      <img src="${player.imageUrl}" alt="${player.name}" />
      <br />
      <button id="delete" data-id="${player.id}">Delete from Roster</button>
    </div>`;

  const deleteBtn = document.getElementById("delete");
  deleteBtn.addEventListener("click", async () => {
    await removePlayer(player.id);
    await fetchAllPlayers();
    renderRoster();
    detailsContainer.innerHTML = "<p>Click a Puppy to see its stats!</p>";
  });
};

/**
 * Adds a new player to the roster via the API.
 * Once a player is added to the database, the new player
 * should appear in the all players page without having to refresh
 * @param {Object} newPlayer the player to add
 */
/* Note: we need data from our user to be able to add a new player
 * What does that sound like we need?

 */
/**
 * Note#2: addNewPlayer() expects you to pass in a
 * new player object when you call it. How can we
 * create a new player object and then pass it to addNewPlayer()?
 */

const addNewPlayer = async (newPlayer) => {
  //TODO
  const response = await fetch(`${baseApiUrl}/players`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newPlayer)
  });

  const newPlayerData = await response.json();
  // console.log(newPlayerData);
  return newPlayerData;
};

const makeForm = () => {
  const addPuppyForm = document.getElementById("newPuppy");

  addPuppyForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name");
    const breed = document.getElementById("breed");

    const newPuppyObj = {
      name: name.value,
      breed: breed.value,
      status: "bench"
    };
    await addNewPlayer(newPuppyObj);
    addPuppyForm.reset();
    await fetchAllPlayers();
    render();
  });
};

/**
 * Removes a player from the roster via the API. Done!
 * Once the player is removed from the database,
 * the player should also be removed from our view without refreshing
 * @param {number} playerId the ID of the player to remove
 */
/**
 * Note: In order to call removePlayer() a player's id is required.
 * Unless we know the id of the player we are trying to remove, we cannot call removePlayer()
 */

const removePlayer = async (playerId) => {
  //TODO
  const response = await fetch(`${baseApiUrl}/players/${playerId}`, {
    method: "DELETE"
  });
  // console.log(response);
  return response.status;
};

// removePlayer(57328);

/**
 * Updates html to display a list of all players or a single player page.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player in the all player list is displayed with the following information:
 * - name
 * - image (with alt text of the player's name)
 *
 * Additionally, for each player we should be able to:
 * - See details of a single player. The page should show
 *    specific details about the player clicked such as: name, id, breed, status, image, and team or unassigned if no team
 * - Remove from roster. When a button is clicked, should remove the player
 *    from the database and our current view without having to refresh
 *
 */
const render = () => {
  // TODO
  renderRoster();
};

/**
 * Initializes the app by calling render
 * HOWEVER....
 */
const init = async () => {
  //Before we render, what do we always need?
  await fetchAllPlayers();
  makeForm();
  render();
};

init();
