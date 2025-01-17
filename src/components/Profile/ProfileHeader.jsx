import React from 'react'
import { FiEdit2, FiStar } from "react-icons/fi";

export default function ProfileHeader() {
    return (
        <div className="relative mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                    <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg group-hover:opacity-80 transition-opacity"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d";
                        }}
                    />
                    <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        <input type="file" className="hidden" accept="image/*" />
                        <FiEdit2 className="text-white text-2xl" />
                    </label>
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-gray-800">{formData.name}</h1>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                        <FiStar className="text-yellow-500" />
                        <span className="text-gray-600">{formData.membershipLevel} Member</span>
                        <span className="text-gray-600">|</span>
                        <span className="text-gray-600">{formData.loyaltyPoints} Points</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
