// Create Dino Constructor
const Dino = function (species, weight, height, diet, where, when, fact) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.fact = fact;
  this.imagePath = `./images/${species}.png`.toLowerCase();
};

const makeDinos = (dinoData) => {
  const dinoArray = [];

  dinoData.Dinos.forEach((element) => {
    const dino = new Dino(
      element.species,
      element.weight,
      element.height,
      element.diet,
      element.where,
      element.when,
      element.fact
      // dino also has a path to it's image created by the constructor
      // imagePath = `./images/${species}.png`.toLowerCase();
    );
    dinoArray.push(dino);
  });
  return dinoArray;
};

const makeHuman = function (userInput) {
  const human = {
    species: userInput.name,
    feet: parseInt(userInput.feet),
    inches: parseInt(userInput.inches),
    weight: parseInt(userInput.weight),
    diet: userInput.diet,
    height: parseInt(userInput.feet) * 12 + parseInt(userInput.inches),
    imagePath: `./images/human.png`,
  };
  return human;
};

//add click listner to compare button
(window.onload = () => {
  const compareBtn = document.getElementById('compare-btn');
  console.log('compareBtn:', compareBtn);
  compareBtn.addEventListener('click', (e) => {
    const userInput = getFormData();
    const human = makeHuman(userInput); // make human object from data submitted by user
    toggleFormVisibility();
    const getDinoData = async () => fetchDinoJson();
    getDinoData().then((res) => {
      const dinoArray = makeDinos(res);
      makeTiles(dinoArray, human);
    });
  });
})();

const getFormData = () => {
  // get array of all form elements
  const formElements = Array.from(
    document.querySelectorAll('#dino-compare input, select')
  );
  // gather unser input from form values and place in array
  const formData = formElements.reduce(
    (accumulator, currentVal) => ({
      ...accumulator,
      [currentVal.id]: currentVal.value,
    }),
    {} // initial value of accumulator is empty object
  );
  clearFormData(formElements); // clear form after info gathered
  return formData;
};

const clearFormData = (formElements) => {
  formElements.forEach((element) => (element.value = ''));
};

async function fetchDinoJson() {
  const res = await fetch('./dino.json');
  const dinoData = await res.json();
  console.log('dinoData from fetch:', dinoData);
  return dinoData;
}

const toggleFormVisibility = () => {
  const form = document.getElementById('dino-compare');
  form.style.display == ''
    ? (form.style.display = 'none')
    : (form.style.display = '');
};

const makeTiles = (dinoArray, humanObj) => {
  const tileDataArray = randomizeArray(dinoArray);
  tileDataArray.splice(4, 0, humanObj); // after randomizing dino objects, add human object in 5th position

  const grid = document.getElementById('grid');

  tileDataArray.forEach((element) => {
    const tile = document.createElement('div');
    grid.appendChild(tile);
    tile.classList.add('grid-item');

    const tileName = document.createElement('h3');
    tileName.innerHTML = element.species;
    tile.appendChild(tileName);

    const tileImage = document.createElement('img');
    tile.appendChild(tileImage).setAttribute('src', element.imagePath);

    const tileFact = document.createElement('p');
    tileFact.innerHTML = element.fact;
    tile.appendChild(tileFact);

    if (element.fact === undefined) {
      tileFact.style.display = 'none';
    }

    if (tileName === 'Pigeon') {
      tileFact.innerHTML = 'All birds are dinosaurs.';
    }
  });
};

const randomizeArray = (originalArray) => {
  const randomizedArray = [];

  while (originalArray.length > 0) {
    const getRandomIndex = () =>
      Math.floor(Math.random() * originalArray.length); //generate random index based on current length of array
    const randomIndex = getRandomIndex();
    randomizedArray.push(originalArray[randomIndex]); //add value at index to new array
    originalArray.splice(randomIndex, 1); // remove value from old array. splice(index to remove, number of elements to remove)
  }
  return randomizedArray;
};

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.

// TODO try to fix delay in hiding button when hiding form
