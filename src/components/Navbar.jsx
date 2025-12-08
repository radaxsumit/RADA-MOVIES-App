import React, {useEffect, useRef} from 'react';
import logo from '../assets/logo-removebg-preview.svg'
const Navitems = ['Home', 'Movies' , 'Tv & showes' , 'New & popular' , 'My List' ]
const Navbar = () => {
        const navRef = useRef();

        useEffect(() =>{
            window.addEventListener('scroll', ()=>{
                if(window.scrollY >= 80){
                    navRef.current.classList.add('nav-dark');
                } else {
                    navRef.current.classList.remove('nav-dark');
                }
            })
        },[])
    return (
        <div ref={navRef} className="flex justify-between px-16 fixed bg-zinc-900/30 mask-b-from-80% z-50 w-full">
                <img src={logo} alt="logo" className='size-33 h-18 object-cover '/>
                <ul className='text-white flex items-center gap-6 '>
                    {Navitems.map((item,index) => (
                        <li key={index} className='hover:scale-120 transition-all cursor-pointer duration-300 hover:text-red-500'>{item}</li>
                    ))}
                </ul>
            </div>
    )
}

export default Navbar;