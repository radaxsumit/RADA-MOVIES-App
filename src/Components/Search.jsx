import React from 'react'
import {CiSearch} from "react-icons/ci";
const Search = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="search">
                <CiSearch color='#ffffff' size={26}/>

                <input
                    type="text"
                    placeholder="Search through thousands of movies"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
        </div>
    )
}
export default Search
