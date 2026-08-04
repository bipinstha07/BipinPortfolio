import { createRoot } from 'react-dom/client'
import './index.css'
import { SpeedInsights } from '@vercel/speed-insights/react';

import RouterConfig from './router/router-config'



createRoot(document.getElementById('root')!).render(

    <>
    <RouterConfig/>
    <SpeedInsights />
    </>
 
)
