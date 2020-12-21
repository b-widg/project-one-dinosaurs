# You Vs. The Dinosaurs

## Project 1 for Udacity, Intermediate Javascript Nanodegree

### Project Details

Starter code and full instructions for the project are located at https://github.com/udacity/Javascript.

Build an infographic based on data that is provided in provided json file and data submitted with a user form. Generate a 3x3 grid of tiles with the human in the center tile. Each title will contain the species, an image, and a fact. For the human tile, display the name of the human rather than species. The human does not desplay a fact by default. When the user clicks to generate the infographic from the form, remoove the form and show the grid. The facts displayed should be random per dinosaur with an opportunity of displaying at least 6 different types of facts -- 3 should be from the methods you create comparing the user provided info to the dinosaurs. One of the titles should be for a pigeon in which the tile should always display, “All birds are dinosaurs.”

### Project Requirements

UI must show the following:

- [ ] The form should contain a button which upon clicking, removes the form
- [ ] The button should append a grid with 9 tiles to the DOM with the Human located in the center
- [ ] The Human tile should display the name of the person and an image, the dino tiles should contain the species, an image and a fact, the bird title should contain the species, image, and "All birds are Dinosaurs."

To complete this project, your backend code must:

- [ ] Contain a class and all necessary objects
- [ ] Contain at least 3 methods for comparing dinosaurs to the human
- [ ] Get user data from the DOM
- [ ] Append tiles with object data to DOM

### Optional Features Included

- [ ] Display Dinosaurs in random order
- [ ] Allow user to resubmit form displaying new order and random facts
- [ ] Add form validation to alert user to missing or invalid data before alowing form submission
- [ ] Add overlays to tiles that display all facts on hover
- [ ] Removed tile background color from CSS and use them in random order when creating tiles
