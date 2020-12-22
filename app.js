// Dino Constructor
// Human is object that is needed for values used in dino methods
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

// Create array of dino objects from json data.  Also takes human ohject
// to use in methods comparing dinos and human facts.
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

// build human object from info user enters on form
const makeHuman = (userInput) => {
  const human = {
    name: capitalizeNames(userInput.name),
    feet: parseInt(userInput.feet),
    inches: parseInt(userInput.inches),
    weight: parseInt(userInput.weight),
    diet: userInput.diet.toLowerCase(),
    height: parseInt(userInput.feet) * 12 + parseInt(userInput.inches),
    imagePath: `./images/human.png`,
  };
  return human;
};

// format user's name(s) with capitol first letter
const capitalizeNames = (userNames) => {
  return userNames
    .toLowerCase()
    .split(' ')
    .map((userName) => {
      return userName[0].toUpperCase() + userName.substring(1);
    })
    .join(' ');
};

// return heigt in feet and inches
const getFormattedHeight = (heightInInches) => {
  return `${parseInt(heightInInches / 12)} ft. ${parseInt(
    heightInInches % 12
  )} in.`;
};

//add click listner to the compare button
(() => {
  const compareBtn = document.getElementById('compare-btn');
  const introHeader = document.getElementById('intro-header');
  const form = document.getElementById('dino-compare');
  const pageRefresh = document.getElementById('page-refresh');

  compareBtn.addEventListener('click', (e) => {
    const formElements = getFormElements();
    const formValid = validateForm(formElements); //boolean - true when all form emements validate

    if (formValid) {
      toggleVisibility([introHeader, form, pageRefresh]); // remove header and form, add pageRFefresh
      const userInput = getFormData(formElements);
      const humanObj = makeHuman(userInput); // make human object from data submitted by user
      const getDinoData = async () => fetchDinoJson();
      getDinoData().then((response) => {
        const dinoArray = makeDinos(response, humanObj);
        makeTiles(dinoArray, humanObj);
      });
    }
  });
})();

