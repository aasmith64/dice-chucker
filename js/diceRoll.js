//Create class
function diceRoll(sides, qty) { //pass numbers as arguments
	//PROPERTY DECLARATIONS
	
	//DEFAULT arguments
	this.sides   = 6;  //DEFAULT, num of sides on dice (val is replaced by valid arg)
	this.qty     = 1;  //DEFAULT, num of dice to roll (val is replaced by valid arg)
	
	//ARRAYS of the rolls
	this.series  = []; //ARRAY of rolls, filled below
	this.sortedH = []; //ARRAY, High->Low, of the rolls
	this.sortedL = []; //ARRAY, Low->High, of the rolls
	
	//METHODS
	this.skim;     //.skim(n) to return ARRAY
			//highest n values
			//Argument: number (pos int)
			//DEFAULT: 1
	
	this.dredge;   //.dredge(n) to return ARRAY
			//lowest n values
			//Argument: number (pos int)
			//DEFAULT: 1
	
	this.truncate; //.truncate(n) to return ARRAY
			//after discarding n highest
			//and n lowest values
			//Argument: number (pos int)
			//DEFAULT: 1
	
	this.sum;      //.sum(rollArray) to return INT
			//sum of all array values
			//Argument: Array of numbers
			//DEFAULT: this.series
	
	this.mean;     //.mean(rollArray) to return INT
			//average of array values
			//Argument: Array of numbers
			//DEFAULT: this.series
	
	
	//test diceRoll() arguments for validity;
	//if good, then pass them to the properties,
	//else keep above defaults
	if ((typeof sides === "number") && (sides >= 1)) {
		this.sides = Math.floor(sides); //round down to int, just in case
	}
	
	if ((typeof qty   === "number") && (qty   >= 1)) {
		this.qty   = Math.floor(qty);   //round down to int, just in case
	}
	
	
	//generate the dice rolls, fill this.series array
	for (var i = 1; i <= this.qty; i++) { //loop through the quantity of dice
		var roll = Math.ceil((Math.random() * this.sides)); 
			//roll new random # b/n 1 and # of sides (inclusive)
		this.series.push(roll); //roll goes at end of the series
	}
	
	//generate the sorted arrays
	this.sortedH = this.series.slice(0).sort(function (a, b) { return b-a}); 
		//slice for simple array copy, then sort
	
	this.sortedL = this.sortedH.slice(0).reverse(); 
		//slice for simple array copy of the High->Low, then reverse order
	
	
	//define Methods
	this.skim = function (n) { //.skim(n) to get array of highest x values
	    if ((typeof n != "number") || (n < 1) || (n != n)) {
	        n = 1; //DEFAULT n if argument was empty or invalid
	    }
	    this.skimArray   = this.sortedH.slice(0, n); 
	    	//copies n total values from start of High->Low array
	    
	    return this.skimArray;
	}
	
	this.dredge = function (n) { //.dredge(n) to get array of lowest x values
		if ((typeof n != "number") || (n < 1) || (n != n)) {
			n = 1; //DEFAULT n if argument was empty or invalid
		}
		this.dredgeArray = this.sortedL.slice(0, n); 
			//copies n total values from start of Low->High array
		
		return this.dredgeArray;
	}
	
	this.truncate = function (n) { //.truncate(n) to discard n highest and n lowest values
		if ((typeof n != "number") || (n < 1)) {
			n = 1; //DEFAULT n if argument was empty or invalid
		}
		this.truncateArray = this.sortedH.slice(0);
		for (var i = 0; i < n; i++) {   //run loop n times
			this.truncateArray.shift(); //remove highest
			this.truncateArray.pop();   //remove lowest
		}
		
		return this.truncateArray;
	}
	
	this.sum = function (rollArray) {
		if ((typeof rollArray != "object") || (rollArray === null)) {
			rollArray = this.series; //DEFAULT rollArray if argument was empty or invalid
		}
		var sum = 0;
		for (var i = 0; i < rollArray.length; i++) {
			sum += rollArray[i];
		}
		
		return sum;
	}
	
	this.mean = function (rollArray) {
		if ((typeof rollArray != "object") || (rollArray === null)) {
			rollArray = this.series; //DEFAULT rollArray if argument was empty or invalid
		}
		var mean = 0;
		for (var i = 0; i < rollArray.length; i++) {
			mean += rollArray[i];
		}
		mean = mean / rollArray.length;
		
		return mean;
	}

}
