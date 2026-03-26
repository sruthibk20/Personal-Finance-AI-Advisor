import Sidebar from "./Sidebar";

function Layout({children}){

return(

<div style={{
  display: "flex",
  height: "100vh",
  overflow: "hidden"
}}>
  
  <Sidebar />

  <div className="layout-main">
    <div className="layout-inner">
      {children}
    </div>
  </div>

</div>

);

}

export default Layout;
