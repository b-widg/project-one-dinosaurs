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
      // dino also has a path to it's image created by the constructor
      // imagePath = `./images/${species}.png`.toLowerCase();
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
    makeHuman(formData); // make human object from data submitted by user
    clearFormData(formElements); // clear form after form submission
    toggleFormVisibility(); // Hide form after submission
  });
  // TODO remove from DOM
  // TODO validate data
})();

const clearFormData = (formElements) => {
  formElements.forEach((element) => (element.value = ''));
};

const makeHuman = function (formData) {
  const human = {
    name: formData.name,
    feet: formData.feet,
    inches: formData.inches,
    weight: formData.weight,
    diet: formData.diet,
    height: parseInt(feet) * 12 + parseInt(inches),
    imagePath: `./images/human.png`,
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
//chose visibility = hidden over display = none to keep footer from jumping up
// when form is hidden.
// TODO try to fix delay in hiding button when hiding form
const toggleFormVisibility = () => {
  const form = document.getElementById('dino-compare');
  form.style.visibility == ''
    ? (form.style.visibility = 'hidden')
    : (form.style.visibility = '');
};

// Function only to test toggleFormVisibility() by clicking "How do you compare?" header.
// (() => {
//   document
//     .querySelector('body > header:nth-child(1) > h3:nth-child(3)')
//     .addEventListener('click', (e) => toggleFormVisibility());
// })();

// On button click, prepare and display infographic
