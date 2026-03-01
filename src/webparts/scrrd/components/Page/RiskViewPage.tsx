import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Web } from "@pnp/sp/presets/all";

interface Props {
  currentSPContext: any;
}

const RiskViewPage: React.FC<Props> = (props) => {

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);

  const [master, setMaster] = useState<any>(null);
  const [details, setDetails] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [id]);

  // const loadData = async () => {
  //   try {

  //     // ✅ Master record
  //     const req = await web.lists
  //       .getByTitle("RiskRequest")
  //       .items
  //       .getById(Number(id))
  //       .get();

  //     // ✅ Detail records
  //     const det = await web.lists
  //       .getByTitle("RiskDetails")
  //       .items
  //       .filter(`RiskRequestID eq '${id}'`)
  //       .get();

  //     setMaster(req);
  //     setDetails(det);

  //   } catch (e) {
  //     console.error("VIEW LOAD ERROR", e);
  //   }
  // };

  const loadData = async () => {
    try {

      // ✅ MASTER (expand people picker)
      const req = await web.lists
        .getByTitle("RiskRequest")
        .items
        .getById(Number(id))
        .select(
          "Id",
          "Title",
          "Department",
          "Classification",
          "InformationAsset",
          "Sharing",
          "InformationType",
          "AssetOwner/Title",
          "AssetOwner/EMail"
        )
        .expand("AssetOwner")
        .get();

      // ✅ DETAILS — load EVERYTHING user filled
      const det = await web.lists
        .getByTitle("RiskDetails")
        .items
        .filter(`RiskRequestID eq '${id}'`)
        .select(
          "Vulnerability",
          "RiskDescription",
          "ExistingControls",
          "Confidentiality",
          "Integrity",
          "Availability",
          "CIAMultipliedValue",
          "Probability",
          "Impact",
          "RiskValue",
          "RiskResponse",
          "RTPDetails",
          "Timeline",
          "RiskOwner/Title",
          "Responsibility/Title"
        )
        .expand("RiskOwner,Responsibility")
        .get();

      setMaster(req);
      setDetails(det);

    } catch (e) {
      console.error("VIEW LOAD ERROR", e);
    }
  };

  if (!master) return <div>Loading...</div>;
  return (
    <div style={{ padding: 20 }}>

      <h2>Risk No : {master.Title}</h2>

      <p><b>Department:</b> {master.Department}</p>
      <p><b>Asset Owner:</b> {master.AssetOwner?.Title}</p>

      <p><b>Information Asset:</b> {master.InformationAsset}</p>

      <p><b>Information Classification:</b> {master.Classification}</p>
      <p><b>Sharing:</b> {master.Sharing}</p>
      <p><b>Information Type:</b> {master.InformationType}</p>

      {/* <h3 style={{ marginTop: 20 }}>Risk Details</h3> */}

      <h3>Risk Details</h3>

      <div style={{ overflowX: "auto", width: "100%" }}>
        <table width="100%" cellPadding={6} style={{ minWidth: "1400px" }}>
          <thead>
            <tr>
              {/* <th>Description</th> */}
              <th>Vulnerability</th>
              <th>RiskDescription</th>
              <th>Existing Controls</th>
              <th>C</th>
              <th>I</th>
              <th>A</th>
              <th>CIA</th>
              <th>Probability(P)</th>
              <th>Impact(IP)</th>
              <th>RiskValue(CIxIP)</th>
              <th>Risk Exposure</th>
              <th>Risk Response</th>
              <th>RTP</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {details.map((d, i) => (
              <tr key={i}>
                {/* <td>{d.Description}</td> */}

                <td>{d.Vulnerability}</td>
                <td>{d.RiskDescription}</td>
                <td>{d.ExistingControls}</td>
                <td>{d.Confidentiality}</td>
                <td>{d.Integrity}</td>
                <td>{d.Availability}</td>
                <td>{d.CIAMultipliedValue}</td>
                <td>{d.Probability}</td>
                <td>{d.Impact}</td>
                <td>{d.RiskValue}</td>
                <td>{d.RiskValue}</td>
                <td>{d.RiskResponse}</td>
                <td>{d.RTPDetails}</td>

                <td>
                  <button
                    onClick={() => history.push(`/RiskView/${d.Id}`)}
                  >
                    👁
                  </button>
                </td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <br />

      <button onClick={() => history.goBack()}>
        ⬅ Back
      </button>

    </div>
  );
};

export default RiskViewPage;