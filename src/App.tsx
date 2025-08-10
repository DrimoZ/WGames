// src/App.tsx

import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './shared/ui/layout/layout';
import routes from './routes/routes';
import './styles/app.module.scss';

const App: React.FC = () => {
    return (
        <Layout>
            <Suspense fallback={<div style={{padding:20}}>Loading…</div>}>
                <Routes>
                    {routes.map(({ path, element: Element }) => (
                        <Route key={path} path={path} element={<Element />} />
                    ))}
                </Routes>
            </Suspense>
        </Layout>
    );
};

export default App;
