# dice-chucker
Simple JS/JQuery client-side web app for rolling dice.
At the core is a gaming utility JS function for dice-style RNG. The app supplies an interface to execute rolls, displaying results with history log, allowing configurable input values and display options.

##HTML
###Features
* Input: Set of Input fields - Sides, Quantity, and Modifier - and a button to make a roll
* Roll Results: Vertically-oriented table showing several different kinds of results from most recent roll
* History: Horizontally-oriented table showing results, up to last 50 rolls
* Configuration: customize which results you would like to be shown, thier parameters, etc
* About: info about the app

##CSS
General appearance styling, nothing crazy going on here.

Currently styled to pretty much work as a narrow single-column, media queries for wider, multicolumn layouts still pending.

##Javascript
###diceRoll.js
The thing that creates the dice rolls. The core utility function, pulled out as its own file. Beyond just basic random generation of positive integers >= 1, in quantities >= 1, this has a several different properties and methods that can be referenced. File contents are heavily commented, describing usage (minified version pending).

####Features
* `diceRoll(sides, qty)` function to create an object. 
* takes Arguments for number of sides on dice, quantity of dice 
  * should pass positive integers to function
  * has some simple built-in validation and default values
* Object has the following...
* Properties
  * `this.sides` -- INT, how many sides on dice, Default: 6
  * `this.qty` -- INT, how many dice, Default: 1
* Methods
  * `this.series` -- ARRAY, the series of dice roll values generated
  * `this.sortedH` -- ARRAY, dice roll values, sorted High to Low
  * `this.sortedL` -- ARRAY, dice roll values, sorted Low to High
  * `this.skim(n)` -- ARRAY, highest n values, n as positive int, Default: 1
  * `this.dredge(n)` -- ARRAY, lowest n values, n as positive int, Default: 1
  * `this.truncate(n)` -- ARRAY, discards highest n values and lowest n values, n as positive int, Default: 1
  * `this.sum(rollArray)` -- INT, sum of all values in rollArray, Default: this.series
  * `this.mean(rollArray)` -- INT, average of all values in rollArray, Default: this.series
    * the point of the argument on sum and mean being that you could feed it a skim, dredge or truncate

##JQuery/JS
###diceChucker_app.js
All the rigging between the html interface and the diceRoll() function. JQuery for events and DOM manipulation, JS for the in-between.
####Features
* Events
  * Click Events
    * Buttons, including Increment/Decrementing of the roll input values
    * Accordion open/close of sections (class toggling to conceal/reveal content)
  * Keyboard Events - Enter key while focused in input fields will execute a roll or refresh results
  * Change Events - show/hide specific results based on configuration checkbox states
* Dynamic generation/updating of History table and Results data
* Validation/Error messages

##Version History
###1.0:
Supplied in initial set of commits and documentation on Github. Fully functional app, but still with some important things on the roadmap.

###1.5:
Committed 03/23/15.
* **diceChucker_app.js** -- condensed global variables into a single multi-dimensional object variable called *dcApp*. Contains *newInput* object (values to feed a new roll), *config* object (settings to determine results/history displays), *errors* object (with boolean flags and message content), the *newRoll* object, and the *historyStorage* array. Namespaced most functions more distinctly with a 'dc_' prefix. Changed various jQuery selectors to reflect the updates to HTML.
* **index.html** -- Mostly implemented BEM methodology. Majority of tags have class assignments now, for the most part have been namespaces with a 'dc-' prefix.
* **style.css** -- Mostly implemented BEM methodology. Updated stylesheets to target the class changes and additions with a 'dc-' prefix. Some refactoring and other adjustments still pending.
* 
###1.6:
Committed 04/16/15.
* **diceChucker_app.js** -- minor changes to maintain integraion.
* **index.html** -- More or less completed BEM implementation, namespacing. Fixed the missing viewport meta tag.
* **style.css** -- More or less completed BEM implementation, namespacing. Also made some cleanup/consistency fixes, refactoring.

##Roadmap
* Refine general styling
* Responsive optimization - currently just single column, mobile-friendly
