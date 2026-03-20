import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Web } from "@pnp/sp/presets/all";
import styles from "../Scrrd.module.scss";

import "bootstrap/dist/css/bootstrap.min.css";
import sonalogo from '../../assets/SonaPNGLogo.png';
import { SPComponentLoader } from '@microsoft/sp-loader';
SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css');
interface Props {
  currentSPContext: any;
}

const RiskRegisterDepartmentDashboard: React.FC<Props> = (props) => {

  const history = useHistory();

  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");


  // const [showModal, setShowModal] = useState(false);
  // const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ PnP v2 web instance
  const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);

  useEffect(() => {
    loadData();
  }, []);



  const getRiskColor = (v: number) => {
    if (v >= 163) return "#ff0000";   // High Risk - Red
    if (v >= 82) return "#ffc000";    // Medium Risk - Yellow
    if (v >= 1) return "#00b050";     // Low Risk - Green
    return "transparent";
  };

 const loadData = async () => {
  try {

    const currentUserEmail =
      props.currentSPContext.pageContext.user.email;

    // ✅ STEP 1: GET DATA
    const risks = await web.lists
      .getByTitle("RiskRequest")
      .items
      .select(
        "Id",
        "Title",
        "DepartmentID/Id", "DepartmentID/Title",
        "Classification",
        "AssetOwner/Id",
        "AssetOwner/Title",
        "AssetOwner/EMail"
      )
      .expand("AssetOwner", "DepartmentID")
      .orderBy("Created", false)
      .get();

    // ✅ STEP 2: FILTER MULTI USER
    const filteredRisks = risks.filter(r =>
      r.AssetOwner?.some((u: any) => u.EMail === currentUserEmail)
    );

    // ✅ STEP 3: GET DETAILS
    const details = await web.lists
      .getByTitle("RiskDetails")
      .items
      .select("Id", "RiskRequestID", "RiskValue")
      .get();

    // ✅ STEP 4: MERGE DATA
    const mergedData = filteredRisks.map(risk => {

      const related = details.filter(d => {
        if (!d.RiskRequestID) return false;

        const requestId =
          typeof d.RiskRequestID === "object"
            ? d.RiskRequestID.Id
            : d.RiskRequestID;

        return Number(requestId) === Number(risk.Id);
      });

      const totalRisk = related.reduce(
        (sum, x) => sum + (parseFloat(x.RiskValue) || 0),
        0
      );

      return {
        ...risk,
        RiskValue: totalRisk
      };
    });

    // ✅ FINAL SET
    setData(mergedData);

  } catch (error) {
    console.error("DASHBOARD LOAD ERROR:", error);
  }
};

  /* ============ SEARCH FILTER ============ */

  const filtered = data.filter(item => {

    const riskNo = (item.Title || "").toString().toLowerCase();
    const dept = (item.DepartmentID || "").toString().toLowerCase();
    const term = search.toLowerCase();

    return riskNo.includes(term) || dept.includes(term);
  });


  /* ============ PAGINATION LOGIC ============ */

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);




  return (

    <div className={`${styles.scrrd} row`}>
      {/* <div className="col-md-2 col-sm-12">
        <div className={styles.sidebar}>
          <div>
            <img src={sonalogo} className="logoimg" alt="" />
            <h3 className="risktitle">Sona Comstar</h3>
          </div>

          <ul className={`${styles.sidebarMenu} iconmenu`}>
            <li className={styles.active}><i className="fa fa-dashboard"></i> Department Dashboard</li>
            <li><i className="fa fa-check-circle" aria-hidden="true"></i> HOD Approval</li>
            <li><i className="fa fa-check-circle" aria-hidden="true"></i> ISCT Approval</li>
          </ul>
        </div>
      </div> */}
      <div className="col-md- col-sm-12">
        <div className={styles.main}>

          <div className={styles.header}>
            <h2 className={styles.headerTitle}>
              Risk Register Department Dashboard
            </h2>


          </div>
          <div className="submainsection">
            <div>
              <input
                className={styles.searchBox}
                placeholder="Search by Risk No or Department..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
              <div className="addbtnsection">
                <button
                  className={styles.addBtn}
                  onClick={() => history.push("/RiskRequestDetailsForm")}
                >
                  <i className="fa fa-plus" aria-hidden="true">Add Risk</i>
                </button>
              </div>
            </div>


            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Risk No.</th>
                  <th>Department</th>
                  <th>Owner</th>
                  <th>Classification</th>
                  <th>Risk Value</th>
                  <th>Risk Exposure</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>

                {currentItems.map((item, i) => (
                  <tr key={i}>
                    <td>{item.Title}</td>
                    <td>{item.DepartmentID?.Title}</td>
                    <td>
                      {item.AssetOwner
                        ? item.AssetOwner.map((u: any) => u.Title).join(", ")
                        : "-"}
                    </td>
                    <td>{item.Classification}</td>
                    <td>{item.RiskValue}</td>

                    {/* COLOR BOX ONLY */}
                    <td>
                      <div
                        className={styles.riskBox}
                        style={{
                          backgroundColor: getRiskColor(item.RiskValue)
                        }}
                      />
                    </td>

                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => history.push(`/RiskView/${item.Id}`)}
                    >
                      👁
                    </td>
                  </tr>
                ))}

                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center" }}>
                      No records found
                    </td>
                  </tr>
                )}

              </tbody>
            </table>

            {/* PAGINATION */}

            <div className={styles.pagination}>

              <button className="pgbtn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={`pgbtn ${currentPage === i + 1 ? styles.activePage : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
                // <button 
                //   key={i}
                //   className={currentPage === i + 1 ? styles.activePage : ""}
                //   onClick={() => setCurrentPage(i + 1)}
                // >
                //   {i + 1}
                // </button>
              ))}

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)} className="pgbtn"
              >
                Next
              </button>

            </div>
          </div>
        </div>
      </div>
      {/* SIDEBAR */}
      <div className={styles.sidebar} style={{ display: 'none' }}>
        <div>
          <img src={sonalogo} className="logoimg" alt="" />
          <h3 className="risktitle">Sona Comstar</h3>
        </div>

        <ul className={`${styles.sidebarMenu} iconmenu`}>
          <li className={styles.active}>
            <i className="fa fa-dashboard" /> Department Dashboard
          </li>

          <li>
            <i className="fa fa-check-circle" aria-hidden="true" /> View DashBoard
          </li>

          <li>
            <i className="fa fa-check-circle" aria-hidden="true" /> ISCT Approval
          </li>
        </ul>
      </div>

      {/* MAIN */}
      <div className={styles.main} style={{ display: 'none' }}>

        <div className={styles.header}>
          <h2 className={styles.headerTitle}>
            Risk Register Department Dashboard
          </h2>

          <button
            className={styles.addBtn}
            onClick={() => history.push("/RiskRequestDetailsForm")}
          >
            Add EMD
          </button>
        </div>

        <input
          className={styles.searchBox}
          placeholder="Search by Risk No or Department..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Risk No.</th>
              <th>Department</th>
              <th>Owner</th>
              <th>Classification</th>

              <th>View</th>
            </tr>
          </thead>
          <tbody>

            {currentItems.map((item, i) => (
              <tr key={i}>
                <td>{item.Title}</td>
                <td>{item.DepartmentID?.Title}</td>
                {/* <td>{item.AssetOwnerId}</td> */}
                <td>{item.AssetOwner?.Title || "-"}</td>
                <td>{item.Classification}</td>
                <td>{item.RiskValue}</td>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => history.push("/RiskView", { item })}
                >
                  👁
                </td>
              </tr>
            ))}




            {currentItems.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}

          </tbody>
        </table>

        {/* PAGINATION */}

        <div className={styles.pagination}>

          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? styles.activePage : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
};







export default RiskRegisterDepartmentDashboard;
