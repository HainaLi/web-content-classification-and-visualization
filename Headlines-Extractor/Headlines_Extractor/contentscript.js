

var all_page_nodes = document.getElementsByTagName("*");
console.log("all_page_nodes " + all_page_nodes.length)
var possible_candidates = []
var english = /^[A-Za-z0-9]*$/;

var num_of_words = 6
for (var i=0; i <all_page_nodes.length; i++) {
	var current_node = all_page_nodes[i]
	if (isHidden(current_node) == true) {
		continue
	}
	if (current_node.childNodes.length == 0) {
		continue
	}
	
	var innerT = current_node.innerText.trim()
	
	if (innerT.length >= 100 && innerT.length <= 70) {
		
		continue
	}
	if (innerT.toLowerCase().indexOf("sign in") !== -1 || innerT.toLowerCase().indexOf("log in") !== -1 || innerT.toLowerCase().indexOf("register") !== -1) {
		continue
	}
	
	innerT = current_node.innerText.split("/n")
	for (var j=0; j<innerT.length; j++){
		innerT[j] = innerT[j].trim()
		if (num_words(innerT[j]) < num_of_words) {
			continue
		}
		for (var k = 0; k<innerT[j].length; k++) {
			if (english.test(innerT[j][k]) == false) {
				continue
			}
		}
		
		possible_candidates.push(innerT[j])
		
	}
	
}

possible_candidates = possible_candidates.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
    });

console.log( possible_candidates)
console.log("possible_candidates " + possible_candidates.length)

$.ajax({
		type: "POST",
		url: "http://lazycrossing.com:8080/get_topic",
		data: "test sentence",
		success: function(msg){
			console.log(msg)
	   },
	   error: function(){
			console.log("error: " + msg)
	   }
	 });




function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none')
}

function num_words(str) {
	return str.split(" ").length
}

/*
var placement = document.getElementById("circle_text").getBoundingClientRect()
var x = placement.left;
var y = placement.top;
var width = placement.width;
var height = placement.height;

var canvas = document.createElement('canvas'); //Create a canvas element
//Set canvas width/height
canvas.style.width='100%';
canvas.style.height='100%';
//Set canvas drawing area width/height
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
//Position canvas
canvas.style.position='absolute';
canvas.style.left=0;
canvas.style.top=0;
canvas.style.zIndex=100000;
canvas.style.pointerEvents='none'; //Make sure you can click 'through' the canvas
document.body.appendChild(canvas); //Append canvas to body element
var context = canvas.getContext('2d');
//Draw rectangle
context.rect(x, y, width, height);
context.strokeStyle = 'yellow';
context.stroke();
context.fillStyle = 'yellow';
context.font="40px Georgia";
context.fillText("Life", x, y-10);
*/