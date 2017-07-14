import React from 'react';
import ReactDOM from 'react-dom';
import Autosuggest from 'react-autosuggest';

var workflowSuggestions = [];
var workflowURI = "../html/workflow-main.html";

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  function removeDuplicates(value, index, self) { 
    return self.indexOf(value) === index;
  }
    
  const escapedValue = escapeRegexCharacters(value.trim());
  
  if (escapedValue === '') {
    return [];
  }

  // This regex returns suggestions that start with the input
  const regexStartsWith = new RegExp('^' + escapedValue, 'i');
  // This regex returns suggestions that contain the input anywhere in the suggestion string
  const regexContains = new RegExp(escapedValue, 'i');
    
  var suggestionsStartWith = workflowSuggestions.filter(workflowLabel => regexStartsWith.test(workflowLabel.label));
  var suggestionsContains = workflowSuggestions.filter(workflowLabel => regexContains.test(workflowLabel.label));
  // suggestions contains first the suggestions that begin with the input, then the suggestions that contain the input. There may still be duplicates.
  var suggestions = suggestionsStartWith.concat(suggestionsContains);
  return suggestions.filter(removeDuplicates);
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

function renderSuggestion(suggestion, { query }) {
  var re = new RegExp(query, "i") ;
  var t = suggestion.label.replace(re,"<strong>" + "$&" + "</strong>");
  return (<span dangerouslySetInnerHTML={{__html: t}} />);
}

class SearchBar extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
      noSuggestions: false
    };    
    this.onChange = this.onChange.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }
    
  componentDidMount() {
      // call function to execute ajax call from query.js, passing into it, a function that takes in an input "res" which we define to execute when the ajax call returns successfully
      populateSearchBar(function(res) { 
          //executes after ajax call returns
          workflowSuggestions = parseAutocomplete(res);
      });
  }

  onChange(event, { newValue, method }) {
    this.setState({
      value: newValue
    });
  };
  
  onSuggestionsFetchRequested({ value }) {
    const suggestions = getSuggestions(value);
    const isInputBlank = value.trim() === '';
    const noSuggestions = !isInputBlank && suggestions.length === 0;
    this.setState({
      suggestions,
      noSuggestions
    });
  };

  onSuggestionsClearRequested() {
    this.setState({
      suggestions: []
    });
  };
    
  onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
      localStorage.setItem("workflow-label", suggestion.label);
      localStorage.setItem("workflow-suggestions", JSON.stringify(workflowSuggestions));
      // Encrypt the workflow-uri and append it to the url as a querystring parameter
      var encryptedURI = CryptoJS.AES.encrypt(suggestion.uri, "csci401-Spring-2017");
      window.location = "../html/workflow-main.html" + "?uri=" + encryptedURI;
  };

  render() {
    const { value, suggestions, noSuggestions } = this.state;
    const inputProps = {
      placeholder: "Enter Workflow Name",
      value,
      onChange: this.onChange
    };
    return (
      <div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps} />
        {
          noSuggestions &&
            <div className="no-suggestions">
              No suggestions
            </div>
        }
      </div>
    );
  }
}

export default SearchBar;
