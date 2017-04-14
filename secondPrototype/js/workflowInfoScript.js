var processInfosCount = 0; // keep track of how many process info divs are shown
var processInfosIndex = 0;
var variableInfosCount = 0;
var variableInfosIndex = 0;


var variableSectionsShowing = [];
var variableSectionsShowingIds = [];
var sectionsShowing = [];
var sectionsShowingIds = [];
var $template = $(".template");
var $templateVariables = $(".templ");
var $vis = $(".visualization-container");

function addProcessInfo(processURI, inputsArray, outputsArray) {
	if (processInfosCount == 0 && variableInfosCount == 0) {
		// resize the visualization container
        translateVisualization();
		console.log("should reize");
		$vis.animate({
                "width": "63%"
            }, "slow");
	}
	// check that process div thing is not over count
	if (processInfosCount == 4) {
		console.log(sectionsShowing);
			// remove a process
			removeProcessInfo(sectionsShowing[0]);
	}
	
	// get name of node
	var processName = stripNameFromURI(processURI);
	console.log(processName);
		
	var alreadyShowing = false;
	// Check that section is not already showing
	for (var i = 0; i < sectionsShowing.length; i++) {
			if (sectionsShowing[i] == processName) {
				alreadyShowing = true;
			}
	}
	if (alreadyShowing) {
			console.log("process is already showing!");
	}
	
	// panel isn't already displayed on page, so add it
	if (!alreadyShowing) {
		sectionsShowing[processInfosCount] = processName;
		var $newPanel = $template.clone();
		
//		$newPanel.find(".collapse").removeClass("in");
		// set header name
        var accordionToggle = $newPanel.find(".accordion-toggle");
        
        accordionToggle.click(function() {
            unhighlightAllPuts();
            highlightPuts(inputsArray);
            highlightPuts(outputsArray);
        });
        
		$newPanel.find(".accordion-toggle").attr("href", "#" + (processInfosIndex)).text("Process: " + processName);
		$newPanel.attr("id", processName);
		// link clicking on process name to expand collapse
		$newPanel.find(".panel-collapse").attr("id", processInfosIndex);

		// Populate the table with variable data
		var l = inputsArray.length;
		if (outputsArray.length > l) {
				l = outputsArray.length;
		}
		// adding inputs and outputs to the table
		var tableBody = $newPanel.find("table")[0];
		var newTableBody = document.createElement("tbody");
		newTableBody.setAttribute("class", "process_info_table_body");
		for (var i = 0; i < l; i++) {
				var row = newTableBody.insertRow(-1);
				// add input variable name and add output variable name (if applicable)
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				if (i < inputsArray.length) {
						cell1.innerHTML = stripNameFromURI(inputsArray[i]);
				}
				if (i < outputsArray.length) {
						cell2.innerHTML = stripNameFromURI(outputsArray[i]);
				}
			}
		tableBody.append(newTableBody);
		
//		// checkbox listeners for highlighting inputs and outputs
//		// CHECKBOX - INPUTS
//		var checkboxInputsWrapper = $newPanel.find("span")[1];
//		var newCheckIn = document.createElement("input");
//		newCheckIn.setAttribute("type", "checkbox");
//		newCheckIn.setAttribute("class", "variable_input_check");
//		newCheckIn.setAttribute("aria-label", "...");
//		newCheckIn.setAttribute("id", "checkIn"+processName);
//		var text = document.createElement("p");
//		text.setAttribute("style", "display:inline-block;padding:1px 10px");
//		text.innerHTML = "Highlight Inputs";
//	
//		checkboxInputsWrapper.append(newCheckIn);
//		checkboxInputsWrapper.append(text);
//		checkboxInputsWrapper.append(document.createElement("br"));
//
//		console.log(checkboxInputsWrapper);
//
//		$(document).on('click','#checkIn'+processName,function(){
//			console.log(processURI);
//			console.log(inputsArray);
//			if ($(this).is(':checked')) {
//				highlightPuts(inputsArray);
//			} else {
//				unhighlightPuts( inputsArray);
//			}
//		});
//		
//		// CHECKBOX OUTPUTS
//		var checkboxOutputsWrapper = $newPanel.find("span")[2];
//		var newCheckIn = document.createElement("input");
//		newCheckIn.setAttribute("type", "checkbox");
//		newCheckIn.setAttribute("class", "variable_output_check");
//		newCheckIn.setAttribute("aria-label", "...");
//		newCheckIn.setAttribute("id", "checkOut"+processName);
//		var text = document.createElement("p");
//		text.setAttribute("style", "display:inline-block; padding:1px 10px");
//		text.innerHTML = "Highlight Outputs";
//	
//		checkboxOutputsWrapper.append(newCheckIn);
//		checkboxOutputsWrapper.append(text);
//		checkboxOutputsWrapper.append(document.createElement("br"));
//
//		console.log(checkboxOutputsWrapper);
//
//		$(document).on('click','#checkOut'+processName,function(){
//			console.log(processURI);
//			console.log(inputsArray);
//			if ($(this).is(':checked')) {
//				highlightPuts(outputsArray);
//			} else {
//				unhighlightPuts(outputsArray);
//			}
//		});

		// add new panel to the page
		$("#accordionInfo").append($newPanel.fadeIn("slow"));
		
		processInfosCount = processInfosCount + 1;
		processInfosIndex = processInfosIndex + 1;
	}
}
    

