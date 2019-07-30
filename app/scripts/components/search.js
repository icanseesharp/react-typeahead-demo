import React, { Component } from 'react';
import ReactDOM from 'react-dom';
const TMDBLogo = 'https://www.themoviedb.org/assets/2/v4/logos/powered-by-rectangle-green-dcada16968ed648d5eb3b36bbcfdd8cdf804f723dcca775c8f2bf4cea025aad6.svg';

class SearchBox extends Component {

  handleChange(event) {    
    event.target.select();
  }
  render() {
    return (
      <div className="col-xs-12 search-container nopadding">
        <div className="row">

          <div className="col-xs-12 col-sm-6 col-lg-5">
            <a href="./" title="ReactJS TMDb Movie Search"><img src={TMDBLogo} className="logo" alt="The Movie Database" /></a>
          </div>
          <div className="col-xs-12 col-sm-6 col-lg-7">
            <form className="searchbox">
              <label>
                <input ref="search suggestion" onClick={this.handleChange} className="searchbox__input typeahead form-control" type="text" placeholder="Search Movie Title..." id="q" />
              </label>
              </form>
          </div>
        </div>
      </div>
    )
  }
}
module.exports = SearchBox;
