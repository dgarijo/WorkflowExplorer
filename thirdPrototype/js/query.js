endpoint = localStorage.getItem("endpoint");

/*
    @params: function "handler" that can be called when ajax call finishes
    
    -populates workflow label suggestions for autocomplete search
*/
var populateSearchBar = function(handler) {
    $.ajax({
        url: endpoint + 'query?query=select+%3Fwf+%3Flabel+from+%3Curn%3Ax-arq%3AUnionGraph%3E+where%7B%0D%0A%0D%0A%3Fwf+a+%3Chttp%3A%2F%2Fwww.opmw.org%2Fontology%2FWorkflowTemplate%3E.%0D%0A%3Fwf++%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23label%3E+%3Flabel.%0D%0A%7D&output=json&stylesheet=',
        type: 'GET',
        cache: false,
        timeout: 30000,
        error: function(){
            handler({});
        },
        success: function(res){ 
            //success condition executes if ajax call goes through- we call the function handler, passing in the ajax response "res"
            handler(res);
        }
    });
}


/*
    @params: workflow URI as identifier of a workflow, function 'handler' that can be called when ajax call finishes
    -gets the inputs of a given workflow
*/
var getInputs = function(workflow, handler) {
    var sparql = 'select ?input from <urn:x-arq:UnionGraph> where{?input <http://www.opmw.org/ontology/isVariableOfTemplate> <' + workflow + '>.?p <http://www.opmw.org/ontology/uses> ?input.FILTER NOT EXISTS {?input<http://www.opmw.org/ontology/isGeneratedBy> ?p2.}}';
    
    var endpointURI = endpoint + "query?query=" + escape(sparql) + "&format=json";
    
    $.ajax({
        dataType :'jsonp',
        jsonp :'callback',
        url :endpointURI,
        success: function(res) {
            if (res.results.bindings) {
                handler(res.results.bindings);
            }
        }
    });
}

/*
    @params: workflow URI as identifier of a workflow, function 'handler' that can be called when ajax call finishes
    -gets the necessary data to represent each node/edge in visualization
*/
var getWorkflowData = function(workflowURI, handler) {
    var sparql = 'select ?step ?input ?output from <urn:x-arq:UnionGraph> where{{?step <http://www.opmw.org/ontology/isStepOfTemplate> <' + workflowURI + '>.?step <http://www.opmw.org/ontology/uses> ?input.}UNION{?step <http://www.opmw.org/ontology/isStepOfTemplate> <' + workflowURI +'>.?output <http://www.opmw.org/ontology/isGeneratedBy> ?step.}}';
    
    var endpointURI = endpoint + "query?query=" + escape(sparql) + "&format=json";
    
    $('svg').hide();
    $('#spinner').show();
    
    $.ajax({
        url: endpointURI,
        type: 'GET',
        cache: false,
        timeout: 30000,
        error: function(){
            handler({});
        },
        success: function(res) {
            $('svg').show();
            $('#spinner').hide();
            handler(res);
        }
    })
}

/*
    @params: workflow URI as identifier of a workflow, function 'handler' that can be called when ajax call finishes
    -gets the execution IDs for a workflow 
*/
var getExecutionIDs = function (workflowURI, handler) {
    var sparql = 'select ?execution from <urn:x-arq:UnionGraph> where { ?execution <http://www.opmw.org/ontology/correspondsToTemplate> <' + workflowURI + '>}';
    
    var endpointURI = endpoint + "query?query=" + escape(sparql) + "&format=json";
    
    $.ajax({
        url: endpointURI,
        type: 'GET',
        cache: false,
        timeout: 30000,
        error: function(){
        },
        success: function(res) {
            getExecutionData(res.results.bindings[0].execution.value, handler);
            addTraces(res.results.bindings)
        }
    })
}

/*
    @params: execution ID as identifier of an execution trace, function 'handler' that can be called when ajax call finishes
    -gets the necessary data to represent each node/edge in visualization of execution trace
*/
var getExecutionData = function(executionID, handler) {
    var sparql = 'select ?step ?input ?output  from <urn:x-arq:UnionGraph> where{{?step <http://openprovenance.org/model/opmo#account> <' + executionID + '>.?step <http://purl.org/net/opmv/ns#used> ?input.}UNION{?step <http://openprovenance.org/model/opmo#account> <' + executionID +'>.?output <http://purl.org/net/opmv/ns#wasGeneratedBy> ?step.}}';
    
    var endpointURI = endpoint + 'query?query=' + escape(sparql) + '&format=json';
    $('svg').hide();
    $('#spinner').show();
    $.ajax({
        url: endpointURI,
        type: 'GET',
        cache: false,
        timeout: 30000,
        error: function(){
        },
        success: function(res) {
            $('svg').show();
            $('#spinner').hide();
            handler(res, executionID);
        }
    })
}

