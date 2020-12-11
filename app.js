// Create Dino Constructor
const Dino = function (species, weight, height, diet, where, when, fact) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.fact = fact;
  this.imageUrl = `./images/${species}.png`.toLowerCase();
};

// Create Dino Objects
(async () => {
  const res = await fetch('./dino.json');
  const dinoData = await res.json();
  makeDinos(dinoData);
})();

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
      // dino also has a url to it's image created by the constructor
      // imageUrl = `./images/${species}.png`.toLowerCase();
    );

    dinoArray.push(dino);
  });
};

(getFormData = () => {
  const compareBtn = document.getElementById('compare-btn');
  const formElements = Array.from(
    document.querySelectorAll('#dino-compare input, select')
  );

  compareBtn.addEventListener('click', (e) => {
    const formData = formElements.reduce(
      (accumulator, currentVal) => ({
        ...accumulator,
        [currentVal.id]: currentVal.value,
      }),
      {} // initial value of accumulator is empty object
    );
    console.log('formData:', formData);
    makeHuman(formData);
  });
  // TODO remove from DOM
  // TODO validate data
})();

const makeHuman = function (formData) {
  const human = {
    name: formData.name,
    feet: formData.feet,
    inches: formData.inches,
    weight: formData.weight,
    diet: formData.diet,
    height: parseInt(feet) * 12 + parseInt(inches),
    imageUrl: `./images/human.png`,
  };
  console.log('human:', human);
};

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.

// Generate Tiles for each Dino in Array

// Add tiles to DOM

// Remove form from screen

// On button click, prepare and display infographic
