import React, { Component } from 'react';
import SearchBox from './search';
import Card from './card';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      movieID: 424 // set initital load movie - Schindler's List
    }
  }
  render() {
    return (
      <div>
        <SearchBox fetchMovieID={this.fetchMovieID.bind(this)}/>
        <Card data={this.state}/>
      </div>
    )
  } // END render

  // the api request function
  fetchApi(url) {

    fetch(url).then((res) => res.json()).then((data) => {
      // update state with API data
      this.setState({
        movieID: data.id,
        original_title: data.original_title,
        tagline: data.tagline,
        overview: data.overview,
        homepage: data.homepage,
        poster: data.poster_path,
        production: data.production_companies,
        production_countries: data.production_countries,
        genre: data.genres,
        release: data.release_date,
        vote: data.vote_average,
        runtime: data.runtime,
        revenue: data.revenue,
        backdrop: data.backdrop_path

      })
    })

    .catch((err) => console.log('Movie not found!'))

  } // end function

  fetchMovieID(movieID) {
    let url = `https://api.themoviedb.org/3/movie/${movieID}?&api_key=1ef28d374513cebe254f6e12e1d27da0`
    this.fetchApi(url)
  } // end function

  componentDidMount() {    
    let url = `https://api.themoviedb.org/3/movie/${this.state.movieID}?&api_key=1ef28d374513cebe254f6e12e1d27da0`
    this.fetchApi(url)

    // Configure Bloodhound
    let suggests = new Bloodhound({      
      datumTokenizer: function(datum) { return Bloodhound.tokenizers.whitespace(datum['value']); },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: 'https://api.themoviedb.org/3/search/movie?query=%QUERY&api_key=1ef28d374513cebe254f6e12e1d27da0',
        wildcard: '%QUERY',//Added as a fix to latest version of Bloodhound
        filter: function(movies) {
          // Map the remote source JSON array to a JavaScript object array
          return $.map(movies.results, function(movie) {
            return {
              value: movie.original_title, //This value is used in datumTokenizer to query the tmdb database
              id: movie.id
            };
          });
        } // end filter
      }
    }); // end new Bloodhound

    suggests.initialize();

    // END Bloodhound

    //----Configure Typeahead UI    
    $('.typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 2,
    }, 
    {
      displayKey : function(datum) { return datum.value;},
      name : 'suggests',
      source: suggests.ttAdapter()      
    }).
    on('typeahead:selected', function(obj, datum) {
      this.fetchMovieID(datum.id)
    }.bind(this));

    //----END Typeahead UI config

  } // end component did mount function
}// END CLASS - APP
module.exports = App;