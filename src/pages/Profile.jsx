import React, { useEffect, useState } from "react";
import { findUserById } from "../routers/ApiRoutes";

export default function Profile() {
    const ls = JSON.parse(localStorage.getItem('persist:auth') || '{}');
    const currentUser = ls.currentUser
    const [user, setUser] = useState({});

    const getUser = async () => {
        try {
            const response = await findUserById(currentUser?.id);
            console.log(response.data);
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        if (currentUser) {
            getUser();
        }
    }, []);

    return (
        <div className="bg-background">
            <div className="font-bold">{user?.email}</div>
        </div>
    );
};