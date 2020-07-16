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
	  
	  
	  	// Check if logs button is clicked
	  	/*
		const logs_menu_item = document.getElementById('logs-menu-item');
		logs_menu_item.addEventListener('click', () => {
      		console.log(this);
      	});
	  	*/
	

		// Create log filter container
		var log_filter_container = document.getElementById("square-theme-log-filter-container");
		if(!log_filter_container){
			console.log("creating logs filter container");
			
			var new_log_filter_container = document.createElement("div");
			new_log_filter_container.setAttribute("id", "square-theme-log-filter-container");
			
			// Create log list toggle button
            let toggle = document.createElement('div');
            toggle.setAttribute("id", "square-theme-log-list-toggle");
			toggle.innerHTML = '<button id="square-theme-log-filter-button" class="icon-button" data-l10n-id="menu-button" aria-label="Log Filter"></button>';
			new_log_filter_container.append(toggle);
			
			// Create empty container that will hold the filter list
            var new_log_list_container = document.createElement("div");
            new_log_list_container.setAttribute("id", "square-theme-log-list-container");
			new_log_filter_container.append(new_log_list_container);
			
			const logs_view = document.getElementById("logs-view");
			console.log("appending to logs-view");
			logs_view.append(new_log_filter_container);
			
			log_filter_container = document.getElementById("square-theme-log-filter-container");
		}
		
		console.log("log_filter_container is now:");
		console.log(log_filter_container);
	
		//Check if log filter toggle button is clicked
		const log_filter_button = document.getElementById('square-theme-log-filter-button');
      	log_filter_button.addEventListener('click', () => {
      		console.log(this);
			//this.updateInputValue(thermostat.id, -1);
			const list = document.getElementById('square-theme-log-list-ul');
			if(!list){
				this.addLogSelector();
			}
			else{
				list.parentNode.removeChild(list);
			}
      	});

	  
	  // Console.log(this);
	  var url = window.location.href;
	  var lastPart = url.substr(url.lastIndexOf('/') + 1);
	  if (lastPart === "logs") {
		  console.log("We started on the logs page");
		  //history.pushState();
		  
	  }
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
        
        const listItems = document.querySelectorAll(' #logs-view .logs-log-name');
        var log_names = [];
        for (const item of listItems) {
            log_names.push(item.innerHTML);
        }
        console.log("log item names = " + log_names);
        //if(log_names.length > 2 ){
            
            const logs_view = document.getElementById("logs-view");
            logs_view.classList.add('long-list');

            

			// Clear the log list
			const log_list_container = document.getElementById("square-theme-log-list-container");
			
			log_list_container.innerHTML = "";

            // Create checkbox list
            let ul = document.createElement('ul');
            ul.setAttribute("id", "square-theme-log-list-ul");


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
		            //console.log(element_name);
					//console.log(element_name.target.name);
		  		  	//addLogSelector();
					
					
					/*
					var values = [];
					var cbs = document.forms['test'].elements['colors'];
					for(var i=0,cbLen=cbs.length;i<cbLen;i++){
					  if(cbs[i].checked){
					    values.push(cbs[i].value);
					  } 
					}
					alert('You selected: ' + values.join(', '));
					*/
					

					
					/*
					[].forEach.call(document.querySelectorAll('.logs-log-container'), function (el) {
						console.log
						el.style.visibility = 'hidden';
					});
					*/
					
					
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
	                const selected_logs = document.querySelectorAll(' #logs-view #square-theme-log-list-ul input:checked');
	                var selected_log_names = [];
	                for (const selected_log of selected_logs) {
	                    selected_log_names.push(selected_log.name);
						console.log(selected_log);
	                }
	                console.log("selected log item names = " + selected_log_names);
					
					
					

					
	                //const all_names = document.querySelectorAll(' #logs-view .logs-log-name');
	                
					/*
					var all_log_names = [];
	                for (const item of all_names) {
						
						if( all_names.indexOf(item.innerHTML) > -1 ){
							
						}
						else{
							
						}
						
	                    log_names.push(item.innerHTML);
	                }
					*/
					
					
					const all_logs = document.querySelectorAll(' #logs-view .logs-log-container');
					
					var log_counter = 0;
					for (const log_container of all_logs) {

						
						// If the current corresponding name is in the selected arrays name
						
						
						if( selected_log_names.indexOf(all_log_names[log_counter]) > -1 || selected_log_names.length == 0 ){
							console.log("do not hide " + all_log_names[log_counter]);
							//log_container.style.visibility = 'visible';
							log_container.style.display = 'block';
						}
						else{
							console.log("hiding log container: " + all_log_names[log_counter]);
							//console.log(log_container);
							//log_container.style.visibility = 'hidden';
							log_container.style.display = 'none';
						}
						log_counter++;
					}
					
					
					
		  	  	}
				
                ul.appendChild(li);

            });

            log_list_container.appendChild(ul);	
			
		//}
		
	}

	/*
	showLogs(){
		var values = [];
		var cbs = document.forms['test'].elements['colors'];
		for(var i=0,cbLen=cbs.length;i<cbLen;i++){
		  if(cbs[i].checked){
		    values.push(cbs[i].value);
		  } 
		}
		alert('You selected: ' + values.join(', '));
	}
	*/

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
 