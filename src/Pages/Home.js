import React from 'react';
import { useAuth } from './AuthContext'; // Import useAuth
import Navbar from "./HomePage/Navbar";
import HomeCenter from "./HomePage/Home_Center";


const Home = () => {
    const { user } = useAuth();
    console.log(user)

    return (
        <div className="Home">
            <Navbar />
            <HomeCenter />
        </div>
    );
};

export default Home;