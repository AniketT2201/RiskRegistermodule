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
  const [rtpDetails, setRtpDetails] = useState<any[]>([]);


  const [showModal, setShowModal] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);


  const exposureColor = (v: number) => {
    if (v >= 163) return "#ff0000";   // High Risk
    if (v >= 82) return "#ffc000";    // Medium Risk
    if (v >= 1) return "#00b050";     // Low Risk
    return "transparent";
  };


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

      // MASTER
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
          "AssetOwner/Title"
        )
        .expand("AssetOwner")
        .get();

      // RISK DETAILS
      const det = await web.lists
        .getByTitle("RiskDetails")
        .items
        .filter(`RiskRequestID eq ${id}`)
        .select(
          "Id",
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
          "Timeline",
          "RTPDetails",
          "RiskOwner/Title",
          "Responsibility/Title"
        )
        .expand("RiskOwner", "Responsibility")
        .get();

      // RTP DETAILS (REVISED RISK)
      // const rtp = await web.lists
      //   .getByTitle("RTPDetails")
      //   .items
      //   .filter(`RiskRequestID eq ${id}`)
      //   .select(
      //     "RevisedC",
      //     "RevisedI",
      //     "RevisedA",
      //     "RevisedProbability",
      //     "RevisedImpact",
      //     "ResidualRisk",
      //     "ResidualRiskCategory",
      //     "DataRetention",
      //     "ISOApplicableControls",


      //     "RiskOwnerAcceptance/Title",
      //     "Created"
      //   )
      //   .expand("RiskOwnerAcceptance")
      //   .orderBy("Created", false)
      //   .get();


      const rtp = await web.lists
      .getByTitle("RTPDetails")
      .items
      .select(
        "Id",
        "RevisedC",
        "RevisedI",
        "RevisedA",
        "RevisedProbability",
        "RevisedImpact",
        "ResidualRisk",
        "ResidualRiskCategory",
        "DataRetention",
        "ISOApplicableControls",
        "RiskOwnerAcceptance/Title",
        "Created"
      )
      .expand("RiskOwnerAcceptance")
      .orderBy("Created", false)
      .get();

      setMaster(req);
      setDetails(det);
      setRtpDetails(rtp);

    } catch (e) {
      console.log("LOAD ERROR", e);
    }
  };

  if (!master) return <div>Loading...</div>;


  const selectedRisk =
    selectedRowIndex !== null ? details[selectedRowIndex] : null;

  const selectedRtp =
    rtpDetails.length > 0 ? rtpDetails[0] : null;


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
                <td>{d.RiskResponse}</td>
                <td>{d.RiskResponse}</td>
                <td>{d.RTPDetails}</td>

                <td>
                  <button
                    onClick={() => {
                      setSelectedRowIndex(i);
                      setShowModal(true);
                    }}
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



      {showModal && selectedRowIndex !== null && (
        <div className="modalOverlay popupbox">
          <div className="modalBoxLarge">
            <h3>view Risk</h3>
            <div className="popupinnerbox">


              {/* ================= CURRENT RISK ================= */}

              <div className="popupSectionTitle">Current Risk</div>
              <div className="row mb-10">
                <div className="col-md-6 col-sm-12">
                  <div className="row">
                    <div className="col-md-6">
                      <label>Risk Description</label>
                      <textarea
                        className="form-control h-140"
                        value={selectedRisk?.RiskDescription || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label>Existing Controls</label>
                      <textarea
                        className="form-control h-140"
                        value={selectedRisk?.ExistingControls || ""}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="row">
                    <div className="col-md-1 col-sm-1 w-14">
                      <label>C</label>
                      <input
                        className="form-control"
                        value={selectedRisk?.Confidentiality || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-1 col-sm-1 w-14">
                      <label>I</label>
                      <input
                        className="form-control"
                        value={selectedRisk?.Integrity || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-1 col-sm-1 w-14">
                      <label>A</label>
                      <input
                        className="form-control"
                        value={selectedRisk?.Availability || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-1 col-sm-1 w-14">
                      <label>Probability</label>
                      <input
                        className="form-control"
                        value={selectedRisk?.Probability || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-1 col-sm-1 w-14">
                      <label>Impact</label>
                      <input
                        className="form-control"
                        value={selectedRisk?.Impact || ""}
                        readOnly
                      />
                    </div>
                    <div className="col-md-1 col-sm-1 w-14">
                      <label>Risk Value</label>
                      <div className="valueBox">
                        {selectedRisk?.RiskValue}
                      </div>
                    </div>
                    <div className="col-md-1 col-sm-1 w-14">
  <label>Risk Exposure</label>
  <div
    className="valueBox"
    style={{
      background: exposureColor(Number(selectedRisk?.RiskValue || 0))
    }}
  >
    &nbsp;
  </div>
</div>

                  </div>
                </div>


              </div>



              {/* ===== Risk Action Table (below exposure) ===== */}



              {/* ===== Risk Action Table (below exposure) ===== */}
              {/* <div className="row mt-3"> <div className="col-md-4 col-sm-12"> <label>Risk Owner</label> <PeoplePicker context={peoplePickerContext} personSelectionLimit={1} principalTypes={[PrincipalType.User]} ensureUser defaultSelectedUsers={rows[selectedRowIndex]?.riskOwnerEmail ? [rows[selectedRowIndex].riskOwnerEmail] : []} onChange={async (items) => { if (items.length === 0) return; const user = await sp.web.ensureUser(items[0].secondaryText); updateRevised(selectedRowIndex, "riskOwnerId", user.data.Id); updateRevised(selectedRowIndex, "riskOwnerName", items[0].text); updateRevised(selectedRowIndex, "riskOwnerEmail", items[0].secondaryText); }} /> </div> <div className="col-md-8 col-sm-12"> <label>Risk Treatment Plan</label> <textarea className="form-control" rows={3} value={rows[selectedRowIndex].riskTreatmentPlan || ""} onChange={e => updateRevised(selectedRowIndex, "riskTreatmentPlan", e.target.value)} /> </div> </div> */}



              <div className="row mt-2">

                {/* <div className="col-md-4 col-sm-12">
                                            <label>Responsibility</label>

                                            <PeoplePicker
                                                context={peoplePickerContext}
                                                personSelectionLimit={1}
                                                principalTypes={[PrincipalType.User]}
                                                ensureUser
                                                defaultSelectedUsers={
                                                    rows[selectedRowIndex]?.responsibilityEmail
                                                        ? [rows[selectedRowIndex].responsibilityEmail]
                                                        : []
                                                }
                                                onChange={async (items) => {

                                                    if (items.length === 0) {
                                                        updateRevised(selectedRowIndex, "responsibilityId", undefined);
                                                        updateRevised(selectedRowIndex, "responsibilityName", "");
                                                        updateRevised(selectedRowIndex, "responsibilityEmail", "");
                                                        return;
                                                    }

                                                    const user = await sp.web.ensureUser(items[0].secondaryText);

                                                    updateRevised(selectedRowIndex, "responsibilityId", user.data.Id);
                                                    updateRevised(selectedRowIndex, "responsibilityName", items[0].text);
                                                    updateRevised(selectedRowIndex, "responsibilityEmail", items[0].secondaryText);

                                                }}
                                            />
                                        </div> */}

                <div className="row mt-2">

                  <div className="col-md-4">
                    <label>Timeline</label>
                    <input
                      className="form-control"
                      value={selectedRisk?.Timeline || ""}
                      readOnly
                    />
                  </div>

                  <div className="col-md-4">
                    <label>Risk Owner</label>
                    <input
                      className="form-control"
                      value={selectedRisk?.RiskOwner?.Title || ""}
                      readOnly
                    />
                  </div>

                  <div className="col-md-4">
                    <label>Responsibility</label>
                    <input
                      className="form-control"
                      value={selectedRisk?.Responsibility?.Title || ""}
                      readOnly
                    />
                  </div>

                </div>

                <div className="row mt-2">

                  <div className="col-md-12">
                    <label>RTPDetails</label>
                    <textarea
                      className="form-control"
                      value={selectedRisk?.RTPDetails || ""}
                      readOnly
                    />
                  </div>

                </div>

              </div>














              {/* ================= REVISED RISK ================= */}

              <div className="popupSectionTitle">Revised Risk</div>
              <div className="table-responsive">
                <table className="table editdatatable">
                  <thead>
                    <tr>
                      <th>
                        Revised C
                      </th>
                      <th>
                        Revised I
                      </th>

                      <th>
                        Revised A
                      </th>
                      <th>
                        Revised Probability
                      </th>
                      <th>
                        Resedvi Impact
                      </th>
                      <th>
                        Residual Risk
                      </th>
                      <th>
                        Residual Risk Category
                      </th>
                      <th>
                        Risk Owner Acceptance
                      </th>
                      <th>
                        Data Retention
                      </th>
                      <th>
                        ISO Applicable Controls
                      </th>
                      <th>
                        Add
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          className="form-control"
                          value={selectedRtp?.RevisedC || ""}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={selectedRtp?.RevisedI || ""}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={selectedRtp?.RevisedA || ""}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={selectedRtp?.RevisedProbability || ""}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={selectedRtp?.RevisedImpact || ""}
                          readOnly
                        />
                      </td>
                      <td>
                        <div className="valueBox">
                          {selectedRtp?.ResidualRisk || ""}
                        </div>
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={selectedRtp?.ResidualRiskCategory || ""}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={selectedRtp?.RiskOwnerAcceptance?.Title || ""}
                          readOnly
                        />


                        {/* ✅ OWNER ACCEPTANCE PEOPLE PICKER */}
                        <div className="col-md-4 col-sm-12">
                          {/* <label>Owner Acceptance</label> */}

                          {/* <PeoplePicker
                                                                context={peoplePickerContext}
                                                                personSelectionLimit={1}
                                                                principalTypes={[PrincipalType.User]}
                                                                ensureUser
                                                                defaultSelectedUsers={
                                                                    ownerAcceptanceEmail ? [ownerAcceptanceEmail] : []
                                                                }
                                                                onChange={async (items) => {

                                                                    if (!items.length) {
                                                                        setOwnerAcceptanceId(null);
                                                                        setOwnerAcceptanceName("");
                                                                        setOwnerAcceptanceEmail("");
                                                                        return;
                                                                    }

                                                                    const email = items[0].secondaryText;
                                                                    const user = await sp.web.ensureUser(email);

                                                                    setOwnerAcceptanceId(user.data.Id);
                                                                    setOwnerAcceptanceName(items[0].text);
                                                                    setOwnerAcceptanceEmail(email);

                                                                }}
                                                            /> */}



                          {/* <PeoplePicker
                                                                context={peoplePickerContext}
                                                                personSelectionLimit={1}
                                                                principalTypes={[PrincipalType.User]}
                                                                ensureUser
                                                                defaultSelectedUsers={
                                                                    rows[selectedRowIndex]?.ownerAcceptanceEmail
                                                                        ? [rows[selectedRowIndex].ownerAcceptanceEmail]
                                                                        : []
                                                                }
                                                                onChange={async (items) => {

                                                                    if (!items.length) {
                                                                        updateRevised(selectedRowIndex, "ownerAcceptanceId", null);
                                                                        updateRevised(selectedRowIndex, "ownerAcceptanceName", "");
                                                                        updateRevised(selectedRowIndex, "ownerAcceptanceEmail", "");
                                                                        return;
                                                                    }

                                                                    const email = items[0].secondaryText;
                                                                    const user = await sp.web.ensureUser(email);

                                                                    //updateRevised(selectedRowIndex, "ownerAcceptanceId", user.data.Id);
                                                                    //updateRevised(selectedRowIndex, "ownerAcceptanceName", items[0].text);
                                                                    updateRevised(selectedRowIndex, "ownerAcceptanceEmail", email);
                                                                }}
                                                            /> */}

                        </div>                                            </td>
                      <td>
                        <input
                          className="form-control"
                          value={selectedRtp?.DataRetention || ""}
                          readOnly
                        />
                      </td>
                      <td>
                        <input
                          className="form-control"
                          value={selectedRtp?.ISOApplicableControls || ""}
                          readOnly
                        />
                      </td>
                      {/* <td>
                                                        <button className={styles.addBtn} onClick={() => addToHistory(selectedRowIndex)}>
                                                            ADD
                                                        </button>

                                                    </td> */}

                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="">

                <div className="historySection">
                  <h4>Revised History</h4>
                  <div className="popupSectionTitle">Revised History</div>
                  <div className="table-responsive tblbox">
                    <table style={{ border: "1px solid black", width: "100%" }}>




                      <thead>
                        <tr>
                          <th>S.N</th>
                          <th>Revised C</th>
                          <th>Revised I</th>
                          <th>Revised A</th>
                          <th>Revised CIA</th>
                          <th>Probability</th>
                          <th>Impact</th>
                          <th>Residual Risk</th>
                          <th>Category</th>
                          <th>Owner Acceptance</th>
                          <th>Data Retention</th>
                          <th>ISO Controls</th>
                          <th>Date</th>
                        </tr>
                      </thead>

                      <tbody>
                        {rtpDetails.map((h, i) => (
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{h.RevisedC}</td>
                            <td>{h.RevisedI}</td>
                            <td>{h.RevisedA}</td>
                            <td>{h.RevisedC * h.RevisedI * h.RevisedA}</td>
                            <td>{h.RevisedProbability}</td>
                            <td>{h.RevisedImpact}</td>
                            <td>{h.ResidualRisk}</td>
                            <td>{h.ResidualRiskCategory}</td>
                            <td>{h.RiskOwnerAcceptance?.Title}</td>
                            <td>{h.DataRetention}</td>
                            <td>{h.ISOApplicableControls}</td>
                            <td>{new Date(h.Created).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                </div>

              </div>

              <div className="popupButtons">


                <button
                  className="btn btn-secondary mb-3"
                  onClick={() => history.goBack()}
                >
                  ⬅ Back
                </button>


              </div>

            </div>
          </div>
        </div>
      )}
    </div>


  );
};

export default RiskViewPage;