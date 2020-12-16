// Create Dino Constructor
const Dino = function (
  species,
  weight,
  height,
  diet,
  where,
  when,
  fact,
  human
) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet.toLowerCase();
  this.where = `${this.species} lived in the following continents: ${where}`;
  this.when = `${this.species} lived during the ${when} period.`;
  this.fact = fact;
  this.imagePath = `./images/${species}.png`.toLowerCase();
  this.compareDiet = function () {
    return human.diet === this.diet
      ? `${human.species} and ${this.species} are both ${this.diet}s.`
      : `${human.species} is a ${human.diet}, but ${this.species} was a ${this.diet}.`;
  };
  this.compareWeight = function () {
    return this.weight > human.weight
      ? `At ${this.weight} pounds ${this.species} was ${(
          parseFloat((this.weight - human.weight) / human.weight) * 100
        ).toFixed(1)}% heavier than ${human.species}.`
      : `At ${this.weight} pounds ${this.species} had ${parseFloat(
          (this.weight / human.weight) * 100
        ).toFixed(1)}% as much weight as ${human.species}.`;
  };
  this.compareHeight = function () {
    let getFormattedHeight = function (heightInInches) {
      return `${parseInt(heightInInches / 12)} ft. ${parseInt(
        heightInInches % 12
      )} in.`;
    };
    return this.height > human.height
      ? `At ${getFormattedHeight(this.height)} ${
          this.species
        } was ${getFormattedHeight(
          this.height - human.height
        )} taller than you.`
      : `At ${getFormattedHeight(this.height)} ${
          this.species
        } was ${getFormattedHeight(
          human.height - this.height
        )} taller than you.`;
  };
};
const makeDinos = (dinoData, human) => {
  const dinoArray = [];

  dinoData.Dinos.forEach((element) => {
    const dino = new Dino(
      element.species,
      element.weight,
      element.height,
      element.diet,
      element.where,
      element.when,
      element.fact,
      human
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
    diet: userInput.diet.toLowerCase(),
    height: parseInt(userInput.feet) * 12 + parseInt(userInput.inches),
    imagePath: `./images/human.png`,
  };
  return human;
};

//add click listner to compare button
(() => {
  const compareBtn = document.getElementById('compare-btn');
  compareBtn.addEventListener('click', (e) => {
    const userInput = getFormData();
    const humanObj = makeHuman(userInput); // make human object from data submitted by user
    hideForm();
    const getDinoData = async () => fetchDinoJson();
    getDinoData().then((response) => {
      const dinoArray = makeDinos(response, humanObj);
      makeTiles(dinoArray, humanObj);
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
  return dinoData;
}

const hideForm = () => {
  const form = document.getElementById('dino-compare');
  form.style.display = 'none';
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
    tile.appendChild(tileFact);

    if (element.fact === undefined) {
      //Fact should only be undefiled for human
      tileFact.style.display = 'none'; //human should not display a fact
    } else if (tileName.innerHTML === 'Pigeon') {
      //Pigeon should always have same fact.
      tileFact.innerHTML = 'All birds are dinosaurs.';
    } else {
      let randomFact = getRandomFact();
      if (randomFact === 'compareHeight') {
        tileFact.innerHTML = element.compareHeight();
      } else if (randomFact === 'compareWeight') {
        tileFact.innerHTML = element.compareWeight();
      } else if (randomFact === 'compareDiet') {
        tileFact.innerHTML = element.compareDiet();
      } else {
        tileFact.innerHTML = element[randomFact];
      }
    }
  });
};

const randomizeArray = (originalArray) => {
  const randomizedArray = [];

  while (originalArray.length > 0) {
    const randomIndex = Math.floor(Math.random() * originalArray.length); //generate random index based on current length of array
    randomizedArray.push(originalArray[randomIndex]); //add value at index to new array
    originalArray.splice(randomIndex, 1); // remove value from old array. splice(index to remove, number of elements to remove)
  }
  return randomizedArray;
};

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.
const getRandomFact = () => {
  const factArray = [
    'compareHeight',
    'where',
    'when',
    'fact',
    'compareDiet',
    'compareWeight',
  ];
  const randomIndex = Math.floor(Math.random() * factArray.length);
  const fact = factArray[randomIndex];
  return fact;
};
