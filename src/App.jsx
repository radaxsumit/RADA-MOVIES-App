import {useEffect, useRef, useState} from 'react'
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite.js'
import Navbar from "./components/Navbar.jsx";

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [searchTerm, setSearchTerm] = useState('');

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();

      if(data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      console.log(movies);
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
      <main>
        <Navbar/>
        <div className="pattern"/>

        <div className='wrapper2 h-screen'>
          <header >
            <h1>Find <span className='bg-gradient-to-r from-red-600 to-red-400 from-40% bg-clip-text text-transparent'>Movies</span> You'll Enjoy Without the Hassle</h1>
            <h3>Starts at ₹149. Cancel at any time.</h3>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>
          <div className='absolute -bottom-20 -left-12 overflow-hidden'>
            <div className='h-36 w-[2000px] border-t-4 border-red-600 rounded-[80%/100px_100px_0_0] mask-l-from-50% mask-r-from-50%'></div>
          </div>
        </div>

        <div className="wrapper">
          {trendingMovies?.length > 0 && (
              <section className="trending">
                <h2>Trending Movies</h2>

                <ul>
                  {trendingMovies.map((movie, index) => (
                      <li key={movie.$id}>
                        <p>{index + 1}</p>
                        <img src={movie.poster_url} alt={movie.title}/>
                      </li>
                  ))}
                </ul>
              </section>
          )}
          <section className="all-movies">
            <h2 className="movie-header">
              All Movies
              <span className="view-all">View all</span>
            </h2>

            {isLoading ? (
                <Spinner/>  
            ) : errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
            ) : (
                <ul>
                  {movieList.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                  ))}
                </ul>
            )}
            <div className='h-20 bg-#030014 border-red-600'>
              <div className='absolute -bottom-20 -left-78 overflow-hidden'>
                <div className='h-36 w-[1900px] border-t-4 border-red-600 rounded-[20%/10px_10px_0_0] mask-l-from-50% mask-r-from-50%'></div>
              </div>
            </div>
          </section>
        </div>

        <footer className='text-white text-center'>
          <p> &#169; copyright@RADAMOVIES</p>
        </footer>
      </main>
  )
}

export default App