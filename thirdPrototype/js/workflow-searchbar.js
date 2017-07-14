// Hack to replace the existing _renderItem in jQuery UI Autocomplete with our own implementation that highlights the matching input in the suggestions
function monkeyPatchAutocomplete() {
    $.ui.autocomplete.prototype._renderItem = function( ul, item) {
      var re = new RegExp(this.term, "i") ;
      var t = item.label.replace(re,"<span style='font-weight:bold;color:Blue;'>" + "$&" + "</span>");
      return $( "<li></li>" )
          .data( "item.autocomplete", item )
          .append( "<a>" + t + "</a>" )
          .appendTo( ul );
    };
}

var searchbarAutocomplete = function(suggestions) {
    
    monkeyPatchAutocomplete();
    $( "#workflow-searchbar" ).autocomplete({
        source:suggestions,
        appendTo: '.searchbar',
        select: function(event, ui) {
            localStorage.setItem('workflow-label', ui.item.label);
            var encryptedURI = CryptoJS.AES.encrypt(ui.item.uri, "csci401-Spring-2017");
            // Replace the old querystring 'uri' value with the new one
            if (history.pushState) {
                var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?uri=" + encryptedURI;
                window.history.pushState({path:newurl},'',newurl);
            }
            window.location.reload(true);
        }
    });
    
    function removeDuplicates(value, index, self) { 
      return self.indexOf(value) === index;
    }
    
    $.ui.autocomplete.filter = function (array, term) {
        // This regex returns suggestions that start with the input
        const regexStartWith = new RegExp('^' + $.ui.autocomplete.escapeRegex(term), 'i');
        // This regex returns suggestions that contain the input anywhere in the suggestion string
        const regexContains = new RegExp($.ui.autocomplete.escapeRegex(term), 'i');

        var suggestionsStartWith = array.filter(workflowLabel => regexStartWith.test(workflowLabel.label));
        var suggestionsContains = array.filter(workflowLabel => regexContains.test(workflowLabel.label));
        var suggestions = suggestionsStartWith.concat(suggestionsContains);
        return suggestions.filter(removeDuplicates);
    };
}