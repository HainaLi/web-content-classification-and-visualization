var all_page_nodes = document.getElementsByTagName("*");
console.log("all_page_nodes " + all_page_nodes.length)
var possible_candidates = []
for (var i=0; i <all_page_nodes.length; i++) {
	var current_node = all_page_nodes[i]
	if (isHidden(current_node) == true) {
		continue
	}
	if (current_node.childNodes.length == 0) {
		continue
	}
	var innerT = current_node.innerText.trim()
	

	if (innerT.length < 100 && innerT.length > 70) {
		possible_candidates.push(current_node)
		console.log(innerT)
	}
}
function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none')
}
console.log("possible_candidates " + possible_candidates.length)
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