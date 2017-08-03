var lengthObj = {
	sessionLength: 25,
	breakLength: 5
};

var onBreak = false;
var isRunning = false;

var sessSect = document.querySelector(".session");
var breakSect = document.querySelector(".break");

var decreaseButtons = document.querySelectorAll(".dec");
var increaseButtons = document.querySelectorAll(".inc");

var timer = document.querySelector(".timer");
var start = document.querySelector(".start");
// create a function that when called, increases the value.
// It should update a desired element.

var increment = (obj, key, varName) => {
	if (obj[key] < 50) {
		obj[key] += 1;
	}
	varName.textContent = obj[key];
}

// create a function that when called, decreases a value.

var decrement = (obj, key, varName) => {
	if (obj[key] > 1) {
		obj[key] -= 1;
	}
	varName.textContent = obj[key];	
}

var primeButtons = (index, key, section ) => {
	decreaseButtons[index].addEventListener("click", () => {
		decrement(lengthObj, key, section);
		if(key === "sessionLength"){
			timer.textContent = lengthObj.sessionLength;
		}
	});

	increaseButtons[index].addEventListener("click", () => {
		increment(lengthObj, key, section);
		if(key === "sessionLength"){
			timer.textContent = lengthObj.sessionLength;
		}
	});
}

// Both values must always be 1 or greater.

// a basic function using setTimeout to count down for us.
var sessCountDown = (msSess, msBreak) => {
	//debugger;
	isRunning = true;
	if(!onBreak){
		var decreasedTime = msSess - 1000;
		console.log(msSess);
		if(msSess > 0){
			// defining the timer on the object so I have access to it outside
			// of the function scope.
			lengthObj.timeLeft = setTimeout(() => {
				sessCountDown(decreasedTime, msBreak);
			}, 1000);
		} else {
			console.log("Timer has completed! Break time!");
			onBreak = true;
			// once this section is reached, the break begins!
			breakCountDown(msBreak);
		}
	} 
}

var breakCountDown = (msBreak) => {
	if(onBreak) {
		// Now that we're on break, we can run the break timer.
		var decreasedTime = msBreak - 1000;
		console.log(msBreak);
		if(msBreak > 0){
			lengthObj.timeLeft = setTimeout( () => {
				breakCountDown(decreasedTime);
			}, 1000);
		} else {
			console.log("Timer has finished! Break over!");
			onBreak = false;
			isRunning = false;
		}
	}
}

// Trying out object.watch. It checks if a noted variable within a
// specified object changes.
// lengthObj.watch('sessionLength', (id, old, newVal) => {
// 	console.log("session length changed!");
// 	timer.textContent = newVal;
// 	return newVal;
// });

// initializing the display.
sessSect.textContent = lengthObj.sessionLength;
breakSect.textContent = lengthObj.breakLength;

// index 0 refers to the "break" buttons, while
// index 1 refers to the "session" buttons.
// Couldn't really think of a way to make this one nicer.

primeButtons(0, "breakLength", breakSect);

primeButtons(1, "sessionLength", sessSect);

start.addEventListener("click", () => {
	sessCountDown(lengthObj.sessionLength * 60 * 1000, lengthObj.breakLength * 60 * 1000);
	// logging the total number of miliseconds.
	// setInterval(() => {
	// 	console.log("one second has passed.");
	// }, 1000);
	// console.log(lengthObj.sessionLength * 60 * 1000);
});