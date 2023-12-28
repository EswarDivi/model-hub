import React from "react";
import { useAuth } from '../AuthContext';
import { AiOutlineUpload, AiOutlineSearch, AiOutlineEdit } from "react-icons/ai"; // Icons for visual appeal

const HomeCenter = () => {
    const { user } = useAuth();

    const testimonials = [
        {
            name: "Eswar Divi",
            comment: "ModelHub has revolutionized the way I work with AI models. The community is fantastic!",
            role: "Data Scientist"
        },
        {
            name: "Rahul G",
            comment: "As a beginner in machine learning, ModelHub's resources have been invaluable to my learning journey.",
            role: "ML Enthusiast"
        },
        {
            name: "Pranav Kumaar",
            comment: "I love the diversity of models available. It's a great platform for collaboration and innovation.",
            role: "AI Researcher"
        },
        {
            name: "Harsha Dabbara",
            comment: "Simply Awesome. I've been able to find models for all my projects.",
            role: "AI Researcher"
        }
    ];

    return (
        <div className="Home_Center p-6 bg-gray-900">
            <div className="text-center mb-10">
                <h1 className="text-5xl font-bold text-blue-700 mb-4">
                    {user ? `Welcome back, ${user.username}!` : 'Welcome to ModelHub'}
                </h1>
                <p className="text-md text-gray-100">
                    Your one-stop hub for AI and Machine Learning models.
                </p>
            </div>

            <section className="mb-10">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Explore Our Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="feature-card bg-gray-700 p-6 rounded-lg shadow-md">
                        <AiOutlineUpload className="text-blue-500 text-4xl mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Upload Models</h3>
                        <p>Share your latest AI models with a global community. Get feedback and collaborate.</p>
                    </div>

                    <div className="feature-card bg-gray-700 p-6 rounded-lg shadow-md">
                        <AiOutlineSearch className="text-blue-500 text-4xl mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Discover Models</h3>
                        <p>Browse through a diverse range of models. Filter by category, popularity, or recency.</p>
                    </div>

                    <div className="feature-card bg-gray-700 p-6 rounded-lg shadow-md">
                        <AiOutlineEdit className="text-blue-500 text-4xl mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Edit Profile</h3>
                        <p>Customize your profile to showcase your skills and projects. Connect with peers.</p>
                    </div>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Testimonials</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-card bg-gray-700 p-6 rounded-lg shadow-md">
                            <blockquote className="text-gray-200 italic mb-4">{testimonial.comment}</blockquote>
                            <div className="text-gray-300">{testimonial.name} - <span className="text-blue-400">{testimonial.role}</span></div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Getting Started</h2>
                <div className="flex flex-col items-center">
                    <ul className="list-disc list-inside text-gray-200 text-lg">
                        <li className="mb-2"><strong className="text-blue-500">To upload a model:</strong> Go to 'Models', then 'Upload Model'. Share your work with our community.</li>
                        <li className="mb-2"><strong className="text-blue-500">To explore models:</strong> Click on 'Explore' to browse models. Use filters for a tailored experience.</li>
                        <li><strong className="text-blue-500">To edit your profile:</strong> Click your profile icon, select 'Edit Profile' to update your information.</li>
                    </ul>
                    <a href="https://esward.notion.site/How-it-Works-cbacbbdb50b4461d89aaf581c2eb9833">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 center">
                            Learn More
                        </button>
                    </a>
                </div>
            </section>


        </div>
    );
}

export default HomeCenter;
