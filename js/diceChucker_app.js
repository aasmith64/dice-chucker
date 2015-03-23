//Dice Chucker app rigging

//declare app object with defaults
//values updated by ('#dc-roll-input__btn').click(),
//and by keyup 'enter' events from the roll-input inputs

var dcApp                    = {}; //namespace object
    dcApp.newInput           = {}; //input values to feed new diceRoll() params
    dcApp.config             = {}; //configuration settings for results/history display
    dcApp.errors             = {}; //error validation storage
    dcApp.newRoll            = {}; //will be new diceRoll() object
    dcApp.historyStorage     = []; //store up to 50 dcApp.newRoll 's

//default roll inputs
    dcApp.newInput.qty       = 1;
    dcApp.newInput.sides     = 6;
    dcApp.newInput.mod       = 0;

//default config for display of dcApp.newRoll results
    dcApp.config.sum         = true;
    dcApp.config.mean        = false;
    dcApp.config.sortedH     = true;
    dcApp.config.sortedL     = false;
    dcApp.config.series      = false;
    dcApp.config.skim        = false;
    dcApp.config.skimVal     = 1;
    dcApp.config.dredge      = false;
    dcApp.config.dredgeVal   = 1;
    dcApp.config.truncate    = false;
    dcApp.config.truncateVal = 1;
    dcApp.config.history     = true;
    dcApp.config.historyVal  = 5;

//validation defaults - see function dc_validateInputs()
    dcApp.errors.RollFlag    = false; //true prevents roll
    dcApp.errors.RollMsg     = "";    //and will prep and display msg
    dcApp.errors.ConfigFlag  = false; //true prevents update functions
    dcApp.errors.ConfigMsg   = "";    //and will prep and display msg



