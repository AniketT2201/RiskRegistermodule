




// import * as React from 'react';
// import { HashRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
// import type { IScrrdProps } from "./IScrrdProps";
// // import "./SelfAssessment.module.scss";

// import Sidebar from '../components/DashBoard/SideBar';
// import RiskRegisterDepartmentDashboard from './DashBoard/RiskRegisterDepartmentDashboard';
// import RiskRequestDetailsForm from './Page/RiskRequestDetailsForm';
// import RiskViewPage from './Page/RiskViewPage';

// export default class Scrrd extends React.Component<IScrrdProps> {
//   public render(): React.ReactElement<IScrrdProps> {
//     const {
//       currentSPContext
//     } = this.props;

//     const location = useLocation();

//     const hideSidebar =
//       location.pathname === "/RiskRequestDetailsForm"

//     return (
//       // <div>
//       //   <Router>
//       //     <Switch>
//       //       <Route exact path="/" render={() => <RiskRegisterDepartmentDashboard {...this.props} />} />
//       //       <Route exact path="/RiskRequestDetailsForm" render={() => <RiskRequestDetailsForm {...this.props} />} />
//       //       <Route path="/RiskView/:id" render={(props) => <RiskViewPage {...this.props} />}/>

//       //     </Switch>
//       //   </Router>
//       // </div>

//       <Router>
//         <div className="container-fluid" style={{ display: 'flex', width: '100%' }}>
//           {!hideSidebar && <Sidebar {...this.props} />}
//           <div className="main" style={{
//             width: hideSidebar ? "100%" : "calc(100% - 250px)",
//             transition: "width 0.3s ease"
//           }}>
//             <Switch>
//               <Route exact path="/" render={() => <RiskRegisterDepartmentDashboard {...this.props} />} />
//               <Route exact path="/RiskRequestDetailsForm" render={() => <RiskRequestDetailsForm {...this.props} />} />
//               <Route path="/RiskView/:id" render={(props) => <RiskViewPage {...this.props} />} />

//             </Switch>
//           </div>
//         </div>
//       </Router>
//     )
//   }
// }












import * as React from 'react';
import { HashRouter as Router, Switch, Route, useLocation } from 'react-router-dom';
import type { IScrrdProps } from "./IScrrdProps";
import Sidebar from '../components/DashBoard/SideBar';
import RiskRegisterDepartmentDashboard from './DashBoard/RiskRegisterDepartmentDashboard';
import RiskRequestDetailsForm from './Page/RiskRequestDetailsForm';
import RiskViewPage from './Page/RiskViewPage';

// 👇 Separate Layout Component
const Layout: React.FC<IScrrdProps> = (props) => {
  const location = useLocation(); // ✅ Now inside Router

  const hideSidebar =
    location.pathname.startsWith("/RiskRequestDetailsForm");
  return (
    <div className="container-fluid" style={{ display: 'flex', width: '100%' }}>

      {!hideSidebar && <Sidebar {...props} />}

      <div className="main" style={{
        width: hideSidebar ? "100%" : "calc(100% - 250px)",
        transition: "width 0.3s ease"
      }}>
        <Switch>
          <Route exact path="/" render={() => <RiskRegisterDepartmentDashboard {...props} />} />
          <Route exact path="/RiskRequestDetailsForm" render={() => <RiskRequestDetailsForm {...props} />} />
          <Route exact path="/RiskRequestDetailsForm" render={() => <RiskRequestDetailsForm {...props} />} />
          {/* <Route path="/RiskView/:id"  render={() => <RiskViewPage {...props} />} /> */}


          <Route
  path="/RiskView/:id"
  render={(routeProps) => (
    <RiskViewPage
      {...routeProps}
      currentSPContext={props.currentSPContext}
    />
  )}
/>
        </Switch>
      </div>
    </div>
  );
};


const Drr: React.FC<IScrrdProps> = (props) => {
  return (
    <Router>
      <Layout {...props} />
    </Router>
  );
};

export default Drr;









