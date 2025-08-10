// src/routes/routes.tsx

import React from 'react';
import Home from '../pages/home/home';
import NotFound from '../pages/not-found/not-found';
import About from '../pages/about/about';

const wordWave = React.lazy(() => import('../features/word-wave'));

type RouteDef = { path: string; element: React.ComponentType };

const routes: RouteDef[] = [
    { path: '/', element: Home },
    { path: '/games/wordwave', element: wordWave },
    { path: '/about', element: About },
    { path: '*', element: NotFound },
];

export default routes;
