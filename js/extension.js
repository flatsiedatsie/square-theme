(function() {
  class SquareTheme extends window.Extension {
    constructor() {
      super('square-theme');
      this.observer = new MutationObserver(this.mutationCallback.bind(this));
      this.observer.observe(
        document.getElementById('things'),
        {childList: true}
      );

      // apply the theme after loading
      this.addParts();
      this.addThermostatButtons();

      
        var pushState = history.pushState;
        history.pushState = function () {
            pushState.apply(history, arguments);
            console.log("pushState");
            //console.log(this);
            if(this.state.path == '/logs'){
                console.log("at logs");
                //this.addLogSelector();
                
                
                const listItems = document.querySelectorAll(' #logs-view .logs-log-name');
                var log_names = [];
                for (const item of listItems) {
                    log_names.push(item.innerHTML);
                }
                console.log("log item names = " + log_names);
                if(log_names.length > 2 ){
                    
                    const logs_view = document.getElementById("logs-view");
                    logs_view.classList.add('long-list');

                    // If the log list container does not exist, create it.
                    var log_list_container = document.getElementById("log-list-container");
                    if(!log_list_container){
                        const log_holder = document.querySelectorAll(' #logs-view .logs')[0];
                        var new_log_list_container = document.createElement("div");
                        new_log_list_container.setAttribute("id", "log-list-container");
                        
                        logs_view.append(new_log_list_container);
                        
                        //document.body.insertBefore(new_log_list_container, log_holder);
                        //var myEleValue= myEle.value;
                        log_list_container = document.getElementById("log-list-container");
                    }

                    console.log("log_list_container is now:");
                    console.log(log_list_container);

					// Clear the log list
					log_list_container.innerHTML = "";


                    // Create checkbox list
                    let ul = document.createElement('ul');
                    ul.setAttribute("id", "log-list-ul");


                    log_names.forEach(function (log_name) {
                        console.log(log_name);
                        let li = document.createElement('li');

                        //li.innerHTML += log_name;

                        var input = document.createElement("input");
                                        //input.type = "checkbox";
                                        input.setAttribute('type', 'checkbox');
                                        input.setAttribute('name', log_name);
                                        input.setAttribute('id', log_name);
                                        input.setAttribute('id', log_name);
                                        //input.value = log_name;
                        
                        var label = document.createElement("label");
                                        label.setAttribute("for",log_name);
										
						var span = document.createElement("span");
										span.innerHTML = log_name;

                        label.appendChild(input);
						label.appendChild(span);
                        li.appendChild(label);
						
				  	    li.onclick = function(element_name){
				  		    console.log("Logs list item clicked");

							// get list of all log names
							const all_log_name_elements = document.querySelectorAll('#logs-view .logs-log-name');
			                var all_log_names = [];
			                for (const log_name_element of all_log_name_elements) {
			                    all_log_names.push(log_name_element.innerHTML);
								console.log(log_name_element);
								console.log(log_name_element.innerHTML);
			                }
							console.log("all log item names = " + all_log_names);
							
							// get list of selected log names
			                const selected_logs = document.querySelectorAll(' #logs-view #log-list-ul input:checked');
			                var selected_log_names = [];
			                for (const selected_log of selected_logs) {
			                    selected_log_names.push(selected_log.name);
								console.log(selected_log);
			                }
			                console.log("selected log item names = " + selected_log_names);
							
							
							
							const all_logs = document.querySelectorAll(' #logs-view .logs-log-container');
							
							var log_counter = 0;
							for (const log_container of all_logs) {

								
								// If the current corresponding name is in the selected arrays name
								
								
								if( selected_log_names.indexOf(all_log_names[log_counter]) > -1 ){
									console.log("do not hide " + all_log_names[log_counter]);
									log_container.style.display = 'block';
								}
								else{
									console.log("hiding log container: " + all_log_names[log_counter]);
									log_container.style.display = 'none';
								}
								log_counter++;
							}
							
							
							
				  	  	}
						
                        ul.appendChild(li);

                    });

                    log_list_container.appendChild(ul);
                    
                }


                
            }
        };
	  
        window.onpopstate = function(event) {
            console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
        };
        
        window.addEventListener('popstate', (event) => {
	       console.log("new location: " + document.location + ", state: " + JSON.stringify(event.state));
        });
	  
	  console.log(this);
    }

    mutationCallback(mutations) {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          this.addParts();
          this.addThermostatButtons();
        }
      }
    }

    updateInputValue(id, adjustment) {
      const target = document.getElementById(id);
      const value = Number(target.value);
      target.value = value + adjustment;
      target.dispatchEvent(new Event('change'));
    }

    addParts() {
      const items = [
        '#things:not(.single-thing) > .thing > *:not(a):not(span):not(.component)',
        '#things:not(.single-thing) > .thing > *:not(div):not(.component)',
        '#things.single-thing > .thing > *:not(div)',
        '#things.single-thing > .thing > div.thing-detail-container > *:not(.component)',
      ].join(', ');
      const listItems = document.querySelectorAll(items);

      for (const item of listItems) {
        if (item.shadowRoot){
          item.classList.add('component');
          this.updateStyle(item);
        }
      }
    }
	
	addLogSelector() {
		console.log("In add log selector function");
		const listItems = document.querySelectorAll(' #logs-view .logs-log-name');
        var log_names = [];
		for (const item of listItems) {
			log_names.push(item.innerHTML);
        }
		console.log("log item names = " + log_names);
		
		// If the log list container does not exist, create it.
	    var log_list_container = document.getElementById("log-list-container");
		if(!log_list_container){
			const log_holder = document.querySelectorAll(' #logs-view .logs')[0];
			var new_log_list_container = document.createElement("div");
			new_log_list_container.setAttribute("id", "log-list-container");
			document.body.insertBefore(new_lost_list_container, log_holder);
			log_list_container = document.getElementById("log-list-container");
		}
		
		console.log("log_list_container is now:");
		console.log(log_list_container);
		
		
		
		// Create checkbox list
		ul = document.createElement('ul');
		ul.setAttribute("id", "log-list-ul");
		
		
		log_names.forEach(function (log_name) {
			console.log(log_name);
		    let li = document.createElement('li');
		    

		    //li.innerHTML += log_name;
			
			var input = document.createElement("input");
			                input.type = "checkbox";
			                input.name = "log-selector";
							input.value = log_name;
							
			li.appendChild(input);
			ul.appendChild(li);
			
		});
		
		log_list_container.appendChild(ul);

	}


    updateStyle(elem) {
      const shadow = elem.shadowRoot;
      const items = shadow.querySelectorAll('*');

      for (const item of items) {
        let part = item.getAttribute('id');
        if (part !== null) {
          if (part .indexOf('-') != -1) {
            part = part.substr(0, part.indexOf('-')); 
          }

          item.setAttribute('part', part);
        }
      }
    }
    
    addThermostatButtons() {
      const thermostats = document.getElementsByTagName(
        'webthing-target-temperature-property'
      );

      for (const thermostat of thermostats) {
        if (!thermostat.classList.contains('extra-thermostat-buttons')) {
          thermostat.classList.add('extra-thermostat-buttons');

          const down = document.createElement('div');
          down.id = 'down';
					down.setAttribute("part", "down"); 
					down.innerHTML = '-';
          down.addEventListener('click', () => {
            this.updateInputValue(thermostat.id, -1);
          });

          const up = document.createElement('div');
          up.id = 'up';
					up.setAttribute("part", "up"); 
					up.innerHTML = '+';
          up.addEventListener('click', () => {
            this.updateInputValue(thermostat.id, 1);
          });

          const el = document.createElement('div');
					el.setAttribute("part", "extra-thermostat-buttons"); 
          el.id = 'extra-thermostat-buttons';
          el.appendChild(down);
          el.appendChild(up);

          const shadow = thermostat.shadowRoot;
          const referenceNode = shadow.querySelector(
            '.webthing-number-property-contents'
          );
          referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
        }
      }
    }
  }

	//var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

	//if (isChrome) {
  	new SquareTheme();
	//}
})();
 
