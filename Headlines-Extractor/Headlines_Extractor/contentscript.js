
var all_page_nodes = document.getElementsByTagName("*");
console.log("all_page_nodes " + all_page_nodes.length)
var possible_candidates = []
var possible_elements = []
var english = /[A-Za-z0-9 _.,!"'/$]*/;

var num_of_words = 6
for (var i=0; i <all_page_nodes.length; i++) {
	var current_node = all_page_nodes[i]
	if (isHidden(current_node) == true) { //visible elements only
		continue
	}

	if (current_node.childNodes.length != 1) { //elements that dont have children
		continue
	}

	if (current_node.innerText === undefined) {
		continue
	}
	var innerT = current_node.innerText.trim()




	if (innerT.length >= 300 && innerT.length <= 70) { //elements with inner Text length between 70 and 100

		continue
	}
	if (innerT.toLowerCase().indexOf("sponsored") !== -1 || innerT.toLowerCase().indexOf("refresh the page") !== -1) { //rule out advertisements
		continue
	}

	innerT = current_node.innerText.split("\n")
	for (var j=0; j<innerT.length; j++){ //now checking individual lines in the element text
		innerT[j] = innerT[j].trim()
		var not_english_sentence = 0
		if (num_words(innerT[j]) < num_of_words) { //one line should have greater than 6 words
			continue
		}
		for (var k = 0; k<innerT[j].length; k++) { //is this sentence english?
			if (english.test(innerT[j][k]) == false) {
				not_english_sentence = 1
			}
		}
		if (not_english_sentence == 1){
			console.log(innerT[j])
			continue
		}

		//console.log(current_node.innerText)
		//console.log(innerT[j])

		if (possible_candidates.indexOf(innerT[j]) === -1) { //avoid duplicates
			possible_elements.push(current_node)
			possible_candidates.push(innerT[j]) //save into array if so
		}


	}


}

//draw boxes around text
var results = []

for (var c = 0; c < possible_elements.length; c++) {

	var request = {"id":c, "text":possible_candidates[c]}
	sendQuery(JSON.stringify(request), possible_elements[c])
	//draw_box(possible_elements[c], c, results[c])	
	//console.log(results)

}


/*
possible_candidates = possible_candidates.filter( function( item, index, inputArray ) {
		   return inputArray.indexOf(item) == index;
	});
*/	

console.log(possible_candidates)
console.log("possible_candidates " + possible_candidates.length)


/*
for (var s = 0; s<10; s++) {
	
	var sentence = "this is test sentence " + s
	var request = {"id":s, "text":sentence}
	#sendQuery(JSON.stringify(request))
	sendQuery(sentence)
}
*/
	
function toString(json_input) {
	var output_string = ""
	for (i =0; i<json_input.length; i++) {
		output_string += json_input[i]["topic"]	+ ": " + json_input[i]["score"] 
		if (i != json_input.length-1) {
			output_string+=", "
		}
	}
	return output_string
}

function sendQuery(queryString, element) {
	//nsole.log(queryString)
	$.ajax({
			type: "POST",
			url: "http://lazycrossing.com:8080/get_topic",
			data: queryString,
			success: function(msg){
				
				msg = JSON.parse(JSON.parse(msg))
				
				topics = msg['topics']
				temp = []
				tops = []
				for (var i = 0; i < 3; i++) {
				
					var score = parseFloat(topics[i]['score'])*100
					if (tops.indexOf(get_topic(parseInt(topics[i]["topic"]))) === -1) {
						tops.push(get_topic(parseInt(topics[i]["topic"])))
						temp.push({"topic": get_topic(parseInt(topics[i]["topic"])), "score":score.toPrecision(2) + "%"})
					}
					
					
				}
				draw_box(element, toString(temp))
				
				
		   },
		   error: function(msg){
				console.log("error: " + msg)
		   }
	});
}



function isHidden(el) {
    var style = window.getComputedStyle(el);
    return (style.display === 'none') || (el.offsetParent === null)
}

function num_words(str) {
	return str.split(" ").length
}

function get_topic(id) {
	var topic_lookup = ["Atheism", "Comp", "Comp", "Comp", "Comp", "Comp", "Sale", "Auto", "Motorcycles", "Sports", "Sports", "Crypto", "Electronics", "Med", "Space", "Christianity", "Politics", "Politics", "Politics", "Religion"]
	
	return topic_lookup[id]
}

function draw_box(element, text) {
	element.style.outline = "medium dashed #0000FF"
	element.style.zIndex = 10000000
	
	var new_element = document.createElement("p")
	new_element.innerText = text
	element.parentElement.insertBefore(new_element, element)
	new_element.style.zIndex = 1000000
	
	if (element.getAttribute('class') !== null) {
		new_element.setAttribute("class", element.getAttribute("class"))
	}
	new_element.style.backgroundColor = "yellow"
	new_element.style.color = "black"
	//new_element.style.fontSize = "small"
	/*
	var placement = element.getBoundingClientRect()
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
	//context.rect(x, y, width, height);
	//context.strokeStyle = 'green';
	//context.stroke();
	
	context.fillStyle = 'blue';
	context.font="20px Georgia";
	context.fillText(text, x, y-10);
	*/
	
	
	
}
