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
  this.where = `${this.species} lived on the following continent(s): ${where}`;
  this.when = `${this.species} lived during the ${when} period.`;
  this.fact = fact;
  this.imagePath = `./images/${species}.png`.toLowerCase();
  this.compareDiet = function () {
    return human.diet === this.diet
      ? `${human.name} and ${this.species} are both ${this.diet}s.`
      : `${human.name} is a ${human.diet}, but ${this.species} was a ${this.diet}.`;
  };
  this.compareWeight = function () {
    return this.weight > human.weight
      ? `At ${this.weight} pounds ${this.species} was ${(
          parseFloat((this.weight - human.weight) / human.weight) * 100
        ).toFixed(1)}% heavier than ${human.name}.`
      : `At ${this.weight} pounds ${this.species} had ${parseFloat(
          (this.weight / human.weight) * 100
        ).toFixed(1)}% as much weight as ${human.name}.`;
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
        } was ${getFormattedHeight(this.height - human.height)} taller than ${
          human.name
        }.`
      : `At ${getFormattedHeight(this.height)} ${
          this.species
        } was ${getFormattedHeight(human.height - this.height)} taller than ${
          human.name
        }.`;
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

// species: userInput.name,
const makeHuman = function (userInput) {
  const human = {
    name: userInput.name,
    feet: parseInt(userInput.feet),
    inches: parseInt(userInput.inches),
    weight: parseInt(userInput.weight),
    diet: userInput.diet.toLowerCase(),
    height: parseInt(userInput.feet) * 12 + parseInt(userInput.inches),
    imagePath: `./images/human.png`,
  };
  return human;
};

//add click listner to the compare button
(() => {
  const compareBtn = document.getElementById('compare-btn');
  compareBtn.addEventListener('click', (e) => {
    const formElements = getFormElements();
    const formValid = validateForm(formElements); //boolean - true when all form emements validate

    if (formValid) {
      const userInput = getFormData(formElements);
      const humanObj = makeHuman(userInput); // make human object from data submitted by user
      hideForm();
      const getDinoData = async () => fetchDinoJson();
      getDinoData().then((response) => {
        const dinoArray = makeDinos(response, humanObj);
        makeTiles(dinoArray, humanObj);
      });
    }
  });
})();

// get array of all form elements and values
const getFormElements = () => {
  const formElements = Array.from(
    document.querySelectorAll('#dino-compare input, select')
  );
  return formElements;
};

// gather unser input from form values and place in array
const getFormData = (formElements) => {
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
  form.classList.add('display-none');
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
    tileName.innerHTML = element.species ? element.species : element.name; // if element.species doesn't exist in object use name from human.
    tile.appendChild(tileName);

    const tileImage = document.createElement('img');
    tile.appendChild(tileImage).setAttribute('src', element.imagePath);

    const tileFact = document.createElement('p');
    tile.appendChild(tileFact);

    //human should not display a fact
    //Fact should only be undefiled for human
    if (element.fact === undefined) {
      tileFact.style.display = 'none';
      //Pigeon should always have same fact: 'All birds are dinosaurs.'
    } else if (tileName.innerHTML === 'Pigeon') {
      tileFact.innerHTML = 'All birds are dinosaurs.';
    } else {
      // 3 of the random facts return the results of methods comparing dinosaurs to the user,
      // that need to be called. The rest are just strings.
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

// creats new array.  Destroys data in the original array in the process.
const randomizeArray = (originalArray) => {
  const randomizedArray = [];

  while (originalArray.length > 0) {
    const randomIndex = Math.floor(Math.random() * originalArray.length); //generate random index based on current length of array
    randomizedArray.push(originalArray[randomIndex]); //add value at index to new array
    originalArray.splice(randomIndex, 1); // remove value from old array. splice(index to remove, number of elements to remove)
  }
  return randomizedArray;
};

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

/*
  Form Validation
 */

const validateForm = (formElements) => {
  let valid = true;
  let name = formElements[0];
  let feet = formElements[1];
  let inches = formElements[2];
  let weight = formElements[3];
  // TODO allow single character names
  let validName = /^\s*([A-Za-z]{1,}([\.,] |[-']| )?)+[A-Za-z]+\.?\s*$/; //allow spaces, hyphens, and apostrophes in name

  const updateValidationAlerts = function (element, fieldValid) {
    //let warningId = element.id;

    if (!fieldValid) {
      element.style.border = '1px dashed red';
      element.value = '';
      document
        .querySelector(`#${element.id}-warning`) //the warning messages have standard format for their IDs.
        .classList.remove('display-none'); // make warning message visible
      valid = false;
    } else {
      document
        .querySelector(`#${element.id}-warning`)
        .classList.add('display-none');
      element.style.border = 'none';
      element.style.color = 'black';
    }
  };
  if (!name.value.match(validName) || name.value === '') {
    updateValidationAlerts(name, false);
  } else {
    updateValidationAlerts(name, true);
  }
  if (
    feet.value === NaN ||
    feet.value <= 0 ||
    feet.value > 9 ||
    feet.value === ''
  ) {
    updateValidationAlerts(feet, false);
  } else {
    updateValidationAlerts(feet, true);
  }
  if (
    inches.value === NaN ||
    inches.value < 0 ||
    inches.value >= 12 ||
    inches.value === ''
  ) {
    updateValidationAlerts(inches, false);
  } else {
    updateValidationAlerts(inches, true);
  }
  if (
    weight.value === NaN ||
    weight.value <= 0 ||
    weight.value >= 1000 ||
    weight.value === ''
  ) {
    updateValidationAlerts(weight, false);
  } else {
    updateValidationAlerts(weight, true);
  }

  return valid ? true : false;
};
