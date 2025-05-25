import React from 'react';
import { Outlet } from 'react-router';

const Roots = () => {
    return (
        <div>
            <Outlet></Outlet>
        </div>
    );
};

export default Roots;