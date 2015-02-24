//Dice Chucker app rigging

//declare global variables with defaults
//variable values updated by ("#roll-input__btn").click(),
//and by keyup 'enter' events from the roll-input inputs
var newRoll        = {}; //new diceRoll() object
var historyStorage = []; //store up to 50 newRolls

//default roll inputs
var newRollQty   = 1;
var newRollSides = 6;
var newRollMod   = 0;

//default config for display of newRoll results
var config_sum          = true;
var config_mean         = false;
var config_sortedH      = true;
var config_sortedL      = false;
var config_series       = false;
var config_skim         = false;
var config_skimVal      = 1;
var config_dredge       = false;
var config_dredgeVal    = 1;
var config_truncate     = false;
var config_truncateVal  = 1;
var config_history      = true;
var config_historyVal   = 5;

//validation defaults - see function validateInputs()
var inputErrorRoll      = false; //true prevents roll
var inputErrorRollMsg   = "";    //and will prep and display msg
var inputErrorConfig    = false; //true prevents update functions
var inputErrorConfigMsg = "";    //and will prep and display msg



//BEGIN JQUERY
$(document).ready(function() {


//prepare system functions

//call for testing input values for roll and config
function validateInputs() {
	//reset flags
	inputErrorRoll      = false; //true prevents roll
	inputErrorRollMsg   = "";    //and will prep and display msg
	inputErrorConfig    = false; //true prevents update functions
	inputErrorConfigMsg = "";    //and will prep and display msg
	
	//jquery select any invalid inputs - HTML5
	$('input:invalid').each(function() {
		//trips the appropriate error flag var to true
		//and loads a suitable msg snippet to appropriate msg var
		//from element's html data-errormsg attr
		if ($(this).hasClass("roll-input")) {
			inputErrorRoll       = true;
			inputErrorRollMsg   += $(this).attr("data-errormsg");
		} else { //is config input
			inputErrorConfig     = true;
			inputErrorConfigMsg += $(this).attr("data-errormsg");
		}
		
		//focus cursor on invalid input
		$(this).focus();
	});
	
}


//generate valid roll and add it to historyStorage
function chuckDice() {
    if (inputErrorRoll) { //log error
        $('.input_valid-error').text(inputErrorRollMsg);
        
    } else { // (!inputErrorRoll)
        $('.input_valid-error').text(""); //clear error log
        
        //get and store current input vals
        newRollQty   = parseInt($("#input-qty_val")  .val());
        newRollSides = parseInt($("#input-sides_val").val());
        newRollMod   = parseInt($("#input-mod_val")  .val());
        
        //generate roll, also put it in historyStorage
        newRoll = new diceRoll(newRollSides, newRollQty);
        
        historyStorage.unshift([newRoll, newRollMod]);
        if (historyStorage.length > 50) {
            historyStorage.pop();   //enforce max limit for Log
        }
    }
}

//when called, update the Roll Results table
function updateResults() {
	if (inputErrorConfig) { //log error
			$('.config_valid-error').text(inputErrorConfigMsg);
    } else { // (!inputErrorConfig)
		$('.config_valid-error').text(""); //clear error log
		
		//build Input report
		var resultInput  = "<i>Qty</i>: " + newRoll.qty;
			resultInput += "<br><i>Sides</i>: " + newRoll.sides;
			resultInput += "<br><i>Mod</i>: "
			if (newRollMod > 0) {
				resultInput += "+";
			}
			resultInput += newRollMod;
            
		$('#results__cell--input')      .html(resultInput);
		$('#results__cell--sum')        .text(newRoll.sum()
		                                      + newRollMod);
		$('#results__cell--mean')       .text((newRoll.mean()
		                                       + (newRollMod/newRoll.qty)).toFixed(3));
		                                         //round to 3 decimal points
        $('#results__cell--sorted-high').text(newRoll.sortedH.join(', '));
        $('#results__cell--sorted-low') .text(newRoll.sortedL.join(', '));
        $('#results__cell--series')     .text(newRoll.series.join(', '));
        updateSkim();
        updateDredge();
	    updateTruncate();
    }
}
function updateSkim() { //component of updateResults, also called separately by event
	var n = parseInt($('#skim_val').val());
	$('#results__cell--skim').text(newRoll.skim(n).join(', '));
}
function updateDredge() { //component of updateResults, also called separately by event
	var n = parseInt($('#dredge_val').val());
	$('#results__cell--dredge').text(newRoll.dredge(n).join(', '));
}
function updateTruncate() { //component of updateResults, also called separately by event
	var n = parseInt($('#truncate_val').val());
	$('#results__cell--truncate').text(newRoll.truncate(n).join(', '));
}

//when called, build contents of History table and update it
function updateHistory() {
	if (inputErrorConfig) { //log error
		$('.config_valid-error').text(inputErrorConfigMsg);
	} else { // (!inputErrorConfig)
		$('.config_valid-error').text(""); //clear error log
	    
		//grab config settings
		config_sum         = $('#sum')        .is(':checked');
		config_mean        = $('#mean')       .is(':checked');
		config_sortedH     = $('#sorted-high').is(':checked');
		config_sortedL     = $('#sorted-low') .is(':checked');
		config_series      = $('#series')     .is(':checked');
		config_skim        = $('#skim')       .is(':checked');
		config_dredge      = $('#dredge')     .is(':checked');
		config_truncate    = $('#truncate')   .is(':checked');
		config_history     = $('#historylog') .is(':checked');
		config_skimVal     = parseInt($('#skim_val')    .val());
		config_dredgeVal   = parseInt($('#dredge_val')  .val());
		config_truncateVal = parseInt($('#truncate_val').val());
		config_historyVal  = parseInt($('#history_val') .val());
		
		//configObj will be built out,
		//for...in loops will run -
		//keys will be returned in <th> elements,
		//value function results will return into <td> elements
		var configObj = {};
	    
		//assign key/values to configObj based on settings
		//Input data will always be part of the history
		//variables record and recordMod set and updated
		//with for loop through historyStorage below
			configObj["Input"] = function () {
				//create Input report cell, eg. '3d8+2'
				var recordInput  = record.qty;
					recordInput += "d";
					recordInput += record.sides;
				if (recordMod >= 0) {
					recordInput += "+";
				}
					recordInput += recordMod;
				
				return recordInput;
			}
		if (config_sum) {
			configObj["Sum"] = function () {
				return record.sum() + recordMod;
			}
		}
		if (config_mean) {
			configObj["Avg"] = function () {
				return (record.mean() + (recordMod/record.qty)).toFixed(3);
			}
		}
		if (config_sortedH) {
			configObj["High to Low"] = function () {
				return record.sortedH.join(', ');
			}
		}
		if (config_sortedL) {
			configObj["Low to High"] = function () {
				return record.sortedL.join(', ');
			}
		}
		if (config_series) {
			configObj["Series"] = function () {
				return record.series.join(', ');
			}
		}
		if (config_skim) {
			configObj["Highest"] = function () {
				return record.skim(config_skimVal).join(', ');
			}
		}
		if (config_dredge) {
			configObj["Lowest"] = function () {
				return record.dredge(config_dredgeVal).join(', ');
			}
		}
		if (config_truncate) {
			configObj["Truncated"] = function () {
				return record.truncate(config_truncateVal).join(', ');
			}
		}
	    
	    
		if (config_history) { //show history is checked
			//dump contents of current table
			$('.history__table').empty();
			
			//build string of table html tags and data,
			//append at end to only repaint/reflow DOM once
			var histTableContent = "";
			
			//create table head and row
			histTableContent += "<thead><tr>";
			
			//create th for Input and each checked config item
			for (var key in configObj) {
				histTableContent += "<th>" + key + "</th>";
			}
			
			//close table head and row, create table body
			histTableContent += "</tr></thead>" + "<tbody>";
			
			//set loop cap
			var historyLogCap = config_historyVal;
			if (historyLogCap > historyStorage.length) {
				historyLogCap = historyStorage.length;
			}
			
			//loop through historyStorage
			for (var i=0; i<historyLogCap; i++) {
				var record    = historyStorage[i][0];
				var recordMod = historyStorage[i][1];
				
				//add row
				if (i % 2 === 0) { //apply class for evens
					histTableContent += "<tr class='tr--even'>";
				} else { //or odds
					histTableContent += "<tr class='tr--odd'>";
				}
				
				//create cells for Input and each checked config item - run as functions
				for (var key in configObj) {
					var value = configObj[key]()
					histTableContent += "<td>" + value + "</td>";
				}
				
				//close row
				histTableContent += "</tr>";
			}
			
			//close table body
			histTableContent += "</tbody>";
			
			//insert all table contents
			$('.history__table').html(histTableContent);
		}
	}
}



//EVENTS


//.click() EVENTS

//grab inputs and execute newRoll; update results; update history
$('#roll-input__btn').click(function () {
	validateInputs(); //check inputs
	chuckDice();      //run diceRoll and store
	updateResults();  //run updates
	updateHistory();
});

//rig increment/decrement buttons for roll inputs
//qty +/-, sides +/-, mod +/-
$('[data-parent]').click(function () {
	//clear error msg
	$('.input_valid-error').empty();
	
	//grab input element associated with button, value of
	var dataParent = $('#' + $(this).attr("data-parent"));
	var inputVal = parseInt(dataParent.val());
	
	if (inputVal != inputVal) { //NaN validation
		inputVal = "";
		$('.input_valid-error').text("*Not a number.");
	}
	
	//increment or decrement the value
	if ($(this).hasClass("plus")) {
		inputVal++;
	} else if ($(this).hasClass("minus")) {
		inputVal--;
	}
	//enforce min/max qty/sides/mod and print error msgs
	if ( (inputVal < 2) && (dataParent.is("[id*=-sides_]")) ) {
		inputVal = 2;
		$('.input_valid-error').text("*Minimum 2 sides.");
	}
	if ( (inputVal < 1) && (dataParent.is("[id*=-qty_]")) ) {
		inputVal = 1;
		$('.input_valid-error').text("*Minimum 1 dice.");
	}
	if ( (inputVal < -99999) && (dataParent.is("[id*=-mod_]")) ) {
		inputVal = -99999;
		$('.input_valid-error').text("*Maximum Modifier: -99,999.");
	}    
	if ( (inputVal > 9999) && (dataParent.is("[id*=-sides_]")) ) {
		inputVal = 9999;
		$('.input_valid-error').text("*Maximum 9,999 sides.");
	}
	if ( (inputVal > 999) && (dataParent.is("[id*=-qty_]")) ) {
		inputVal = 999;
		$('.input_valid-error').text("*Maximum 999 dice.");
	}
	if ( (inputVal > 99999) && (dataParent.is("[id*=-mod_]")) ) {
		inputVal = 99999;
		$('.input_valid-error').text("*Maximum Modifier: 99,999.");
	}
	
	//update new value to input field
	dataParent.val(inputVal);
});

//refresh Roll Results and History with new skim/dredge/truncate/Log vals
$('#refresh').click(function () {
	validateInputs(); //check inputs
	updateResults();  //run updates
	updateHistory();
});

//Clear History button to empty historyStorage
$('#history-clear').click(function () {
	historyStorage = [];
	$('.history__table').empty();
});

//Accordion Sections
$('.accordion__bar').click(function () {
	//apply visual change to parent section
	$(this).parent().toggleClass("accordion--closed");
	if ($(this).parent().hasClass("overflow")) {
		$(this).parent().toggleClass("scroll-x");
	}
	//and visual change to Headline
	$(this).toggleClass("accordion__bar--closed");
	//and collapse by hiding other elements in section
	$(this).nextAll().toggleClass("hidden");
});

//.change() EVENTS 

//Config checkboxes toggle hidden class 
//on their table row in Roll Results
//also toggle 'required' on related val inputs
$('input[type=checkbox]').change(function () {
	var selector = '#results__row--' + $(this).val();
	
	//exception for history log display
	if ($(this).val() === "historylog") {
		selector = '#history';
	}
	
	$(selector).toggleClass("hidden");
	
	//grab related input element
	var selectorValInput = '#' + $(this).val() + '_val';
	
	if ($(selectorValInput).length) { //found related input
		if ($(selectorValInput).attr("required") === "true") {
			$(selectorValInput).attr("required", "false");
		} else { 
			$(selectorValInput).attr("required", "true");
		}
	}
});


//keyboard EVENTS

//bind event for Enter Key on all Input elements
$('input').bind('keyup', function (e) {
	if (e.keyCode === 13) { //Enter Key
		
		validateInputs(); //check inputs
		
		if ($(this).hasClass("roll-input")) { //input is for roll
			chuckDice();     //run diceRoll and store
			updateResults(); //run updates
			updateHistory();
		    
		} else { //input is from Config panel
			if (inputErrorConfig) { //log error
			    $('.config_valid-error').text(inputErrorConfigMsg);
			
			} else { // (!inputErrorRoll)
				$('.config_valid-error').text(""); //clear error log
				
				switch ($(this).attr("id")) { //identify which
					case "skim_val":
						updateSkim(); //refresh Highest x rolls
						break;
					case "dredge_val":
						updateDredge(); //refresh Lowest x rolls
						break;
					case "truncate_val":
						updateTruncate(); //refresh Truncated rolls
						break;
					case "history_val":
						updateHistory(); //refresh History Log
						break;
					default:
						break;
				}
			}
		}
	}
});


//END JQUERY
});
