http://localhost:3000//
document.addEventListener('DOMContentLoaded', function() {
    // Global variables to store movie details
    let movies = [];
    let selectedMovie = null;
  
    // Function to fetch movie details by ID
    function fetchMovieDetails(movieId) {
      fetch("https://localhost:3000/films + 1")
        .then(response => response.json())
        .then(movie => {
          selectedMovie = movie;
          
          // Update the HTML elements with the movie details
          document.getElementById('poster').src = movie.poster;
          document.getElementById('title').textContent = movie.title;
          document.getElementById('runtime').textContent = movie.runtime;
          document.getElementById('showtime').textContent = movie.showtime;
          updateAvailableTickets(2);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  
    // Function to update the number of available tickets
    function updateAvailableTickets() {
      const availableTickets = selectedMovie.capacity - selectedMovie.tickets_sold;
      document.getElementById('available-tickets').textContent = availableTickets;
  
      // Enable/disable the "Buy Ticket" button based on availability
      const buyTicketButton = document.getElementById('buy-ticket');
      if (availableTickets > 0) {
        buyTicketButton.disabled = false;
      } else {
        buyTicketButton.disabled = true;
      }
    }
  
    // Function to handle ticket purchase
    function buyTicket() {
      // Decrease the number of available tickets
      selectedMovie.tickets_sold++;
  
      // Update the movie details on the server
      fetch('http://localhost:3000/films/' + selectedMovie.id, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tickets_sold: selectedMovie.tickets_sold
        })
      })
      .then(response => response.json())
      .then(updatedMovie => {
        selectedMovie = updatedMovie;
        updateAvailableTickets(3);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  
    // Function to delete a film
    function deleteFilm(movieId) {
      fetch('http://localhost:3000/films/' + movieId, {
        method: 'DELETE'
      })
      .then(res=>res.json())
      
        // Remove the deleted film from the movies array
        movies = movies.filter(movie => movie.id !== movieId),
  
        // Remove the film from the HTML list
         movieId = 1;
        const filmItem = document.querySelector(`li[data-film-id="${movieId}"]`);

        filmItem.remove()
      
      .catch(error => {
        console.error('Error:', error);
      });
    } 
  
    // Function to render the movies list
    function renderMovies() {
      const filmsList = document.getElementById('films');
      filmsList.innerHTML = '';
  
      movies.forEach(movie => {
        const filmItem = document.createElement('li');
        filmItem.classList.add('film', 'item');
        filmItem.textContent = movie.title;
        filmItem.dataset.filmId = movie.id;
        if (movie.tickets_sold >= movie.capacity) {
          filmItem.classList.add('sold-out');
        }
        filmItem.addEventListener('click', function() {
          fetchMovieDetails(movie.id);
        });
  
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function(event) {
          event.stopPropagation();
         deleteFilm(movie.id);
        });
  
        filmItem.appendChild(deleteButton);
        filmsList.appendChild(filmItem);
      });
    }
  
    // Function to fetch all movies
    function fetchAllMovies() {
      fetch('/films')
        .then(response => response.json())
        .then(data => {
          movies = data;
          renderMovies();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  
    // Event listener for the "Buy Ticket" button
    const buyTicketButton = document.getElementById('buy-ticket');
    buyTicketButton.addEventListener('click', buyTicket);
  
    // Fetch all movies when the page loads
    fetchAllMovies();
  })
