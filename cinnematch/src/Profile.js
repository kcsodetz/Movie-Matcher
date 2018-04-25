import React, { Component } from 'react';
import './Profile.css'
import firebase from 'firebase/database'
import base from './base'

/**
 * Class for Profile component
 */
class Profile extends Component{
/**
 * Default constructor  
 * @constructor
 * @param {Object} props 
 */
  constructor(props) {
    super(props)
    this.state = {
      profile: '',
      firebaseObject: {},
      movies: {},
      listItems: []
    }
    this.loadProfile = this.loadProfile.bind(this)
    this.removeMovie = this.removeMovie.bind(this)
    this.populatePage = this.populatePage.bind(this)
  }

  syncNotes = () => {
    this.ref = base.syncState(
      `profile`,
    )
  }

  componentDidMount() {
    base.syncState(`users/${this.props.uid}`, {
      context: this,
      state: 'movies',
    });
  }

  removeItem(newItem) {
    this.setState({
      movies: this.state.movies 
    });
  }

  populatePage() {
    const movieNames = Object.keys(this.state.movies);
    const length = movieNames.length;
    // for (var i = 0; i < length; i++) {
    //   const currentMovie = movieNames[i]
    // }
    
    const listItems = movieNames.map((movieNames) => 
      <li key={movieNames}>{movieNames}</li>
    ); 

    this.setState({
      listItems   
    });
  }

  loadProfile(ev) {
    ev.preventDefault()
    base.fetch('users', {
    }).then(data => {
      this.setState({profile: this.props.uid,movies: data[this.props.uid]})
      this.populatePage()
    }).catch(error => {
      //handle error
    })
  }

  removeMovie(ev) {
    ev.preventDefault()
    const userId = this.props.uid
    const movie = ev.target.movieRemove.value
    const temp = this.state.movies[movie]
    this.state.movies[temp] = null
    base.remove(`users/${userId}/${movie}`).then(() => {
      this.removeItem(movie)
    }).catch(error => {
      //handle error
    });
  }

  render() {
    return (
      <div>
        <header className="w3-container w3-goldenrod">
          <h1 className="Center">Profile</h1>
        </header>
        <div className="Center">
          <button onClick={this.loadProfile}>Load Profile</button>
          <h1 className="myMovies"> My Movies </h1>
          <div>
          <form id="movie-form" onSubmit={this.removeMovie}>
            <div className="input-group">
              <label htmlFor="movieName">
                  <input
                    type="text"
                    ref='movie-name-ref'
                    className="input-group field"
                    name="movieRemove"
                    placeholder="Enter the name of movie to remove"
                    required
                    autoFocus
                  />
                  </label>
                  
            </div>
            <br></br>
            <input type="submit" value="Delete" onSubmit={this.removeMovie} />
          </form>
          </div>
          <div>
            <ul>
              {this.state.listItems}
            </ul>
          </div>
        </div>
      </div>  
    )
  }
}
export default Profile

