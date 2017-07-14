$(document).ready(function() {
    $(".executionTab").click(function() {
        $("#DownloadTemplate-link").hide();
        $('.nav-tabs a[href="#execution"]').tab('show');
        // remove any panels showing on page 
        clearAllPanels();
        getExecutionIDs(getWorkflowURI(), function(res, executionID) {
            renderVisualization(res, true);
            getExecutionMetadata(executionID, function(res) {
                setExecutionMetadata(res);
            })
        })
        
        var traceSelect = document.getElementById('selection');
        traceSelect.style.display = 'inline';
        /*traceSelect.options[0].setAttribute("selected","selected");*/
        document.getElementById('workflow-name').style.display = "none";
        document.getElementById('execution-name').style.display = "inline-block";
        /*document.getElementById('execution-name').innerHTML = "Selected execution: ";*/
        document.getElementById('selection-explanation').style.display = "inline-block";
        document.getElementById('RDFImage-bar1').style.display = "none";
        document.getElementById('RDFImage-bar2').style.display = "inline-block";
    });
    
    $(".workflowTab").click(function() {
        // remove any panels showing on page 
        clearAllPanels();
        $("#DownloadTemplate-link").show();
        $('.nav-tabs a[href="#workflow"]').tab('show');  
        getWorkflowData(workflowURI, function(res) {
            renderVisualization(res, false);
        });
        getWorkflowMetadata(workflowURI, function(res)  {
            setWorkflowMetadata(res);
        });
                
        var traceSelect = document.getElementById('selection');
        traceSelect.style.display = 'none';
        
        for (var i = traceSelect.options.length-1; i >= 0; i--) {
            traceSelect.remove(i);
        }
        document.getElementById('execution-name').style.display = "none";
        document.getElementById('workflow-name').style.display = "inline-block";
        document.getElementById('execution-name').innerHTML = "";
        document.getElementById('selection-explanation').style.display = "none";
        document.getElementById('RDFImage-bar1').style.display = "inline-block";
        document.getElementById('RDFImage-bar2').style.display = "none";
    });
});

var setExecutionMetadata = function(res) {
    if (res.results.hasOwnProperty('bindings')) {
        document.getElementById('status-value').textContent = 'status: ' + res.results.bindings[0].status.value.toLowerCase();
        //TODO: change time to human readable format
        document.getElementById('label-value').textContent = res.results.bindings[0].label.value;
        document.getElementById('start-time-value').textContent = 'start time: ' + new Date(res.results.bindings[0].start.value).toString();
        document.getElementById('end-time-value').textContent = 'end time: ' + new Date(res.results.bindings[0].end.value).toString();
    } else {
        document.getElementById('status-value').textContent = 'N/A';
        document.getElementById('label-value').textContent = 'N/A';
        document.getElementById('start-time-value').textContent = 'N/A';
        document.getElementById('end-time-value').textContent = 'N/A';
    }
}

var setWorkflowMetadata = function(res) {
    //console.log(res);
    if(res.results.bindings[0].contributer.value != null)  {
        document.getElementById('contributer-value').textContent = 'contributer: ' + res.results.bindings[0].contributer.value.substring(6);
    }
    else {
        document.getElementById('contributer-value').textContent = 'N/A';
    }
    if(res.results.bindings[0].modified.value != null)  {
        document.getElementById('modified-value').textContent = 'modified on: ' + new Date(res.results.bindings[0].modified.value).toString();
    }
    else {
        document.getElementById('modified-value').textContent = 'N/A';
    }
    if(res.results.bindings[0].system.value != null)  {
        document.getElementById('system-value').textContent = 'created by system: ' + res.results.bindings[0].system.value;
    }
    else {
        document.getElementById('system-value').textContent = 'N/A';
    }
    if(res.results.bindings[0].version.value != null)  {
        document.getElementById('version-value').textContent = 'version Number: ' + res.results.bindings[0].version.value;
    }
    else {
        document.getElementById('version-value').textContent = 'N/A';
    }
    if(res.results.bindings[0].download.value != null)  {
        document.getElementById('DownloadTemplate-link').href = res.results.bindings[0].download.value;
    }
}