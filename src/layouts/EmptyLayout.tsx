import React from 'react';
import {RouteConfigComponentProps, renderRoutes} from "react-router-config";

// class EmptyLayout extends React.PureComponent<RouteConfigComponentProps> {
//     render() {
//         const {route = {routes: []}} = this.props;
//         const routes = route.routes || [];
//         // console.log(this.props)
//         return (
//             <>
//                 {renderRoutes(routes)}
//             </>
//         )
//     }
// }
const EmptyLayout: React.FC<RouteConfigComponentProps> = (props) => {
    const {route = {routes: []}} = props;
    const routes = route.routes || [];
    return (
        <>
            {renderRoutes(routes)}
        </>
    );
};

export default EmptyLayout;
