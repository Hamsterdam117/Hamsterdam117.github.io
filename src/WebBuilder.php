<?php
	include "PageBuilder.php";

	// Builds the website
	function buildWebsite($commitMessage="", $pathToBuild='../') {
		// Get directory ready for new build
		if (!setupBuildDirectory($pathToBuild)) {
			echo "FAILED: Missing CSS, JS, image, font, index.html file(s).";
			return;
		}
		// Import pages from the JSON file
		echo "Importing JSON...\n";
		$pages = getJSON();
		// Get all page types to use for navbar dropdown menus
		foreach(array_unique(array_column($pages, "type")) as $type) {
			$pageTypesAndTitles[$type] = array();
		}
		// Sort types alphabetically
		ksort($pageTypesAndTitles);
		// Organise each page by their type
		foreach($pages as $page) {
			array_push($pageTypesAndTitles[$page["type"]], $page["title_short"]);
		}
		// Create the pages for the website
		echo "Building Pages...\n";
		buildHomePage($pathToBuild, $pages, $pageTypesAndTitles);
		foreach($pages as $page) {
			buildPage($pathToBuild, $page, $pageTypesAndTitles);
		}
		echo "Completed Build.\n";

		if ($commitMessage != "") {
			uploadToGitHub($commitMessage, $pathToBuild);
		} else {
			echo "No commit message provided: will not upload to GitHub.\n";
		}
	}

	// Merges all json files into one array and returns full page array
	function getJSON() {
		$pageArray = array();
		// Iterate through each file
		$dir = new DirectoryIterator("./json");
		foreach ($dir as $fileinfo) {
		    if (!$fileinfo->isDot()) {
		    	// Get the file name
		        $fileName = $fileinfo->getFilename();
		        // Decode the json
		        $data = json_decode(file_get_contents("./json/".$fileName), true)["pages"];
		        // Merge with the main array
		        $pageArray = array_merge($pageArray, $data);
		    }
		}
		return $pageArray;
	}

	// Sets up build directory structure, copies over images, CSS and JavaScript
	function setupBuildDirectory($pathToBuild) {
		echo "Setting up Build Directory...\n";
		// Check source code is available
		if (is_dir_empty("./css/")) { return false; }
		if (is_dir_empty("./script/")) { return false; }
		if (is_dir_empty("./img/")) { return false; }
		if (is_dir_empty("./fonts/")) { return false; }
		if (!file_exists("./index.html")) { return false; }

		// Make directories
		if (!file_exists($pathToBuild)) {
			mkdir($pathToBuild, 0777, true);
		}
		if (!file_exists("{$pathToBuild}/css")) {
			mkdir("{$pathToBuild}/css", 0777, true);
		}
		if (!file_exists("{$pathToBuild}/script")) {
			mkdir("{$pathToBuild}/script", 0777, true);
		}
		if (!file_exists("{$pathToBuild}/img")) {
			mkdir("{$pathToBuild}/img", 0777, true);
		}
		if (!file_exists("{$pathToBuild}/fonts")) {
			mkdir("{$pathToBuild}/fonts", 0777, true);
		}
		
		// Copy required files over
		echo "Copying Required Files...\n";
		recurseCopy("./css/", "{$pathToBuild}/css/");
		recurseCopy("./script/", "{$pathToBuild}/script/");
		recurseCopy("./img/", "{$pathToBuild}/img");
		recurseCopy("./fonts/", "{$pathToBuild}/fonts");
		copy("./index.html", "{$pathToBuild}/index.html");
		return true;
	}

	// Checks if the given directory is empty or not
	function is_dir_empty($dir) {
			if (!is_readable($dir)) return NULL; 
	 		return (count(scandir($dir)) == 2);
	}

	// Copies files recursively
	function recurseCopy($src,$dst, $childFolder='') { 
	    $dir = opendir($src); 
	    if (!file_exists($dst)) {
	    	mkdir($dst);
	    }
	    if ($childFolder!='') {
	        mkdir($dst.'/'.$childFolder);

	        while(false !== ( $file = readdir($dir)) ) { 
	            if (( $file != '.' ) && ( $file != '..' )) { 
	                if ( is_dir($src . '/' . $file) ) { 
	                    recurseCopy($src . '/' . $file,$dst.'/'.$childFolder . '/' . $file); 
	                } 
	                else { 
	                    copy($src . '/' . $file, $dst.'/'.$childFolder . '/' . $file); 
	                }  
	            } 
	        }
	    } else {
	        // return $cc; 
	        while(false !== ( $file = readdir($dir)) ) { 
	            if (( $file != '.' ) && ( $file != '..' )) { 
	                if ( is_dir($src . '/' . $file) ) { 
	                    recurseCopy($src . '/' . $file,$dst . '/' . $file); 
	                } 
	                else { 
	                    copy($src . '/' . $file, $dst . '/' . $file); 
	                }  
	            } 
	        } 
	    }
	    
	    closedir($dir); 
	}

	// Uploads everything to github
	function uploadToGitHub($commitMessage, $pathToBuild) {
		echo "Uploading to GitHub...";
		chdir($pathToBuild);
		exec("git pull");
		exec("git add *");
		exec("git commit -m \"{$commitMessage}\"");
		exec("git push");
		echo "Finished upload.";
	}

// Runs the code when php is called from the command line
if ($argv[1]) {
	buildWebsite($argv[1]);
} else {
	buildWebsite();
}
?>