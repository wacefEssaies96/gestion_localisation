import { memo, Fragment, lazy } from "react";
import { Outlet } from "react-router-dom";
// Import selectors & action from setting store
import * as SettingSelector from "../../store/setting/selectors";
// Redux Selector / Action
import { useSelector } from "react-redux";

// header
const Header = lazy(() => import("../../components/partials/dashboard/HeaderStyle/header"))
//subheader
const SubHeader = lazy(()=>import("../../components/partials/dashboard/HeaderStyle/sub-header"))
//sidebar
const Sidebar = lazy(()=>import("../../components/partials/dashboard/SidebarStyle/sidebar"))
//footer
const Footer = lazy(()=>import("../../components/partials/dashboard/FooterStyle/footer"))


const Default = memo((props) => {
  const appName = useSelector(SettingSelector.app_name);

  return (
    <Fragment>
      <Sidebar app_name={appName} />
      <main className="main-content">
        <div className="position-relative">
          <Header />
          <SubHeader />
        </div>
        <div className="py-0 conatiner-fluid content-inner mt-n5">
          <Outlet />
        </div>
        <Footer />
      </main>
    </Fragment>
  );
});

Default.displayName = "Default";
export default Default;
