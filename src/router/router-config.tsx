import { createBrowserRouter, RouterProvider } from "react-router";
import App from "../App";
import Resume from "../resume/Resume";
import Blog from "../blog/Blog";
import Quantum from "../blog/Experiment/Quantum";
import BlackHoleSimulation from "../blog/Blackhole/BlackHoleSimulation";
import Black from "../blog/Blackhole/Black";
import PrivacyBravify from "../privacy-policy/PrivacyBravify";
import PrivacyXtofbauto from "../privacy-policy/PrivacyXtofbauto";


const routerObj  = createBrowserRouter(
    [
        {path:'/',
            element: <App/>
        },
        {path:'/resume',
            element: <Resume/>
        },
        {path:'/blog',
            element: <Blog/>,
            
        },
        {path:'/blog/experiment/quantum',
            element: <Quantum/>
        },
        {path:'/blog/experiment/blackhole',
            element: <BlackHoleSimulation/>
        },
        {path:'/blog/blackhole',
            element: <Black/>
        },
        {path:'/privacy-policy/bravify',
            element: <PrivacyBravify/>
        },
        {path:'/privacy-policy/xtofbauto',
            element: <PrivacyXtofbauto/>
        }

    
    ]
)

const RouterConfig = ()=>{
    return (
        <>
            <RouterProvider router={routerObj}/>
        </>
    )
}

export default RouterConfig;