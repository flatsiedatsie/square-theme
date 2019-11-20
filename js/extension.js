(function() {
  class SquareTheme extends window.Extension {
    constructor() {
      super('square-theme');
      //this.addMenuEntry('Square theme');

      //this.content = '';
      
    }

    //show() {
    //  this.view.innerHTML = this.content;
    //}	
  }

  new SquareTheme();
	
	//setTimeout(function() {
	//	add_parts();
	//}, 1000);


	
	var intervalID = setInterval(add_parts, 50);

	function add_parts(){
		var listItems = document.querySelectorAll("#things:not(.single-thing) > .thing > *:not(a):not(span):not(.component), #things:not(.single-thing) > .thing > *:not(div):not(.component), #things.single-thing > .thing > *:not(div), #things.single-thing > .thing > div.thing-detail-container > *:not(.component)");
		//var listItems = document.querySelectorAll("#things:not(.single-thing) > .thing > *:not(a):not(span)");
		//var listItems = document.querySelectorAll("#things.single-thing > .thing");

		//console.log(listItems.length);
	
		for (let i=0; i < listItems.length; i++) {
			
			if(listItems[i].shadowRoot){
				//console.log(listItems[i].shadowRoot);
				listItems[i].classList.add('component');
				updateStyle(listItems[i])
			}
			//else{
			//	console.log("No shadowRoot found");
			//}
		}
		
		
		// Add the thermostat buttons		
		var thermostats = document.getElementsByTagName("webthing-target-temperature-property");
			for (let i=0; i < thermostats.length; i++) {
				//console.log(thermostats[i].classList);
				if(!thermostats[i].classList.contains("extra-thermostat-buttons")){
					var component_id = thermostats[i].id;
					//console.log("id=",thermostats[i].id);
					
					thermostats[i].classList.add("extra-thermostat-buttons");
					const shadow = thermostats[i].shadowRoot;
					const childNodes = Array.from(shadow.childNodes);
					
					//var htmldata = '<div part="extra-thermostat-buttons"><div id="down" part="down" onclick="updateInputValue(\'' + component_id + '\',-1)">-</div><div id="up" part="up" onclick="updateInputValue(\'' + component_id + '\',1)">+</div><div>';
					var htmldata = '<div id="extra-thermostat-buttons" part="extra-thermostat-buttons">';
					htmldata += '<div id="down" part="down" onclick="updateInputValue(\'' + component_id + '\',-1)">-</div>';
					htmldata += '<div id="up" part="up" onclick="updateInputValue(\'' + component_id + '\',1)">+</div>';
					htmldata += '</div>';
					var e = document.createElement('div');
					e.part = 'extra-thermostat-buttons';
					//console.log(e);
					//e.appendChild(htmldata);
					//console.log(e);
					e.innerHTML = htmldata;
					//console.log(e.innerHTML);
					//shadow.querySelector(".webthing-number-property-container").appendChild(e.firstChild);
					var referenceNode = shadow.querySelector(".webthing-number-property-contents");
					referenceNode.parentNode.insertBefore(e, referenceNode.nextSibling);
				}
			}
	}

	function updateStyle(elem) {
		const shadow = elem.shadowRoot;
		var full_list = shadow.querySelectorAll("*");


		for (let i=0; i < full_list.length; i++) {
			
			var classname = full_list[i].getAttribute("id");
			if(classname !== null){
				if(classname.indexOf('-') != -1){
					classname = classname.substr(0, classname.indexOf('-')); 
				}
				full_list[i].setAttribute("part", classname);
			}
		}

	}


})();


function updateInputValue(id,amount){
	//console.log("new values",id,amount);
	var target = document.getElementById(id);
	//console.log(target.value);
	var temperature = Number(target.value);
	temperature = temperature + Number(amount);
	//console.log(temperature);
	target.value = temperature;
	var event = new Event('change');
	target.dispatchEvent(event);
}