// FUNCTION TO ADD NEW VARIABLE INFORMATION SECTIONS
function addVariableInfo(variableURI, usedBy, generatedBy, variableType) {
	console.log(variableSectionsShowing);
	if (processInfosCount == 0 && variableInfosCount == 0) {
		// resize the visualization container
		console.log("should reize");
        translateVisualization();
		$vis.animate({
                "width": "63%"
            }, "slow");
	}
	// check that variable div thing is not over count
	if (variableInfosCount == 4) {
			// remove a variable
			removeVariableInfo(variableSectionsShowing[0]);
	}
	
	// get name of node
	var variableName = stripNameFromURI(variableURI);
	console.log(variableName);
		
	var alreadyShowing = false;
	// Check that section is not already showing
	for (i = 0; i < variableSectionsShowing.length; i++) {
			if (variableSectionsShowing[i] == variableName) {
				alreadyShowing = true;
			}
	}
	if (alreadyShowing) {
			console.log("variable is already showing!");
	}
	
	// panel isn't already displayed on page, so add it
	if (!alreadyShowing) {
		variableSectionsShowing[variableInfosCount] = variableName;
		var $newPanel = $templateVariables.clone();
		
//		$newPanel.find(".collapse").removeClass("in");
		// set header name
		$newPanel.find(".accordion-toggle").attr("href", "#v" + (variableInfosIndex)).text("Variable: " + variableName);
		$newPanel.attr("id", variableName);
		// link clicking on process name to expand collapse
		$newPanel.find(".panel-collapse").attr("id", "v" + variableInfosIndex);

		// show variable type and generated by info
		var textVarType = $newPanel.find("div")[6];
		var newName = document.createElement("strong");
		newName.innerHTML = variableType;
		textVarType.append(newName);
		
		// Generated By
		var textGeneratedBy = $newPanel.find("div")[7];
		console.log(textGeneratedBy);
		var newGeneratedBy = document.createElement("strong");
		newGeneratedBy.innerHTML = " - ";
		// ----------TODO----------
		if (typeof generatedBy != 'undefined') {
			newGeneratedBy.innerHTML = stripNameFromURI(generatedBy[0]);
		} else {
			newGeneratedBy.innerHTML = "-";
		}
		textGeneratedBy.append(newGeneratedBy);
		
		// show list of used by processes
		var listUsedBy = $newPanel.find("ul")[0];
		if (typeof usedBy != 'undefined') {
			for (var i = 0; i < usedBy.length; i++) {
				var newListItem = document.createElement("li");
				newListItem.innerHTML = stripNameFromURI(usedBy[i]);
				listUsedBy.append(newListItem);
			}
		}
		
		// show list of files in dropdown and w/ handler to update link
		var fileSelector = $newPanel.find("select")[0];
		$($newPanel).find("#file-selector").attr("id","file-selector-"+variableName);
		for (var i = 0; i < 5; i++) {
			var newFile = document.createElement("option");
			newFile.innerHTML = "new file #" + i;
			fileSelector.append(newFile);
		}
		// file download link
		var downloadSpan = $newPanel.find("span")[3];
		var downloadLink = document.createElement("a");
		downloadLink.setAttribute("style", "margin-left:8px");
		downloadLink.innerHTML = " - ";
		//-------TODO---------
		// if the number of files is greater than 0, change text to the first file name
//		if () {
//			downloadLink.innerHTML = someArray[0];
//		} else {
//			downloadLink.innerHTML = " - ";
//		}
		downloadLink.setAttribute("id", "download-link-"+variableName);
		downloadSpan.append(downloadLink);
		
		$newPanel.on('change','#file-selector-'+variableName,function(){
			var selector = document.getElementById("file-selector-"+variableName);
			var selectedText = selector.options[selector.selectedIndex].text;
			var link = document.getElementById("download-link-"+variableName);
			link.innerHTML = selectedText;
		});
		
		// add new panel to the page
		$("#accordionVariables").append($newPanel.fadeIn("slow"));
		
		variableInfosCount = variableInfosCount + 1;
		variableInfosIndex = variableInfosIndex + 1;
	}
}


