// when page loads update active page in the navbar 
window.onload = activePage;

function activePage() {
	var title = document.getElementsByTagName("title")[0];
	title = title.innerHTML;

	// Set the underlines correctly
	if (title == "Home") {
		document.getElementById("nav-home").classList.add("active");
	} else if (title == "About Me") {
		document.getElementById("nav-about").classList.add("active");
	}

	// Scroll to top of page on reload
	if ('scrollRestoration' in window.history) {
  	window.history.scrollRestoration = 'manual'
	}
	window.scrollTo(0, 0);
}

// When the user clicks on the types of projects, toggle between hiding and showing the dropdown content 
function onClickType(src, type) {
	document.getElementById("dropdownContent" + type).classList.toggle("show");
}

// When the user clicks on the button, toggle between hiding and showing the dropdown content 
function onClickMenu(src) {
	document.getElementById("menuDropdownContent").classList.toggle("show");

  var path = new URL(src);

  // check that the pathname ends with each image
	if (path.pathname.endsWith("/navbar-icon/icon-blue.png")) {
		document.getElementById("nav-icon").src = "./img/navbar-icon/icon-cross-blue.png";

	} else if (path.pathname.endsWith("/navbar-icon/icon-cross-blue.png")) {
		document.getElementById("nav-icon").src = "./img/navbar-icon/icon-blue.png";

	} else if (path.pathname.endsWith("/navbar-icon/icon-white.png")) {
		document.getElementById("nav-icon").src = "./img/navbar-icon/icon-cross-white.png";

	} else if (path.pathname.endsWith("/navbar-icon/icon-cross-white.png")) {
		document.getElementById("nav-icon").src = "./img/navbar-icon/icon-white.png";
	}
}

function mouseOnMenu(src) {
	var path = new URL(src);

	if (path.pathname.endsWith("/img/navbar-icon/icon-white.png")) {
		document.getElementById("nav-icon").src = "./img/navbar-icon/icon-blue.png";

	} else if (path.pathname.endsWith("/img/navbar-icon/icon-cross-white.png")) {
		document.getElementById("nav-icon").src = "./img/navbar-icon/icon-cross-blue.png";
	}
}

function mouseOffMenu(src) {
	var path = new URL(src);

	if (path.pathname.endsWith("/img/navbar-icon/icon-blue.png")) {
		document.getElementById("nav-icon").src = "./img/navbar-icon/icon-white.png";

	} else if (path.pathname.endsWith("/img/navbar-icon/icon-cross-blue.png")) {
		document.getElementById("nav-icon").src = "./img/navbar-icon/icon-cross-white.png";
	}
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
	// Get array of all dropdown contents
	var dropdowns = document.getElementsByClassName("dropdown-content");
  var i;
  for (i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    // check if the dropdown is showing
    if (openDropdown.classList.contains('show')) {
    	// Check that the element clicked isnt the text/img for the dropdown
    	if (!event.target.matches('#' + openDropdown.parentNode.children[0].id)) {
      	// Close the dropdown
      	openDropdown.classList.remove('show');
      	// Reset menu icon
      	var path = new URL(document.getElementById("nav-icon").src);
		  	if (path.pathname.endsWith("/img/navbar-icon/icon-cross-white.png")) {
					document.getElementById("nav-icon").src = "./img/navbar-icon/icon-white.png";
				}
      }
    }
  }
}