// event listener to for the refresh icon to reload the page.
(() => {
  const refreshIcon = document.getElementById('refresh-icon');
  refreshIcon.addEventListener('click', (e) => {
    location.reload();
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
  clearFormData(formElements); // Clear form after info gathered
  return formData;
};

// Will clear all user entered data on form
const clearFormData = (formElements) => {
  formElements.forEach((element) => (element.value = ''));
};

// Fetch dino data from json file
const fetchDinoJson = async () => {
  const res = await fetch('./dino.json');
  const dinoData = await res.json();
  return dinoData;
};

// Hides single or multiple page elements.  Elements need to be
// passed as array even if only a single element.
const toggleVisibility = (elementArray) => {
  elementArray.map((element) => {
    if (element.classList.contains('display-none')) {
      element.classList.remove('display-none');
    } else {
      element.classList.add('display-none');
    }
  });
};

// Makes Infograpgic of dino tiles as well as fact overlays that appear on hover.
const makeTiles = (dinoArray, humanObj) => {
  const tileDataArray = randomizeArray(dinoArray);
  tileDataArray.splice(4, 0, humanObj); // after randomizing dino objects, add human object in 5th position
  const backgroundColors = getRandomColor();

  const grid = document.getElementById('grid');

  tileDataArray.forEach((element, index) => {
    const tile = document.createElement('div');
    tile.classList.add('grid-item');
    tile.style.backgroundColor = backgroundColors[index];
    grid.appendChild(tile);

    const tileName = document.createElement('h3');
    tileName.innerHTML = element.species ? element.species : element.name; // If element.species doesn't exist in object use name from human.
    tile.appendChild(tileName);

    const tileImage = document.createElement('img');
    tile.appendChild(tileImage).setAttribute('src', element.imagePath);

    const tileFact = document.createElement('p');
    tile.appendChild(tileFact);

    //human should not display a fact
    //Fact should only be undefiled for human
    if (!element.fact) {
      tileFact.style.display = 'none';
      //Pigeon should always have same fact: 'All birds are dinosaurs.'
    } else if (tileName.innerHTML === 'Pigeon') {
      tileFact.innerHTML = 'All birds are dinosaurs.';
    } else {
      // 3 of the random facts return the results of methods comparing dinosaurs
      // to the user that need to be called. The rest are passed as strings.
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
    // Create overlays to show all facts on hover.
    const overlay = document.createElement('div');

    overlay.classList.add('overlay');
    overlay.classList.add('overlay-content');
    tile.appendChild(overlay);

    const title = document.createElement('h3');
    overlay.appendChild(title);
    title.innerHTML = element.species
      ? `${element.species} Facts`
      : `${element.name} Facts`;

    const factList = document.createElement('ul');

    overlay.appendChild(factList);

    let factItem = document.createElement('li');
    factItem.innerHTML = `Weight: ${element.weight} lbs.`;
    factList.appendChild(factItem);

    factItem = document.createElement('li');
    factItem.innerHTML = `Height: ${getFormattedHeight(element.height)} high`;
    factList.appendChild(factItem);

    factItem = document.createElement('li');
    factItem.innerHTML = `Diet: ${element.diet}`;
    factList.appendChild(factItem);

    // the last three facts return undefined for the human,
    // so checking to see if they exist before attempting to
    // creeate list items for them.

    if (element.where) {
      factItem = document.createElement('li');
      if (element.species === 'Pigeon') {
        factItem.innerHTML = 'Pigeons are found world wide.';
      } else {
        factItem.innerHTML = element.where;
      }
      factList.appendChild(factItem);
    }
    if (element.when) {
      factItem = document.createElement('li');
      if (element.species === 'Pigeon') {
        factItem.innerHTML = 'Pigeons live in the current epoch.';
      } else {
        factItem.innerHTML = element.when;
      }
      factList.appendChild(factItem);
    }

    if (element.fact) {
      listFact = document.createElement('li');
      listFact.innerHTML = element.fact;
      factList.appendChild(listFact);
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

// return random fact to be desplayed in bottom of dino tile
const getRandomFact = () => {
  const factArray = [
    'where',
    'when',
    'fact',
    'compareHeight',
    'compareDiet',
    'compareWeight',
  ];
  const randomIndex = Math.floor(Math.random() * factArray.length);
  const fact = factArray[randomIndex];
  return fact;
};

// Randomize order colors to be used as tile backgrounds. Returns array of hex strings.
const getRandomColor = () => {
  const colorArray = [
    '#009687f5',
    '#dc7657f5',
    '#4bb3c1fa',
    '#fac069f9',
    '#67a866f9',
    '#b94169fa',
    '#7f62b3fa',
    '#9fc376f9',
    '#677bcbfa',
  ];
  const randomizedColors = randomizeArray(colorArray);
  return randomizedColors;
};

// Form Validation
// When data is invalid, removes invalid data, highlights field, and displays warning message to user.
// Returns true when all fields contail valid data.
const validateForm = (formElements) => {
  let valid = true;
  let name = formElements[0];
  let feet = formElements[1];
  let inches = formElements[2];
  let weight = formElements[3];
  let validName = /^\s*([A-Za-z]{1,}([\.,] |[-']| )?)+[A-Za-z]+\.?\s*$/; //allow spaces, hyphens, and apostrophes in name

  //Don't use toggleVisibility() here. Class 'display-none' needs to be explicity
  //added or removed for validationWarning for each element passed in.
  const updateValidationAlerts = (element, fieldValid) => {
    const validationWarning = document.querySelector(`#${element.id}-warning`);

    if (!fieldValid) {
      element.style.border = '1px dashed red';
      element.value = '';
      validationWarning.classList.remove('display-none');
      valid = false;
    } else {
      element.style.border = 'none';
      element.style.color = 'black';
      validationWarning.classList.add('display-none');
    }
  };

  if (!name.value.match(validName) || name.value === '') {
    updateValidationAlerts(name, false); // doesn't validate
  } else {
    updateValidationAlerts(name, true); // validates
  }
  if (
    feet.value === NaN ||
    feet.value <= 0 ||
    feet.value > 9 ||
    feet.value === ''
  ) {
    updateValidationAlerts(feet, false); // doesn't validate
  } else {
    updateValidationAlerts(feet, true); // validates
  }
  if (
    inches.value === NaN ||
    inches.value < 0 ||
    inches.value >= 12 ||
    inches.value === ''
  ) {
    updateValidationAlerts(inches, false); // doesn't validate
  } else {
    updateValidationAlerts(inches, true); // validates
  }
  if (
    weight.value === NaN ||
    weight.value <= 0 ||
    weight.value >= 1000 ||
    weight.value === ''
  ) {
    updateValidationAlerts(weight, false); // doesn't validate
  } else {
    updateValidationAlerts(weight, true); // validates
  }

  return valid ? true : false;
};