function clearAllPanels() {
	// remove all panels from the page
	var sectionsShowingCopy = sectionsShowing.slice();
	var variableSectionsShowingCopy = variableSectionsShowing.slice();
	unhighlightAllPuts();
	for (var i = 0; i < sectionsShowingCopy.length; i++) {
		removeProcessInfo(sectionsShowingCopy[i]);	
	}
	for (var j = 0; j < variableSectionsShowingCopy.length; j++) {
		removeVariableInfo(variableSectionsShowingCopy[j]);
	}
	// reset any counters and other things
	processInfosCount = 0
	variableInfosCount = 0;
	processInfosIndex = 0;
	variableInfosIndex = 0;
	sectionsShowing = [];
	sectionsShowingIds = [];
	variableSectionsShowing = [];
	variableSectionsShowingIds = [];
}

$(document).on('click', '.glyphicon-remove-circle', function () {
	var processName = $(this).parent().parent().attr("id");
  $(this).parents('.panel').get(0).remove();
	processInfosCount = processInfosCount - 1;
	for (var i = 0; i < sectionsShowing.length; i++) {
		if (sectionsShowing[i] == processName) {
			sectionsShowingIds.splice(i, 1);
			sectionsShowing.splice(i, 1);
			break;
		}
	}
	if (processInfosCount == 0 &&  variableInfosCount == 0) {
		// resize the visualization container
		console.log("should reize");
		unhighlightAllPuts();
		$vis.animate({
                "width": "100%"
            }, "slow");
	}
});


$(document).on('click', '.glyphicon-remove-sign', function () {
	var variableName = $(this).parent().parent().attr("id");
  $(this).parents('.panel').get(0).remove();
	variableInfosCount = variableInfosCount - 1;
	for (var i = 0; i < variableSectionsShowing.length; i++) {
		if (variableSectionsShowing[i] == variableName) {
			variableSectionsShowingIds.splice(i, 1);
			variableSectionsShowing.splice(i, 1);
			break;
		}
	}
	if (processInfosCount == 0 &&  variableInfosCount == 0) {
		// resize the visualization container
		console.log("should reize");
		unhighlightAllPuts();
		$vis.animate({
                "width": "100%"
            }, "slow");
	}
});

function removeVariableInfo(removeID) {
	var divToRemove = document.getElementById(removeID);
	console.log(divToRemove);
	divToRemove.remove();
	// remove from lists that are keeping track of which processes are currently showing on page
	variableInfosCount = variableInfosCount - 1;
	for (var i = 0; i < variableSectionsShowing.length; i++) {
		if (variableSectionsShowing[i] == removeID) {
			variableSectionsShowingIds.splice(i, 1);
			variableSectionsShowing.splice(i, 1);
			break;
		}
	}

	if (processInfosCount == 0 && variableInfosCount == 0) {
		// resize the visualization container
		console.log("should reize");
		unhighlightAllPuts();
		$vis.animate({
							"width": "100%"
					}, "slow");
	}
}


function removeProcessInfo(removeID) {
    var divToRemove = document.getElementById(removeID);
		console.log(divToRemove);
    divToRemove.remove();
		// remove from lists that are keeping track of which processes are currently showing on page
		processInfosCount = processInfosCount - 1;
		for (var i = 0; i < sectionsShowing.length; i++) {
			if (sectionsShowing[i] == removeID) {
				sectionsShowingIds.splice(i, 1);
				sectionsShowing.splice(i, 1);
				break;
			}
		}
	
	if (processInfosCount == 0 && variableInfosCount == 0) {
		// resize the visualization container
		console.log("should reize");
		unhighlightAllPuts();
		$vis.animate({
                "width": "100%"
            }, "slow");
	}
}

function toggleChevron(e) {
    $(e.target)
        .prev('.panel-heading')
        .find("i.indicator")
        .toggleClass('glyphicon-chevron-down glyphicon-chevron-up');
}
$('#accordion').on('hidden.bs.collapse', toggleChevron);
$('#accordion').on('shown.bs.collapse', toggleChevron);

