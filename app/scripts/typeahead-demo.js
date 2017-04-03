var react = require('react');
var reactDOM = require('react-dom');

window.React = react;

var TypeaheadDemo = React.createClass({
  handleChange: function(event){    
    event.target.select();  
},
    render: function() {     
        return (
        <div className="col-xs-12 search-container nopadding">
        <div className="row">          
          <div className="col-xs-12 col-sm-6 col-lg-7">
            <form className="searchbox">
              <label>
                <input ref="search suggestion" className="searchbox__input typeahead form-control" type="text" placeholder="Search a state name..." id="q" />
              </label>
              </form>
          </div>
        </div>
      </div>
        );
    },
      
    componentDidMount() {
    //========================= BLOODHOUND ==============================//
  var aState = new Bloodhound({
  //datumTokenizer: Bloodhound.tokenizers.whitespace,
  datumTokenizer: function (datum){
    return Bloodhound.tokenizers.whitespace(datum.value);
  },
  queryTokenizer: Bloodhound.tokenizers.whitespace,  
  //local: states
  remote : 
  {
    url : 'https://api.themoviedb.org/3/search/movie?query=%QUERY&api_key=1ef28d374513cebe254f6e12e1d27da0',
    wildcard: '%QUERY',
    filter : function(movies){
      return $.map(movies.results, function(movie){
        return {
          value :movie.value,
          id  : movie.id
        };
      });
    },//END filter
  }
});//END Bloodhound

    //========================= END BLOODHOUND ==============================//

    //========================= TYPEAHEAD ==============================//
    // Instantiate the Typeahead UI
    $('.typeahead').typeahead({
       hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'aState',
  source: aState
}).on('typeahead:selected',function(obj,datum){
  alert(datum.id);
}.bind(this)); // END Instantiate the Typeahead UI

    //========================= END TYPEAHEAD ==============================//

  } // end component did mount function
});

var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
  'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
]


reactDOM.render(<TypeaheadDemo />, document.getElementById('inptTypeahead'));