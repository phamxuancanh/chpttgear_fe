import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {


    return (
        <footer className="bg-gray-800 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">About Us</h3>
                        <p className="text-gray-400">Leading provider of high-performance computer components.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Customer Support</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white">FAQ</a></li>
                            <li><a href="#" className="hover:text-white">Shipping Info</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Legal</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white">Return Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-blue-400"><FaFacebook size={24} /></a>
                            <a href="#" className="hover:text-blue-400"><FaTwitter size={24} /></a>
                            <a href="#" className="hover:text-blue-400"><FaInstagram size={24} /></a>
                            <a href="#" className="hover:text-blue-400"><FaLinkedin size={24} /></a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};



