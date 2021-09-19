<?php

	// Returns the filename for the page, spaces are replaced with -
	function getPageFileName($title) {
		return str_replace(" ", "-", strtolower($title)) . ".html";
	}

	// Creates the home page's html file
	function buildHomePage($path, $pages, $pageTypesAndTitles) {
		echo "Building Home Page...\n";
		if (file_exists("./home.html")) {
			unlink("{$path}/home.html");
		}
		// Setup HTML file contents
		$pageContent = "<!DOCTYPE html>\n<html lang='en'>\n\t<head>\n\t\t<meta charset='utf-8'>\n";
		// Write the title to HTML
		$pageContent .= "\t\t<title>Home</title>\n";
		// Link the stylesheets
		$pageContent .= "\t\t<link rel='stylesheet' href='css/style.css'>\n";
		// add the navbar
		$pageContent .= buildNavbar($pageTypesAndTitles);
		// Close the head tag, create the body tag
		$pageContent .= "\t</head>\n\t<body>\n";
		$pageContent .= "\t\t<div class='background'></div>\n";
		$pageContent .= "\t\t<div class='body-content'>\n";
		// Add the header and heading page separator
		$pageContent .= "\t\t\t<h1>Jon Allen</h1>\n\t\t\t".buildSectionSeparator();
		// Add the home page intro
		$pageContent .= "\t\t\t<p class='intro'>This is a website for me to write about various projects, mostly personal and other things that I find interesting and want to write about. This website was originally made using the Jekyll framework and then rewritten using a custom PHP website builder that I wrote. If you're interested about how I have written the website, check it out on GitHub <a href='https://github.com/Hamsterdam117/Hamsterdam117.github.io'>here</a>.</p>\n";
		// Add the home page content (page display sections)
		foreach ($pages as $page) {
			if ($page["type"] != "none") {
				$pageContent .= "\t\t\t<div class='new-post'>\n\t\t\t\t".buildSectionSeparator('home');
				$pageContent .= "\t\t\t\t<table id='post-table'>\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td class='image-container'><img src='./img/home-images/".$page["display_image"]."' alt='".$page["title_short"]."' /></td>\n";
				// Format date
				$date = "";
				if ($page["start_date"] == $page["end_date"]) {
					$date = $page["start_date"];
				} else if (substr($page["start_date"], -4) == substr($page["end_date"], -4)) {
					$date = substr($page["start_date"], 0, 3) . " - " . $page["end_date"];
				} else {
					$date = $page["start_date"] . " - " . $page["end_date"];
				}
				// Check for date length
				if ((strlen($page["title"]) + strlen($date)) > 30) {
					$titleAndDate = "<h3 style='margin-bottom:0;'>".$page["title"]."</h3>\n\t\t\t\t\t\t\t<h3 style='margin-top:0;'><span class='post-date'>{$date}</span></h3>";
				} else {
					$titleAndDate = "<h3>".$page["title"]."<span class='post-date'>{$date}</span></h3>";
				}
				$pageContent .= "\t\t\t\t\t\t<td>\n\t\t\t\t\t\t\t".$titleAndDate."\n";
				$pageContent .= "\t\t\t\t\t\t\t<p>".$page["display_description"]."</p>\n";
				$pageContent .= "\t\t\t\t\t\t\t<p class='link'><a href='./".getPageFileName($page["title_short"])."'>Read More</a></p>\n";
				$pageContent .= "\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</table>\n\t\t\t</div>\n";
			}
		}
		// Close the body tag, create the footer, and close html tag
		$pageContent .= "\t\t</div>\n\t</body>\n".buildFooter()."</html>";

		//Write to file
		$pageFile = fopen("{$path}/home.html", "w");
		fwrite($pageFile, $pageContent);
	}

	// Creates the page's html file
	function buildPage($path, $page, $pageTypesAndTitles) {
		echo "Building Page ".getPageFileName($page["title_short"])."...\n";
		if (file_exists("./".getPageFileName($page["title_short"]))) {
			unlink("{$path}/".getPageFileName($page["title_short"]));
		}
		// Setup HTML file contents
		$pageContent = "<!DOCTYPE html>\n<html lang='en'>\n\t<head>\n\t\t<meta charset='utf-8'>\n";
		// Write the title to HTML
		$pageContent .= "\t\t<title>{$page['title']}</title>\n";
		// Link the stylesheets
		$pageContent .= "\t\t<link rel='stylesheet' href='css/style.css'>\n";
		// add the navbar
		$pageContent .= buildNavbar($pageTypesAndTitles);
		// Close the head tag, create the body tag
		$pageContent .= "\t</head>\n\t<body>\n";
		$pageContent .= "\t\t<div class='background'></div>\n";
		$pageContent .= "\t\t<div class='body-content'>\n";
		// Add the header, date, and heading page separator
		if ($page["title"] != "About Me") {
			$date = "";
			if ($page["start_date"] == $page["end_date"]) {
				$date = $page["start_date"];
			} else if (substr($page["start_date"], -4) == substr($page["end_date"], -4)) {
				$date = substr($page["start_date"], 0, 3) . " - " . $page["end_date"];
			} else {
				$date = $page["start_date"] . " - " . $page["end_date"];
			}
			$pageContent .= "\t\t\t<h1>{$page['title']}</h1>\n";
			$pageContent .= "\t\t\t<h4>{$date}</h4>\n\t\t\t".buildSectionSeparator()."\n";
		} else {
			$pageContent .= "\t\t\t<h1>{$page['title']}</h1>\n\t\t\t".buildSectionSeparator()."\n";
		}
		// Add the page content - iterate over each item in content_html and treat as a new line to write to file
		foreach ($page["content_html"] as $line) {
			switch ($line) {
				case "buildSectionSeparator()":
				case "buildSectionSeparator":
					$pageContent .= "\t\t\t" . buildSectionSeparator() . "\n";
					break;
				default:
					$pageContent .= "\t\t\t" . $line . "\n";
			}
		}

		// Close the body tag, create the footer, and close html tag
		$pageContent .= "\t\t</div>\n\t</body>\n".buildFooter()."</html>";

		//Write to file
		$pageFile = fopen("{$path}/".getPageFileName($page["title_short"]), "w");
		fwrite($pageFile, $pageContent);
	}

	// Makes the navbar for the page with the current page indicated
	function buildNavbar($pageTypesAndTitles) {
		// Setup navbar, add home button
		$navbarString = "\t\t<div class='navbar-container'>\n\t\t\t<div id='navbar'>\n\t\t\t\t<a id='nav-home' href='./home.html'>Home</a>\n";
		// Add page dropdowns
		foreach (array_keys($pageTypesAndTitles) as $type) {
			if ($type != "none") {
				$formattedType = str_replace(" ", "-", strtolower($type));
				// Add dropdown
				$navbarString .= "\t\t\t\t<div style='float:left' id='dropdown{$formattedType}' class='dropdown-position'>\n\t\t\t\t\t<p id='nav-{$formattedType}' onclick='onClickType(this.src, \"{$formattedType}\")'>{$type}</p>\n";
				// Add dropdown content
				$navbarString .= "\t\t\t\t\t<div id='dropdownContent{$formattedType}' class='dropdown-content dropdown-content-type'>\n";
				// Add pages to dropdown
				foreach ($pageTypesAndTitles[$type] as $title) {
					$navbarString .= "\t\t\t\t\t\t<a id='nav-page' href='./". getPageFileName($title) . "'>{$title}</a>\n";
				}
				// Close dropdown html
				$navbarString .= "\t\t\t\t\t</div>\n\t\t\t\t</div>\n";
			}
		}
		// Add links dropdown
		$navbarString .= "\t\t\t\t<div style='float:right' id='dropdown' class='dropdown-position'>\n\t\t\t\t\t<img src='./img/navbar-icon/icon-white.png' onclick='onClickMenu(this.src)' onmouseover='mouseOnMenu(this.src)' onmouseout='mouseOffMenu(this.src)' id='nav-icon' />\n";
		// Add dropdown content
		$navbarString .= "\t\t\t\t\t<div id='menuDropdownContent' class='dropdown-content'>\n\t\t\t\t\t\t<a id='nav-contact' href='mailto:jon@the-allens.net'>Email</a>\n\t\t\t\t\t\t<a href='https://www.linkedin.com/in/jon-allen-b071ba195'>LinkedIn</a>\n\t\t\t\t\t\t<a href='https://github.com/Hamsterdam117'>GitHub</a>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n";
		// Add about me button
		$navbarString .= "\t\t\t\t<a id='nav-about' style='float:right' href='./about-me.html'>About Me</a>\n";
		// Close navbar div and Add link to JavaScript code
		$navbarString .= "\t\t\t</div>\n\t\t</div>\n\t\t<script src='./script/navbar.js'></script>\n";
		// Return navbar
		return $navbarString;
	}

	// Makes the footer for the page (no current footer)
	function buildFooter() {
		return "";
	}

	// Makes the section separators
	function buildSectionSeparator($type='large') {
		switch ($type) {
			case 'large':
				return "<div id='h1-underline'><div class='line'></div><div class='circle'></div></div>\n";
			
			case 'home':
				return "<div id='post-underline'><div class='line'></div><div class='circle'></div></div>\n";
		}
	}
?>