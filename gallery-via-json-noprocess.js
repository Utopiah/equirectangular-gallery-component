AFRAME.registerComponent('gallery-via-json', {
	schema: {
	    thumbWidth: {type: 'number', default: 100},
	    thumbHeight: {type: 'number', default: 80},
	    borderColor: {type: 'string', default: '#fff'},
	    activeColor: {type: 'string', default: '#fff'},
	    backgroundColor: {type: 'string', default: 'transparent'},
	},
  init: function () {

  	var data = this.data;
	// Create our stylesheet
	var style = document.createElement('style');
	style.innerHTML =
	  '.gallery {' +
		'background: ' + data.backgroundColor + ';' +
	  	'margin: auto;' + 
	  	'text-align: center;' + 
	  	'position: absolute;' +
	  	'bottom: 0px;' +
	  	'width: 100%;' +
	  	'padding: 5px 0;' +
	  '}' +
	  '.scrolling { ' +
	  	'overflow-x: scroll;' +
	  	'overflow-y: hidden;' +
	  	'height: ' + (data.thumbHeight+12) + 'px;' +
	  	'white-space:nowrap' +
	  '} ' +
	  '.scrolling .thumb img { ' +  
	    'height: 100%; ' +
	    'min-width: 100%; ' +
	    'top: 50%; ' +
	    'left: 50%; ' +
	    'position: absolute; ' +
	    'transform: translate(-50%,-50%); ' +
	  '} ' +
		'.scrolling .thumb { ' +
	    'width: ' + data.thumbWidth + 'px; ' +
	    'height: ' + data.thumbHeight + 'px; ' +
	    'overflow: hidden; ' +
	    'position: relative; ' +    
	    'margin: 5px; ' +
	    'border: 1px solid ' + data.borderColor + ';' +
	    'box-shadow: 1px 1px 5px rgba(0,0,0,0.5); ' +
	    'opacity: 0.7;' +
	    'max-height: ' + data.thumbHeight + 'px; ' +
	    'cursor: pointer;' +
	    'display:inline-block;' +
	    '*display:inline;' +
	    '*zoom:1;' +
	    'vertical-align:top;' +
	  '}' +
	  '.scrolling .thumb:hover {' +
	  	'box-shadow: 1px 1px 10px rgba(0,0,0,0.25);' +
	  	'opacity: 1;' +
	  	'transform: scale(1.1);' +
	  '}' +
	  '.scrolling .thumb.active {' +
	    'border: 1px solid ' + data.activeColor + ';' +
	  	'box-shadow: 1px 1px 10px rgba(0,0,0,0.25);' +
	  	'opacity: 1;' +
	  	'transform: scale(1.1);' +
	  '}';

	// Get the first script tag
	var ref = document.querySelector('script');

	// Insert our new styles before the first script tag
	ref.parentNode.insertBefore(style, ref);

	var i = 0;
	if(window.location.hash) {
		i = Number( window.location.hash.replace("#image","") );
	}
	var el = this.el;
	var files;
	var timer;
	var thumb = "";

	var enablePreview = AFRAME.utils.getUrlParameter('enable-preview');
	var preventTimer = AFRAME.utils.getUrlParameter('disable-timer');

	var url = AFRAME.utils.getUrlParameter('json-file');
	if (!url){
		var msg = "Error: Specify json-file parameter in URL!";
		var errorMsg = document.createElement("a-entity");
		errorMsg.setAttribute("text", "value", msg);
		errorMsg.setAttribute("position", "0.2 0 -0.5");
		errorMsg.setAttribute("text", "color", "red");
		setTimeout( () => { AFRAME.scenes[0].camera.el.appendChild(errorMsg); }, 1000)
		console.error(msg);
		return;
	}

	function setupPreviews(){
		var gallery = document.createElement("div")
		gallery.classList.add("gallery");
		document.body.appendChild(gallery)
		var previews = document.createElement("div")
		previews.classList.add("scrolling");
		gallery.appendChild(previews)

		/* for now delegated to css stylesheet

		previews.style.position = "absolute";
		previews.style.bottom = "0px";
		previews.style.left = "0px";
		previews.style.height = "100px";
		//previews.style.width = files.length * 110 + "px";
		previews.style.overflowX = "auto";
		previews.style.whiteSpace = "nowrap";
		//previews.style.width = "100%";
		//previews.style.overflowX = "scroll";
		//previews.style.overflowY = "hidden";
		*/

		for (var imageIdx in files){
			var file = files[imageIdx];
			var imageEl = document.createElement("img");
			imageEl.src = path+thumb+file;
			imageEl.setAttribute("fullpath", path+file);
			imageEl.setAttribute("index", imageIdx);
			imageEl.classList.add("thumb");
			imageEl.onclick = function(){
				i = this.getAttribute("index");
				updateSky();
			}
			previews.appendChild(imageEl);

			/* for now delegated to css stylesheet
			imageEl.style.margin = "5px";
			imageEl.style.width = "100px";
			imageEl.onmouseover = function(){
				this.style.boxShadow = "5px 5px";
			}
			imageEl.onmouseleave = function(){
				this.style.boxShadow = "";
			}
			*/
		}
	}

	function setupPreview(){
		var preview = document.createElement("a-image");
		preview.setAttribute("position", "1 0 -2");
		preview.setAttribute("rotation", "0 -30 0");
		preview.setAttribute("id", "preview");
		preview.setAttribute("visible", false);
		preview.setAttribute("src", path+thumb+files[(i+1)]);
		setTimeout( () => { AFRAME.scenes[0].camera.el.appendChild(preview); }, 1000)
	}

	function updateSky(){
		document.querySelectorAll(".scrolling img").forEach( (e) => e.classList.remove("active") )
		window.location = "#image" + i;
		el.setAttribute("src", path+files[i]);
		var previewEl = document.querySelector('.scrolling img[index="'+i+'"]') 
		if (previewEl) previewEl.style.opacity = 0.7;
		el.classList.add("active");
	}

	var instructions = document.createElement("a-entity");
	instructions.setAttribute("text", "value", "<- previous, next ->, ^ first, v last\nSPACE pause/start\n? help");
	instructions.setAttribute("position", "0.2 0 -0.3");
	if (AFRAME.utils.device.isMobile ()) {
		instructions.setAttribute("text", "value", "Diaporama starting...");
		instructions.setAttribute("position", "0.2 0 -1");
	}
	instructions.setAttribute("id", "instructions");
	setTimeout( () => { AFRAME.scenes[0].camera.el.appendChild(instructions); }, 1000)

	var message = document.createElement("a-entity");
	message.setAttribute("text", "value", "");
	message.setAttribute("position", "0.2 0 -0.5");
	message.setAttribute("id", "message");
	message.setAttribute("visible", "false");
	message.setAttribute("text", "opacity", "0.6");
	setTimeout( () => { AFRAME.scenes[0].camera.el.appendChild(message); }, 1000)

	var path = url.replace(/[a-zA-Z]*.json/,'');
	var interval = Number( AFRAME.utils.getUrlParameter('interval') );
	if (interval < 1) interval = 5;

	myFetch(url).then( (r)=>{ displayGallery(r) } )

	function displayGallery(json){
		files = json;
		updateSky();
		if (!preventTimer) 
			timer = startTimer();
		if (enablePreview)
			setupPreview();
		setupPreviews();
	}

	function startTimer(){
		return setInterval( () => {
			document.querySelector("#instructions").setAttribute("visible", false);
			i++;
			if (i > files.length-1) i = 0;
			updateSky();
			if (enablePreview) setTimeout( () => { 
				document.querySelector("#preview").setAttribute("visible", true);
				document.querySelector("#preview").setAttribute("src", path+thumb+files[(i+1)]);
				setTimeout( () => { 
					document.querySelector("#preview").setAttribute("visible", false);
				}, 2000);
			 }, interval * 1000 - (interval * 1000 / 5) )
		}, interval * 1000)
	}

	function showTemporaryMessage(text){
		document.querySelector("#message").setAttribute("visible", true);
		document.querySelector("#message").setAttribute("text", "value", text);
		setTimeout( () => { 
			document.querySelector("#message").setAttribute("visible", false);
			// could also do an animation
		}, 1000)
	}

	document.onkeydown = checkKey;
	function checkKey(e) {
	    e = e || window.event;
	    //console.log('key:' + e.key + '.')
	    document.querySelector("#instructions").setAttribute("visible", false);
		switch (e.key){
			case ' ':
				if (!timer){
					timer = startTimer();
					showTemporaryMessage("Restarting diaoporama\n(" + interval + "s interval)" );
				} else {
					showTemporaryMessage("Paused diaoporama");
					clearInterval(timer);
					timer = 0;
				}
			break;
			case '?':
				document.querySelector("#instructions").setAttribute("visible", "true");
			break;
			case 'ArrowUp':
				showTemporaryMessage("Going to the beginning");
				i = 0;
				updateSky();
			break;
			case 'ArrowDown':
				showTemporaryMessage("Going to the end");
				i = files.length-1;
				updateSky();
			break;
			case 'ArrowLeft':
				showTemporaryMessage("Previous image");
				i--;
				if (i<0) i=files.length-1;
				updateSky();
			break;
			case 'ArrowRight':
				showTemporaryMessage("Next image");
				i++;
				if (i > files.length-1) i =0;
				updateSky();
			break;
		}
	}

	
	function myFetch(url) {
	  return new Promise((resolve, reject) => {
	    const xhr = new XMLHttpRequest();
	    xhr.open("GET", url);
	    xhr.responseType = 'json';
	    xhr.onload = () => resolve(xhr.response);
	    xhr.onerror = () => reject(xhr.statusText);
	    xhr.send();
	  });
	}

  }
});
