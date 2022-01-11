(function() {
  class SquareTheme extends window.Extension {
    constructor() {
      super('square-theme');
      this.observer = new MutationObserver(this.mutationCallback.bind(this));
      this.observer.observe(
        document.getElementById('things'),
        {childList: true}
      );
      
      this.message_area_observer = new MutationObserver(this.messageAreaCallback.bind(this));
      this.message_area_observer.observe(
        document.getElementById('message-area'),
        {childList: true}
      );
            
      // apply the theme after loading
      this.addParts();
      this.addThermostatButtons();
      this.addThingsSearch();
	  
      
      document.addEventListener('keydown', function(event){
          if(document.location.href.endsWith("/things") && document.getElementById('add-thing-screen').classList.contains('hidden')){
              document.getElementById('square-theme-things-search-input').focus();
          }
          
      });
      
      //localStorage.setItem("square_theme_log_collections", JSON.stringify({}));
      

      /*
      // Listen for changes in dropdowns
      const message_area = document.getElementById('message-area');
      console.log(message_area);
      message_area.addEventListener("DOMCharacterDataModified", function (event) {
      //message_area.addEventListener('change', function(event) {
          console.log(event);
          console.log("message changed to: " + message_area.innerText);
          message_area.innertext = message_area.innerText + " ola";
      }, false);
      
      var mutato = new MutationObserver(function (e) {
        if (e[0].removedNodes) console.log(1);
      });

      mutato.observe(document.getElementById('parent'), { childList: true });
      

      this.observer.observe(
        document.getElementById('message-area'),
        {childList: false}
      );
      */



		// Create log filter container
		var log_filter_container = document.getElementById("square-theme-log-filter-container");
		if(!log_filter_container){
			//console.log("creating logs filter container");
            
			const logs_view = document.getElementById("logs-view");
            
			var new_log_filter_container = document.createElement("div");
			new_log_filter_container.setAttribute("id", "square-theme-log-filter-container");
            new_log_filter_container.setAttribute("class", "square-theme-log-filter-container-hidden");
			
			// Create log list toggle button
            let toggle = document.createElement('div');
            toggle.setAttribute("id", "square-theme-log-list-toggle");
			toggle.innerHTML = '<button id="square-theme-log-filter-button" class="icon-button" data-l10n-id="menu-button" aria-label="Log Filter"></button>';
			//new_log_filter_container.append(toggle);
			logs_view.append(toggle);
            
			// Create empty container that will hold the collections
            var new_collections_container = document.createElement("div");
            new_collections_container.setAttribute("id", "square-theme-log-collections-container");
			new_log_filter_container.append(new_collections_container);
            
			// Create empty container that will hold the filter list
            var new_log_list_container = document.createElement("div");
            new_log_list_container.setAttribute("id", "square-theme-log-list-container");
			new_log_filter_container.append(new_log_list_container);
			
			
			//console.log("appending to logs-view");
			logs_view.append(new_log_filter_container);
			
            
			log_filter_container = document.getElementById("square-theme-log-filter-container");
            
            this.showLogCollections(); // adds the collection buttons at the top
			
            
            window.setTimeout(() => {
                this.addLogSelector(); // adds the checkbox list
            }, 2000);
            
		}
		
		//console.log("log_filter_container is now:");
		//console.log(log_filter_container);
	
		//Check if log filter toggle button is clicked
		const log_filter_button = document.getElementById('square-theme-log-filter-button');
      	log_filter_button.addEventListener('click', () => {
      		//console.log("clicked on log filter toggle button. This:", this);
			//this.updateInputValue(thermostat.id, -1);
            //const log_filter_container document.getElementById('square-theme-log-filter-container');
            
	        if (log_filter_container.classList.contains('square-theme-log-filter-container-hidden')) {
				log_filter_container.classList.remove('square-theme-log-filter-container-hidden');
		  	}
			else{
				log_filter_container.classList.add('square-theme-log-filter-container-hidden');
                
			}
            
			const list = document.getElementById('square-theme-log-list-ul');
			//const buttons = document.getElementById('square-theme-log-list-buttons');
			if(typeof list != 'undefined'){
                if(list.querySelectorAll("li").length == 0){
                    //console.log("there were no checkboxes yet");
                    //this.showLogCollections(); // adds the collection buttons at the top
    				this.addLogSelector(); // adds the checkbox list
    			}
			}
            
            
            /*

			else{
                this.hideLogMenu();
			}
            
            new_log_filter_container.setAttribute("class", "square-theme-log-filter-container-hidden");
            */
      	});

	  
  	  // Console.log(this);
  	  /*
  	  var url = window.location.href;
  	  var lastPart = url.substr(url.lastIndexOf('/') + 1);
  	  if (lastPart === "logs") {
  		  //console.log("We started on the logs page");
  		  //history.pushState();
		  
  	  }
  	  */
      
        
        /*
        if (localStorage.getItem("square_theme_log_collections") !== null) {
            console.log("localStorage had log collection data:", localStorage.getItem("square_theme_log_collections") );
        }
        else{
            console.log("localStorage did not have log collection data");
        }
        */
        
        
    }

    mutationCallback(mutations) {
        console.log("new mutations:", mutations);
        var should_upgrade = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                should_upgrade = true
                //this.addParts();
                //this.addThermostatButtons();
            }
        }
      console.log("mutations, should_upgrade = " + should_upgrade);
      if(should_upgrade){
          //console.log("should add parts and thermostat buttons");
          this.addParts();
          this.addThermostatButtons();
      }
      
      if(document.location.href.endsWith("/things")){
          document.getElementById('square-theme-things-search-container').style.display = 'block';
      }else{
          document.getElementById('square-theme-things-search-container').style.display = 'none';
          document.getElementById('square-theme-things-search-input').value = '';
      }
    }
    
    messageAreaCallback(mutations) {        
        
        function upgrade(){
            //setTimeout(function(){ 
            window.setTimeout(() => { 
                const message_array = document.getElementById('message-area').innerText.split(":", 3);
                //console.log(message_array);
                if(message_array.length > 2){
                    var upgraded_message = '<span class="square-theme-message-addon">' + message_array[0] + '</span>';
                    upgraded_message += '<span class="square-theme-message-device">' + message_array[1] + '</span>';
                    upgraded_message += '<span class="square-theme-message-message">' + message_array[2] + '</span>';
                    //console.log(upgraded_message);
                    document.getElementById('message-area').innerHTML = upgraded_message;
                }
            
            }, 10);
        }
        
        for (const mutation of mutations) {
            //console.log(mutation);
            if(mutation.removedNodes !== undefined){
                if (mutation.removedNodes.length == 1){
                    //console.log("removed 1 node");
                    upgrade();
                }
            }
            //if(mutation.hasOwnProperty(addedNodes)){
            if(mutation.addedNodes !== undefined){
                if (mutation.addedNodes.length == 1){
                    //console.log("added one node");
                    upgrade();
                }
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
      //console.log("listItems.length in addParts: " + listItems.length);
      if(listItems.length){
          //console.log("adding mutation indicator class");
          document.getElementById('things-view').classList.add("square-theme-things-mutated");
      }
    }

    
	
	addLogSelector() {
        
        const listItems = document.querySelectorAll(' #logs-view .logs-log-name');
        var log_names = [];
        for (const item of listItems) {
            //console.log(item.innerHTML);
            if(item.innerHTML != ""){
                log_names.push(item.innerHTML);
            }
            
        }
        
        const logs_view = document.getElementById("logs-view");

		// Clear the log list
		const log_list_container = document.getElementById("square-theme-log-list-container");
		
		log_list_container.innerHTML = "";

        // Create checkbox list
        let ul = document.createElement('ul');
        ul.setAttribute("id", "square-theme-log-list-ul");


        log_names.forEach( spaced_log_name => {
            
            
        //});

        //log_names.forEach(function (spaced_log_name) {
            const log_name = spaced_log_name.replace(/\s+/g, '-');
            //console.log("log_name = " + log_name);
            let li = document.createElement('li');

            //li.innerHTML += log_name;

            var input = document.createElement("input");
                //input.type = "checkbox";
                input.setAttribute('type', 'checkbox');
                input.setAttribute('name', log_name);
                input.setAttribute('id', log_name);
                //input.setAttribute('id', log_name);
                //input.value = log_name;
            
            var label = document.createElement("label");
                label.setAttribute("for",log_name);
							
			var span = document.createElement("span");
				span.innerHTML = spaced_log_name;

            label.appendChild(input);
			label.appendChild(span);
            li.appendChild(label);
			
	  	    li.onclick = (event) => {//function(element_name){
				console.log("filter item clicked");
                
                this.filterLogs();
				
	  	  	}
			
            ul.appendChild(li);

        });

        log_list_container.appendChild(ul);	
		
		
		let filter_buttons = document.createElement('div');
		filter_buttons.setAttribute("id", "square-theme-log-list-buttons");
		
        // Clear button
		let clear_button = document.createElement('button');
		clear_button.setAttribute("id", "square-theme-logs-clear-button");
        clear_button.setAttribute("class", "square-theme-logs-small-button");
		clear_button.textContent = "Clear";
		filter_buttons.appendChild(clear_button)
        
		// Overlay button
		let overlay_button = document.createElement('button');
		overlay_button.setAttribute("id", "square-theme-logs-overlay-button");
        overlay_button.setAttribute("class", "square-theme-logs-small-button");
		overlay_button.textContent = "Overlay";
		filter_buttons.appendChild(overlay_button)
        
        // Add collection button
		let collection_button = document.createElement('button');
		collection_button.setAttribute("id", "square-theme-logs-add-collection-button");
        collection_button.setAttribute("class", "square-theme-logs-small-button");
		collection_button.textContent = "Add collection";
		filter_buttons.appendChild(collection_button)
        

        
        
		log_list_container.appendChild(filter_buttons)
		
        
		document.getElementById("square-theme-logs-clear-button").onclick = (event) => {
  		    //console.log("Clear button clicked");
            this.addLogSelector();
            this.filterLogs();
		}
        
        
		document.getElementById("square-theme-logs-overlay-button").onclick = (event) => {
  		    //console.log("Overlay button clicked");
			
	        if (logs_view.classList.contains('square-theme-logs-overlay')) {
				logs_view.classList.remove('square-theme-logs-overlay');
		  	}
			else{
				logs_view.classList.add('square-theme-logs-overlay');
			}
		}

        
        if (localStorage.getItem("square_theme_log_collections") !== null) {
            this.showLogCollections();
        }
        
		document.getElementById("square-theme-logs-add-collection-button").onclick = (event) => {//.onclick = function(event){
  		    //console.log("Add collection button clicked");
            //console.log("event: ", event);
            //console.log("this:",this);
            
            this.addLogCollection();
            
            /*
            var log_collections = [];
            if (localStorage.getItem("square_theme_log_collections") !== null) {
                log_collections = JSON.parse( localStorage.getItem("square_theme_log_collections") );
            }
        
        
        
            let collection_name = prompt("What should this collection be called?");
        
            const selected_logs = document.querySelectorAll(' #logs-view #square-theme-log-list-ul input:checked');
            var selected_log_names = [];
            for (const selected_log of selected_logs) {
                selected_log_names.push(selected_log.name);
    			console.log(selected_log);
            }
        
            console.log("selected: ", selected_log_names);
            log_collections[collection_name] = selected_log_names; //.push({'name':collection_name,'logs':selected_log_names});
        
            localStorage.setItem("square_theme_log_collections", JSON.stringify(log_collections));
            */
            
            
		}
        
		
        //this.filterLogs(); // resets the filtered logs to no filter
        
	}


    filterLogs(){
		// get list of all log names
		const all_log_name_elements = document.querySelectorAll('#logs-view .logs-log-name');
        var all_log_names = [];
        for (const log_name_element of all_log_name_elements) {
            all_log_names.push(log_name_element.innerHTML.replace(/\s+/g, '-'));
			//console.log(log_name_element);
			//console.log(log_name_element.innerHTML);
        }
		//console.log("all log item names = " + all_log_names);
		
		// get list of selected log names
        const selected_logs = document.querySelectorAll(' #logs-view #square-theme-log-list-ul input:checked');
        var selected_log_names = [];
        for (const selected_log of selected_logs) {
            selected_log_names.push(selected_log.name);
			//console.log(selected_log);
        }
        //console.log("selected log item names = " + selected_log_names);
		
		const all_logs = document.querySelectorAll(' #logs-view .logs-log-container');
		//console.log(all_logs);
        
		var log_counter = 0;
		for (const log_container of all_logs) {
            //console.log("comparing:", log_container);
			//console.log("comparing to:", all_log_names[log_counter]);
			// If the current corresponding name is in the selected arrays name
			if( selected_log_names.indexOf(all_log_names[log_counter]) > -1 || selected_log_names.length == 0 ){
				//console.log("do not hide " + all_log_names[log_counter]);
				//log_container.style.visibility = 'visible';
				log_container.style.display = 'block';
			}
			else{
				//console.log("hiding log container: " + all_log_names[log_counter]);
				//console.log(log_container);
				//log_container.style.visibility = 'hidden';
				log_container.style.display = 'none';
			}
			log_counter++;
		}
    }

    
    addLogCollection(){
        //let self = this;
        var log_collections = {};
        if (localStorage.getItem("square_theme_log_collections") !== null) {
            log_collections = JSON.parse( localStorage.getItem("square_theme_log_collections") );
        }
        
        const selected_logs = document.querySelectorAll(' #logs-view #square-theme-log-list-ul input:checked');
        var selected_log_names = [];
        for (const selected_log of selected_logs) {
            selected_log_names.push(selected_log.name);
			//console.log(selected_log);
        }
        
        if( selected_logs.length > 0){
            
            let collection_name = prompt("What should this collection be called?");
        
            if(collection_name != ""){
                //console.log("collection_name = " + collection_name);
                //console.log("selected: ", selected_log_names);
                log_collections[collection_name] = selected_log_names; //.push({'name':collection_name,'logs':selected_log_names});
        
                localStorage.setItem("square_theme_log_collections", JSON.stringify(log_collections));
            }
            
        }
        
        
        this.showLogCollections();
		
    }


    // Creates collection buttons
    showLogCollections(){
        //console.log("in showLogCollections");
        
        var log_collections = {};
        if (localStorage.getItem("square_theme_log_collections") !== null) {
            //console.log("localStorage had log collection data:", localStorage.getItem("square_theme_log_collections") );
            log_collections = JSON.parse( localStorage.getItem("square_theme_log_collections") );
        }
        else{
            //console.log("browser local storage had no collections");
            return;
        }
        
        
        
        const collection_names = Object.keys(log_collections);
        
        document.getElementById('square-theme-log-collections-container').innerHTML = "";
        
        collection_names.forEach((collection_name, index) => {
            //console.log(`${collection_name}: ${log_collections[collection_name]}`);
            
    		let new_collection_button = document.createElement('button');
    		new_collection_button.setAttribute("class", "square-theme-logs-collection-button square-theme-logs-small-button");
    		new_collection_button.textContent = collection_name;
            
            // on a click, set the checkboxes to the correct position
            new_collection_button.onclick = (event) => { //function(element_name){
                //console.log("collection button clicked", event.target.innerText);
                //console.log(this);
                //console.log("log_collections: ", log_collections);
                //console.log("log_collection: ", log_collections[event.target.innerText]);
                let should_check = log_collections[event.target.innerText];
                const log_checkboxes = document.querySelectorAll(' #logs-view #square-theme-log-list-ul input');

                for (const checkbox of log_checkboxes) {
                    
                    if(should_check.indexOf(checkbox.name) == -1){
                        //console.log("should not check");
                        checkbox.checked = false;
                    }
                    else{
                        //console.log("should check: " + checkbox.name);
                        checkbox.checked = true;
                    }
                }
                
                // finally, call filter logs with the new checkboxes settings
                this.filterLogs();
                
                // remove sidebar when collection button is clicked
                //this.hideLogMenu();
                //document.getElementById('square-theme-log-collections-container').innerHTML = "";
                document.getElementById('square-theme-log-filter-container').classList.add('square-theme-log-filter-container-hidden');
                
            };
            
            
    		let new_collection_delete_button = document.createElement('button');
    		new_collection_delete_button.setAttribute("class", "square-theme-logs-collection-delete-button square-theme-logs-small-button");
    		//new_collection_delete_button.textContent = "✖";
            new_collection_delete_button.innerHTML = '&#10006;';
            new_collection_delete_button.onclick = (event) => {
                //console.log(collection_name);
                //console.log(event);
                if(confirm('Are you sure you want to remove the "' + collection_name + '" collection?')){
                    let parent = event.target.parentElement;
                    parent.parentNode.removeChild(parent);
                
                    delete log_collections[collection_name];
                    localStorage.setItem("square_theme_log_collections", JSON.stringify(log_collections));
                }
                
            };
            
            
            let new_collection_button_container = document.createElement('div');
            new_collection_button_container.setAttribute("class", "square-theme-logs-collection-button-container");
            
            new_collection_button_container.appendChild(new_collection_button);
            new_collection_button_container.appendChild(new_collection_delete_button);
            
    		document.getElementById('square-theme-log-collections-container').appendChild(new_collection_button_container);
            
        });
    }


    hideLogMenu(){
        //console.log("in hideLogMenu");
		const list = document.getElementById('square-theme-log-list-ul');
		const buttons = document.getElementById('square-theme-log-list-buttons');
        
		list.parentNode.removeChild(list);
		buttons.parentNode.removeChild(buttons);
        //let collection_button_container = document.getElementById('square-theme-log-collections-container');
        //collection_button_container.parentNode.removeChild(collection_button_container);
        document.getElementById('square-theme-log-collections-container').innerHTML = "";
        //document.getElementById('logs-view').classList.remove('square-theme-logs-overlay');
    }



    // Add 'part' attribute to elements in the shadow doms so that they may be targetted with CSS
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
      
      // if using the ID didn't add a part attribute, try again, but this time with class.
      for (const item of items) {
        let part = item.getAttribute('class');
        if (part !== null) {
          if(!item.hasAttribute("part")){
              if (part .indexOf(' ') != -1) {
    			  part = part.substr(0, part.indexOf(' '));
              }
              item.setAttribute('part', part);
          }
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
            this.updateInputValue(thermostat.id, -.5);
          });

          const up = document.createElement('div');
          up.id = 'up';
					up.setAttribute("part", "up"); 
					up.innerHTML = '+';
          up.addEventListener('click', () => {
            this.updateInputValue(thermostat.id, .5);
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
    
    
    addThingsSearch() {
        const thing_view = document.getElementById("things-view");
        const things = document.getElementById("things");
        const things_count = things.children.length;
        
		if(things_count > 10){
            // Create checkbox list
            let search_container = document.createElement('div');
            search_container.setAttribute("id", "square-theme-things-search-container");
            let search_input = document.createElement('input');
            search_input.setAttribute("id", "square-theme-things-search-input");
            search_input.setAttribute("type", "search");
            search_input.setAttribute("name", "square-theme-search-input");
            search_input.setAttribute("placeholder", "search");
        
            search_container.appendChild(search_input);
            thing_view.appendChild(search_container);
        
            const search_input_element = document.getElementById("square-theme-things-search-input");
            search_input_element.onkeyup = function(element_name){
                
                var search_string = search_input_element.value.toLowerCase();
                //console.log("onkeyup search_string = " + search_string);
                
                if(search_string.length > 0){
                    
                    for (var i = 0; i < things_count; i++) {
                          var child = things.childNodes[i];
                          child.style.display = "none";
                    }
                    for (var i = 0; i < things_count; i++) {
                        const child = things.childNodes[i];
                        
                        var thing_title = child.getElementsByClassName('thing-title')[0].innerHTML;
                        thing_title = thing_title.toLowerCase();
                        
                        if(thing_title.indexOf(search_string) !== -1){
                            child.style.display = "block";
                        }
                        
                    }
                    
                }
                else{
                    for (var i = 0; i < things_count; i++) {
                          things.childNodes[i].style.display = "block";
                    }
                }
                
            }
            
            search_input_element.onsearch = function(element_name){
                
                var search_string = search_input_element.value.toLowerCase();
                //console.log("onsearch search_string = " + search_string);
                
                if(search_string.length > 2){
                    
                    for (var i = 0; i < things_count; i++) {
                          var child = things.childNodes[i];
                          child.style.display = "none";
                    }
                    for (var i = 0; i < things_count; i++) {
                        const child = things.childNodes[i];
                        
                        var thing_title = child.getElementsByClassName('thing-title')[0].innerHTML;
                        thing_title = thing_title.toLowerCase();
                        
                        if(thing_title.indexOf(search_string) !== -1){
                            child.style.display = "block";
                        }
                        
                    }
                    
                }
                else{
                    for (var i = 0; i < things_count; i++) {
                          things.childNodes[i].style.display = "block";
                    }
                }
                
            }
            
        }
    }
    
    
    
  }

  new SquareTheme();

})();
 