/*
    @params: execution ID as identifier of an execution trace, function 'handler' that can be called when ajax call finishes
    -gets metadata for an execution ID (status, time started, time ended, time of execution account creation)
*/
var getExecutionMetadata = function(executionID, handler) {
    var sparql = 'select ?label ?status ?start ?end  from <urn:x-arq:UnionGraph> where{<'
+ executionID + '><http://www.w3.org/2000/01/rdf-schema#label> ?label.optional{<' + executionID + '><http://www.opmw.org/ontology/hasStatus> ?status}.optional{<' + executionID + '><http://www.opmw.org/ontology/overallStartTime> ?start}.optional{<' + executionID + '><http://www.opmw.org/ontology/overallEndTime> ?end}}'
    
    var endpointURI = endpoint + 'query?query=' + escape(sparql) + '&format=json';
    
    $.ajax({
        url: endpointURI,
        type: 'GET',
        cache: false,
        timeout: 30000,
        error: function(){
        },
        success: function(res) {
            handler(res);
        }
    })
}

var getWorkflowMetadata = function(workflowURI, handler)  {
    var sparql = 'select ?contributer ?version ?modified ?system ?download  from <urn:x-arq:UnionGraph> where{<'
    + workflowURI + '><http://purl.org/dc/terms/contributor> ?e.?e <http://www.w3.org/2000/01/rdf-schema#label> ?contributer.optional{<' 
    + workflowURI + '><http://www.opmw.org/ontology/versionNumber> ?version}.optional{<' 
    + workflowURI + '><http://purl.org/dc/terms/modified> ?modified}.optional{<' 
    + workflowURI + '><http://www.opmw.org/ontology/createdInWorkflowSystem> ?system}.optional{<' 
    + workflowURI + '><http://www.opmw.org/ontology/hasNativeSystemTemplate> ?download}}';
    
    var endpointURI = endpoint + 'query?query=' + escape(sparql) + '&format=json';
    
    $.ajax({
        url: endpointURI,
        type: 'GET',
        cache: false,
        timeout: 30000,
        error: function(){
        },
        success: function(res) {
            handler(res);
        }
    })
}

var getExecutionArtifactValues = function(handler, variableURI, usedBy, generatedBy, variableType) {
    var sparql = 'select ?file from <urn:x-arq:UnionGraph> where {<'
    + variableURI +'><http://www.opmw.org/ontology/hasLocation> ?file}';
    var endpointURI = endpoint + 'query?query=' + escape(sparql) + '&format=json';

    var typequery = 'select ?type from <urn:x-arq:UnionGraph> where {<'+ variableURI +'><http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?type}';   
    var typeURI = endpoint + 'query?query=' + escape(typequery) + '&format=json';

    var nodevalue = 'select ?value from <urn:x-arq:UnionGraph> where {<'
    + variableURI +'><http://www.opmw.org/ontology/hasValue> ?value}';
    var nodevalueURI = endpoint + 'query?query=' + escape(nodevalue) + '&format=json';

    var isparameter = 'select ?file from <urn:x-arq:UnionGraph> where {<'
    + variableURI +'><http://www.opmw.org/ontology/isParameterOfTemplate> ?file}';
    var isparameterURI = endpoint + 'query?query=' + escape(isparameter) + '&format=json';

    var type;
    $.ajax({
        url: typeURI,
        type: 'GET',
        cache: false,
        timeout: 30000,
        error: function(){
            type=null;
        },
        success: function(res) {
            type=res;
            //console.log(res);
        }
    })

    $.ajax({
        url: isparameterURI,
        type: 'GET',
        cache: false,
        timeout: 30000,
        error: function(){
        },
        success: function(res) {
            if(res.results.bindings[0]!=null)  {
                variableType = 'parameter';
            }
            //console.log(res);
        }
    })

    $.ajax({
        url: endpointURI,
        type: 'GET',
        cache: false,
        timeout: 30000,
        error: function(){
        },
        success: function(res) {
            $.ajax({
                url: nodevalueURI,
                type: 'GET',
                cache: false,
                timeout: 30000,
                error: function() {
                    handler(variableURI, usedBy, generatedBy, variableType, res.results, null, type);
                },
                success: function(res2) {
                    handler(variableURI, usedBy, generatedBy, variableType, res.results, res2.results, type);
                }
            })
        }
    })
}

var parseAutocomplete = function(res) {
    var suggestions = [];
    if(res.results && res.results.bindings) {
        var bindings = res.results.bindings;
        for(var i =0; i < bindings.length; i++) {
          var binding = bindings[i];
          if(binding.label && binding.wf) {
            if(binding.wf.value.toLowerCase().indexOf("list_of") == -1) {
              var label = binding.label.value;
              label = label.replace(/\-d.*/g,"");
              if(label.toLowerCase().indexOf(".jpg") == -1 && 
                 label.toLowerCase().indexOf(".png") == -1 &&
                 label.toLowerCase().indexOf(".gif") == -1) {
                   var newElement = {label:label, uri:binding.wf.value};
                   suggestions.push(newElement);
              }
            }
          }
        }
        return suggestions;
    }
}