//BEGIN JQUERY
$(document).ready(function() {


//prepare system functions

//call for testing input values for roll and config
function dc_validateInputs() {
	//reset flags
	dcApp.errors.RollFlag   = false; //true prevents roll
	dcApp.errors.RollMsg    = "";    //and will prep and display msg
	dcApp.errors.ConfigFlag = false; //true prevents update functions
	dcApp.errors.ConfigMsg  = "";    //and will prep and display msg
	
	//jquery select any invalid inputs - HTML5
	$('input:invalid').each(function() {
		//trips the appropriate error flag var to true
		//and loads a suitable msg snippet to appropriate msg var
		//from element's html data-errormsg attr
		if ($(this).hasClass("roll-input")) {
			dcApp.errors.RollFlag  = true;
			dcApp.errors.RollMsg  += $(this).attr("data-errormsg");
		} else { //is config input
			dcApp.errors.ConfigFlag  = true;
			dcApp.errors.ConfigMsg  += $(this).attr("data-errormsg");
		}
		
		//focus cursor on invalid input
		$(this).focus();
	});
	
}


//generate valid roll and add it to dcApp.historyStorage
function chuckDice() {
    if (dcApp.errors.RollFlag) { //log error
        $('.dc-input__valid-error').text(dcApp.errors.RollMsg);
        
    } else { // (!dcApp.errors.RollFlag)
        $('.dc-input__valid-error').text(""); //clear error log
        
        //get and store current input vals
        dcApp.newInput.qty   = parseInt($('#input-qty_val')  .val());
        dcApp.newInput.sides = parseInt($('#input-sides_val').val());
        dcApp.newInput.mod   = parseInt($('#input-mod_val')  .val());
        
        //generate roll, also put it in dcApp.historyStorage
        dcApp.newRoll = new diceRoll(dcApp.newInput.sides, dcApp.newInput.qty);
        
        dcApp.historyStorage.unshift([dcApp.newRoll, dcApp.newInput.mod]);
        if (dcApp.historyStorage.length > 50) {
            dcApp.historyStorage.pop();   //enforce max limit for Log
        }
    }
}

//when called, update the Roll Results table
function dc_updateResults() {
	if (dcApp.errors.ConfigFlag) { //log error
			$('.dc-config__valid-error').text(dcApp.errors.ConfigMsg);
	} else { // (!dcApp.errors.ConfigFlag)
		$('.dc-config__valid-error').text(""); //clear error log
		
		//build Input report
		var resultInput  = '<i class="dc-txt__i">Qty</i>: ' + dcApp.newRoll.qty;
		    resultInput += '<br><i class="dc-txt__i">Sides</i>: ' + dcApp.newRoll.sides;
		    resultInput += '<br><i class="dc-txt__i">Mod</i>: '
			if (dcApp.newInput.mod > 0) {
				resultInput += "+";
			}
			resultInput += dcApp.newInput.mod;
            
		$('#dc-results__cell--input')      .html(resultInput);
		$('#dc-results__cell--sum')        .text(dcApp.newRoll.sum()
		                                      + dcApp.newInput.mod);
		$('#dc-results__cell--mean')       .text((dcApp.newRoll.mean()
		                                       + (dcApp.newInput.mod/dcApp.newRoll.qty)).toFixed(3));
		                                         //round to 3 decimal points
	        $('#dc-results__cell--sorted-high').text(dcApp.newRoll.sortedH.join(', '));
	        $('#dc-results__cell--sorted-low') .text(dcApp.newRoll.sortedL.join(', '));
	        $('#dc-results__cell--series')     .text(dcApp.newRoll.series.join(', '));
	        dc_updateSkim();
	        dc_updateDredge();
		dc_updateTruncate();
	}
}
function dc_updateSkim() { //component of dc_updateResults, also called separately by event
	var n = parseInt($('#skim_val').val());
	$('#dc-results__cell--skim').text(dcApp.newRoll.skim(n).join(', '));
}
function dc_updateDredge() { //component of dc_updateResults, also called separately by event
	var n = parseInt($('#dredge_val').val());
	$('#dc-results__cell--dredge').text(dcApp.newRoll.dredge(n).join(', '));
}
function dc_updateTruncate() { //component of dc_updateResults, also called separately by event
	var n = parseInt($('#truncate_val').val());
	$('#dc-results__cell--truncate').text(dcApp.newRoll.truncate(n).join(', '));
}

//when called, build contents of History table and update it
function dc_updateHistory() {
	if (dcApp.errors.ConfigFlag) { //log error
		$('.dc-config__valid-error').text(dcApp.errors.ConfigMsg);
	} else { // (!dcApp.errors.ConfigFlag)
		$('.dc-config__valid-error').text(""); //clear error log
	    
		//grab config settings
		dcApp.config.sum         = $('#sum')        .is(':checked');
		dcApp.config.mean        = $('#mean')       .is(':checked');
		dcApp.config.sortedH     = $('#sorted-high').is(':checked');
		dcApp.config.sortedL     = $('#sorted-low') .is(':checked');
		dcApp.config.series      = $('#series')     .is(':checked');
		dcApp.config.skim        = $('#skim')       .is(':checked');
		dcApp.config.dredge      = $('#dredge')     .is(':checked');
		dcApp.config.truncate    = $('#truncate')   .is(':checked');
		dcApp.config.history     = $('#historylog') .is(':checked');
		dcApp.config.skimVal     = parseInt($('#skim_val')    .val());
		dcApp.config.dredgeVal   = parseInt($('#dredge_val')  .val());
		dcApp.config.truncateVal = parseInt($('#truncate_val').val());
		dcApp.config.historyVal  = parseInt($('#history_val') .val());
		
		//configObj will be built out,
		//for...in loops will run -
		//keys will be returned in <th> elements,
		//value function results will return into <td> elements
		var configObj = {};
	    
		//assign key/values to configObj based on settings
		//Input data will always be part of the history
		//variables record and recordMod set and updated
		//with for loop through dcApp.historyStorage below
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
		if (dcApp.config.sum) {
			configObj["Sum"] = function () {
				return record.sum() + recordMod;
			}
		}
		if (dcApp.config.mean) {
			configObj["Avg"] = function () {
				return (record.mean() + (recordMod/record.qty)).toFixed(3);
			}
		}
		if (dcApp.config.sortedH) {
			configObj["High to Low"] = function () {
				return record.sortedH.join(', ');
			}
		}
		if (dcApp.config.sortedL) {
			configObj["Low to High"] = function () {
				return record.sortedL.join(', ');
			}
		}
		if (dcApp.config.series) {
			configObj["Series"] = function () {
				return record.series.join(', ');
			}
		}
		if (dcApp.config.skim) {
			configObj["Highest"] = function () {
				return record.skim(dcApp.config.skimVal).join(', ');
			}
		}
		if (dcApp.config.dredge) {
			configObj["Lowest"] = function () {
				return record.dredge(dcApp.config.dredgeVal).join(', ');
			}
		}
		if (dcApp.config.truncate) {
			configObj["Truncated"] = function () {
				return record.truncate(dcApp.config.truncateVal).join(', ');
			}
		}
	    
	    
		if (dcApp.config.history) { //show history is checked
			//dump contents of current table
			$('.dc-history__table').empty();
			
			//build string of table html tags and data,
			//append at end to only repaint/reflow DOM once
			var histTableContent = "";
			
			//create table head and row
			histTableContent += '<thead class="dc-history__thead"><tr class="dc-history__tr dc-history__tr--head">';
			
			//create th for Input and each checked config item
			for (var key in configObj) {
				histTableContent += '<th class="dc-history__th">' + key + '</th>';
			}
			
			//close table head and row, create table body
			histTableContent += '</tr></thead>' + '<tbody class="dc-history__tbody">';
			
			//set loop cap
			var historyLogCap = dcApp.config.historyVal;
			if (historyLogCap > dcApp.historyStorage.length) {
				historyLogCap = dcApp.historyStorage.length;
			}
			
			//loop through dcApp.historyStorage
			for (var i=0; i<historyLogCap; i++) {
				var record    = dcApp.historyStorage[i][0];
				var recordMod = dcApp.historyStorage[i][1];
				
				//add row
				if (i % 2 === 0) { //apply class for evens
					histTableContent += '<tr class="dc-history__tr tr--even">';
				} else { //or odds
					histTableContent += '<tr class="dc-history__tr tr--odd">';
				}
				
				//create cells for Input and each checked config item - run as functions
				for (var key in configObj) {
					var value = configObj[key]()
					histTableContent += '<td class="dc-history__td">' + value + '</td>';
				}
				
				//close row
				histTableContent += '</tr>';
			}
			
			//close table body
			histTableContent += '</tbody>';
			
			//insert all table contents
			$('.dc-history__table').html(histTableContent);
		}
	}
}



//EVENTS


//.click() EVENTS

//grab inputs and execute dcApp.newRoll; update results; update history
$('#dc-roll-input__btn').click(function () {
	dc_validateInputs(); //check inputs
	chuckDice();      //run diceRoll and store
	dc_updateResults();  //run updates
	dc_updateHistory();
});

//rig increment/decrement buttons for roll inputs
//qty +/-, sides +/-, mod +/-
$('[data-parent]').click(function () {
	//clear error msg
	$('.dc-input__valid-error').empty();
	
	//grab input element associated with button, value of
	var dataParent = $('#' + $(this).attr("data-parent"));
	var inputVal = parseInt(dataParent.val());
	
	if (inputVal != inputVal) { //NaN validation
		inputVal = "";
		$('.dc-input__valid-error').text("*Not a number.");
	}
	
	//increment or decrement the value
	if ($(this).hasClass("dc-roll-input__plus")) {
		inputVal++;
	} else if ($(this).hasClass("dc-roll-input__minus")) {
		inputVal--;
	}
	//enforce min/max qty/sides/mod and print error msgs
	if ( (inputVal < 2) && (dataParent.is("[id*=-sides_]")) ) {
		inputVal = 2;
		$('.dc-input__valid-error').text("*Minimum 2 sides.");
	}
	if ( (inputVal < 1) && (dataParent.is("[id*=-qty_]")) ) {
		inputVal = 1;
		$('.dc-input__valid-error').text("*Minimum 1 dice.");
	}
	if ( (inputVal < -99999) && (dataParent.is("[id*=-mod_]")) ) {
		inputVal = -99999;
		$('.dc-input__valid-error').text("*Maximum Modifier: -99,999.");
	}    
	if ( (inputVal > 9999) && (dataParent.is("[id*=-sides_]")) ) {
		inputVal = 9999;
		$('.dc-input__valid-error').text("*Maximum 9,999 sides.");
	}
	if ( (inputVal > 999) && (dataParent.is("[id*=-qty_]")) ) {
		inputVal = 999;
		$('.dc-input__valid-error').text("*Maximum 999 dice.");
	}
	if ( (inputVal > 99999) && (dataParent.is("[id*=-mod_]")) ) {
		inputVal = 99999;
		$('.dc-input__valid-error').text("*Maximum Modifier: 99,999.");
	}
	
	//update new value to input field
	dataParent.val(inputVal);
});

//refresh Roll Results and History with new skim/dredge/truncate/Log vals
$('#refresh').click(function () {
	dc_validateInputs(); //check inputs
	dc_updateResults();  //run updates
	dc_updateHistory();
});

//Clear History button to empty dcApp.historyStorage
$('#history-clear').click(function () {
	dcApp.historyStorage = [];
	$('.dc-history__table').empty();
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
	var selector = '#dc-results__row--' + $(this).val();
	
	//exception for history log display
	if ($(this).val() === "historylog") {
		selector = '#dc-history';
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
		
		dc_validateInputs(); //check inputs
		
		if ($(this).hasClass("roll-input")) { //input is for roll
			chuckDice();     //run diceRoll and store
			dc_updateResults(); //run updates
			dc_updateHistory();
		    
		} else { //input is from Config panel
			if (dcApp.errors.ConfigFlag) { //log error
			    $('.dc-config__valid-error').text(dcApp.errors.ConfigMsg);
			
			} else { // (!dcApp.errors.ConfigFlag)
				$('.dc-config__valid-error').text(""); //clear error log
				
				switch ($(this).attr("id")) { //identify which
					case "skim_val":
						dc_updateSkim(); //refresh Highest x rolls
						break;
					case "dredge_val":
						dc_updateDredge(); //refresh Lowest x rolls
						break;
					case "truncate_val":
						dc_updateTruncate(); //refresh Truncated rolls
						break;
					case "history_val":
						dc_updateHistory(); //refresh History Log
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
