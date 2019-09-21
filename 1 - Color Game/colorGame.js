var squares_num = 6;
var colors = generateColors(squares_num);
var picked_color = pickColor();

var squares = document.querySelectorAll(".square");
var color_txt = document.getElementById("color_txt");
var message_txt = document.getElementById("message");
var h1 = document.querySelector("h1");
var new_colors_btn = document.querySelector("#reset");
var easy_btn = document.getElementById("easy");
var hard_btn = document.getElementById("hard");


color_txt.textContent = picked_color;

for(var i = 0; i < squares.length; i++){
	// add initial colors to squares
	squares[i].style.background = colors[i];

	//add click listeners to squares
	squares[i].addEventListener("click", function() {
		// grab color of clicked squares
		var clicked_color = this.style.background;
		
		// compare color to pickedcolor
		if(clicked_color === picked_color) {
			changeColors(picked_color);
			h1.style.background = clicked_color;
			new_colors_btn.textContent = "PLAY AGAIN?";
		} else {
			tryAgain(this);
		}
	});
}

function changeColors(color){
	message_txt.textContent = "Correct!";

	for(var i = 0; i < squares.length; i++){
		squares[i].style.background = color;
	}
}

function tryAgain(square){
	message_txt.textContent = "Try again!";
	square.style.background = "#232323";
}


function pickColor(){
	var index = Math.floor(Math.random() * colors.length);

	return colors[index];
}


function generateColors(num){
	var array = [];

	for(var i = 0; i < num; i++){
		array.push(randomColor());
	}

	return array;
}


function randomColor(){
	var red = Math.floor(Math.random() * 256);
	var green = Math.floor(Math.random() * 256);
	var blue = Math.floor(Math.random() * 256);

	return "rgb(" + red + ", " + green + ", " + blue + ")";
}


new_colors_btn.addEventListener("click", function(){
	// generate new colors and pick a new one
	colors = generateColors(squares_num);
	picked_color = pickColor();
	color_txt.textContent = picked_color;

	// change square colors
	for(var i = 0; i < squares.length; i++){
		squares[i].style.background = colors[i];
	}

	resetGameInfo();
});


easy_btn.addEventListener("click", function(){
	this.classList.add("selected");
	hard_btn.classList.remove("selected");
	
	squares_num = 3;
	colors = generateColors(squares_num);
	picked_color = pickColor();
	color_txt.textContent = picked_color;

	for(var i = 0; i < squares.length; i++){
		if(colors[i]){
			squares[i].style.background = colors[i];
		}
		else{
			squares[i].style.display = "none";
		}
	}

	resetGameInfo();
});


hard_btn.addEventListener("click", function(){
	this.classList.add("selected");
	easy_btn.classList.remove("selected");
	squares_num = 6;

	colors = generateColors(squares_num);
	picked_color = pickColor();
	color_txt.textContent = picked_color;

	for(var i = 0; i < squares.length; i++){
		squares[i].style.background = colors[i];
		squares[i].style.display = "block";
	}

	resetGameInfo();
});


function resetGameInfo(){
	new_colors_btn.textContent = "NEW COLORS";
	h1.style.background = "steelblue";
	message_txt.textContent = "";
}

