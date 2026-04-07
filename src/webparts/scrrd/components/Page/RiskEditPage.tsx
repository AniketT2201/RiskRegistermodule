import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Web } from "@pnp/sp/presets/all";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { PeoplePicker, PrincipalType, IPeoplePickerContext }
    from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { sp } from "@pnp/sp/presets/all";
import styles from "../Scrrd.module.scss";
import SPCRUDOPS from "../Service/DAL/spcrudops";
import { IScrrdProps } from "../IScrrdProps";


interface IMaster {
  Id: number;
  Title: string;
  DepartmentID?: { Title: string };
  AssetOwner?: { Title: string };
  Classification?: string;
  InformationAsset?: string;
  Sharing?: string;
  InformationType?: string;
}

interface IDetails {
  Id?: any;
  Vulnerability?: string;
  RiskDescription?: string;
  ExistingControls?: string;
  Confidentiality?: number;
  Integrity?: number;
  Availability?: number;
  CIAMultipliedValue?: number;
  Probability?: number;
  Impact?: number;
  RiskValue?: number;
  RiskResponse?: string;
  Timeline?: string;
  RTPDetails?: string;
  RiskOwner?: { Title: string, Email: string, Id: any};
  Responsibility?: { Title: string };
  riskOwnerId?: number;
    riskOwnerName?: string;
    riskOwnerEmail?: string;

    responsibilityId?: number;
    responsibilityName?: string;
    responsibilityEmail?: string;

    riskTreatmentPlan?: string;
    timeline?: string;


    assetOwnerId?: number;
    assetOwnerName?: string;
    assetOwnerEmail?: string;

    ownerAcceptanceId?: number | null;
    ownerAcceptanceName?: string;
    ownerAcceptanceEmail?: string;

    residualCategory?: string;
    dataRetention?: string;
    isoControls?: string;

    cia: number;
    probability: number;
    impact: number;
    riskValue: number;

    // 🔽 NEW FOR POPUP
    revisedC?: number;
    revisedI?: number;
    revisedA?: number;
    revisedCIA?: number;
    revisedProbability?: number;
    revisedImpact?: number;
    residualRisk?: number;

    history?: {
        revisedC: number;
        revisedI: number;
        revisedA: number;
        revisedCIA: number;
        revisedProbability: number;
        revisedImpact: number;
        residualRisk: number;
        residualCategory: string;

        ownerAcceptanceId?: number;
        ownerAcceptanceName?: string;
        ownerAcceptance: string;
        dataRetention: string;
        isoControls: string;
        date: string;
    }[];
}

interface IRTP {
  RiskRequestID?: number;
  RevisedC?: number;
  RevisedI?: number;
  RevisedA?: number;
  RevisedProbability?: number;
  RevisedImpact?: number;
  ResidualRisk?: number;
  ResidualRiskCategory?: string;
  DataRetention?: string;
  ISOApplicableControls?: string;
  RiskOwnerAcceptance?: { Title: string };
  Created?: string;
}



interface Props {
  currentSPContext: WebPartContext;
}

interface RiskRow {
  master: IMaster;
  details: IDetails[];

}

const RiskEditPage: React.FC<Props> = (props) => {

  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { currentSPContext } = props;

  const web = Web(props.currentSPContext.pageContext.web.absoluteUrl);


  const [master, setMaster] = useState<IMaster | null>(null);
  const [details, setDetails] = useState<IDetails[]>([]);
  const [rtpDetails, setRtpDetails] = useState<IRTP[]>([]);


  const [showModal, setShowModal] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const [rows, setRows] = useState<RiskRow>({
    master: {} as IMaster,
    details: []
    });

  const peoplePickerContext: IPeoplePickerContext = {
        absoluteUrl: currentSPContext.pageContext.web.absoluteUrl,
        spHttpClient: currentSPContext.spHttpClient as any,
        msGraphClientFactory: currentSPContext.msGraphClientFactory as any
    };


  const exposureColor = (v: number): string => {
    if (v >= 163) return "#ff0000";   // High Risk
    if (v >= 82) return "#ffc000";    // Medium Risk
    if (v >= 1) return "#00b050";     // Low Risk
    return "transparent";
  };

  // ===== UPDATE & AUTO CALC =====
    const updateRow = (i: number, field: string, value: any) => {
        const copy = {...rows};
        (copy.details[i] as any)[field] = value;

        const c = copy.details[i].Confidentiality || 0;
        const ii = copy.details[i].Integrity || 0;
        const a = copy.details[i].Availability || 0;
        const p = copy.details[i].Probability || 0;
        const im = copy.details[i].Impact || 0;
        copy.details[i].cia = c * ii * a;
        copy.details[i].RiskValue = copy.details[i].cia * p * im;

        setRows(copy);
    };

    // add today=====================
    const updateRevised = (i: number, field: string, value: any) => {
        const copy = {...rows};
        (copy.details[i] as any)[field] = value;

        const rc = Number(copy.details[i].revisedC || 0);
        const ri = Number(copy.details[i].revisedI || 0);
        const ra = Number(copy.details[i].revisedA || 0);
        const rp = Number(copy.details[i].revisedProbability || 0);
        const rim = Number(copy.details[i].revisedImpact || 0);

        copy.details[i].revisedCIA = rc * ri * ra;
        copy.details[i].residualRisk = copy.details[i].revisedCIA * rp * rim;
        setRows(copy);
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

  const loadData = async (): Promise<void> => {
    try {

      // MASTER
      const req = await web.lists
        .getByTitle("RiskRequest")
        .items
        .getById(Number(id))
        .select(
          "Id",
          "Title",
          "DepartmentID/Id", "DepartmentID/Title",
          "Classification",
          "InformationAsset",
          "Sharing",
          "InformationType",
          "AssetOwner/Title,AssetOwner/Id"
        )
        .expand("DepartmentID", "AssetOwner")
        .get();
      console.log(req);

      // RISK DETAILS
      const det = await web.lists
        .getByTitle("RiskDetails")
        .items
        .filter(`RiskRequestID eq '${id}'`)
        .select(
          "*",
          "Id",
          "RiskRequestID",
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
          "RiskOwner/Id, RiskOwner/Title , RiskOwner/EMail",
          "Responsibility/Id, Responsibility/Title, Responsibility/EMail"
        )
        .expand("RiskOwner", "Responsibility")
        .getAll();



      const rtp = await web.lists
        .getByTitle("RTPDetails")
        .items
        .select(
          "Id",
          "RiskRequestID",
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
        .getAll();

      const filtereddata = rtp.filter(
        (m) => Number(m.RiskRequestID) === Number(id)
      );
      console.log(det[0]);
      const mappedDetails = det.map((d) => ({
        ...d,
        // ✅ People field mapping
        responsibilityId: d.Responsibility?.Id,
        responsibilityName: d.Responsibility?.Title,
        responsibilityEmail: d.Responsibility?.EMail,
        riskOwnerEmail: d.RiskOwner?.EMail,
        riskOwnerId: d.RiskOwner?.Id,
        riskOwnerName: d.RiskOwner?.Title
      }));
      setMaster(req);
      setDetails(mappedDetails);
      setRtpDetails(filtereddata);
      setRows({
        master: req,
        details: mappedDetails
        });

    } catch (e) {
      console.log("LOAD ERROR", e);
    }
  };

  if (!master) return <div>Loading...</div>;


  const selectedRisk =
    selectedRowIndex !== null ? details[selectedRowIndex] : null;

  const selectedRtp =
    rtpDetails.length > 0 ? rtpDetails[0] : null;

    const addToHistory = (i: number) => {

        const copy = {...rows};
        const r: any = copy.details[i];

        if (!r.history) r.history = [];

        r.history.push({
            revisedC: r.revisedC || 0,
            revisedI: r.revisedI || 0,
            revisedA: r.revisedA || 0,
            revisedCIA: r.revisedCIA || 0,
            revisedProbability: r.revisedProbability || 0,
            revisedImpact: r.revisedImpact || 0,
            residualRisk: r.residualRisk || 0,
            residualCategory: r.residualCategory || "",
            ownerAcceptanceId: r.ownerAcceptanceId || null,
            ownerAcceptanceName: r.ownerAcceptanceName || "",
            dataRetention: r.dataRetention || "",
            isoControls: r.isoControls || "",
            date: new Date().toLocaleDateString()
        });

        // 🔥 RESET SECTION PROPERLY
        copy.details[i] = {
            ...r,
            revisedC: undefined,
            revisedI: undefined,
            revisedA: undefined,
            revisedProbability: undefined,
            revisedImpact: undefined,
            revisedCIA: 0,
            residualRisk: 0,
            residualCategory: "",
            ownerAcceptanceId: null,
            ownerAcceptanceName: "",
            ownerAcceptanceEmail: "",
            dataRetention: "",
            isoControls: ""
        };

        setRows(copy);
    };

    const savePopupChanges = async () => {
      const spCrud = await SPCRUDOPS();
      if (selectedRowIndex === null) return;

      const r = rows.details[selectedRowIndex];

      if (!r.history || r.history.length === 0) {
        alert("No revised history to save");
        return;
      }

      // ✅ STEP 1: Update RiskDetails (FIRST AWAIT)
      try {
        await web.lists.getByTitle("RiskDetails").items
          .getById(Number(r.Id))
          .update({
            RiskOwnerId: r.riskOwnerId || null,
            ResponsibilityId: r.responsibilityId || null,
            RTPDetails: r.RTPDetails || "",
            Timeline: r.Timeline || "",
          });

      } catch (error) {
        console.error("RiskDetails Update Failed", error);
        alert("Failed to update Risk Details ❌");
        return; // 🔥 STOP EXECUTION HERE
      }

      // ✅ STEP 2: Insert RTP History
      try {
        for (const h of r.history) {
          const colourCode = exposureColor(h.residualRisk);
          await web.lists
            .getByTitle("RTPDetails")
            .items.add({
              Title: "RTP_" + Date.now(),
              Vulnerability: r.Vulnerability || null,
              ExistingControls: r.ExistingControls || null,
              RiskRequestID: id || null,

              RevisedC: h.revisedC?.toString() || null,
              RevisedI: h.revisedI?.toString() || null,
              RevisedA: h.revisedA?.toString() || null,
              RevisedCIAScore: h.revisedCIA?.toString() || null,
              RevisedProbability: h.revisedProbability?.toString() || null,
              RevisedImpact: h.revisedImpact?.toString() || null,
              ResidualRisk: h.residualRisk?.toString() || null,

              ResidualRiskCategory: h.residualCategory || null,
              DataRetention: h.dataRetention || null,
              ISOApplicableControls: h.isoControls || null,

              RiskOwnerAcceptanceId: h.ownerAcceptanceId || null
            });
        }

        alert("All Revised History Saved Successfully ✅");
        setShowModal(false);
        history.push("/");

      } catch (error) {
        console.error("RTP Insert Failed", error);
        alert("Risk Details saved, but RTP history failed ❌");
      }
    };


  return (
    <div style={{ padding: 20 }}>

      <div className="riskViewCard">

        <h2 className="riskTitle">Risk Request Details</h2>

        <div className="riskFormGrid">

          <div className="riskField">
            <label>Risk No</label>
            <div className="riskValue">{master.Title}</div>
          </div>

          <div className="riskField">
            <label>Department</label>
            <div className="riskValue">{master.DepartmentID?.Title}</div>
          </div>

          <div className="riskField">
            <label>Asset Owner</label>
            <div className="riskValue">{master.AssetOwner?.[0]?.Title}</div>
          </div>

          <div className="riskField">
            <label>Information Asset</label>
            <div className="riskValue">{master.InformationAsset}</div>
          </div>

          <div className="riskField">
            <label>Information Classification</label>
            <div className="riskValue">{master.Classification}</div>
          </div>

          <div className="riskField">
            <label>Sharing</label>
            <div className="riskValue">{master.Sharing}</div>
          </div>

          <div className="riskField">
            <label>Information Type</label>
            <div className="riskValue">{master.InformationType}</div>
          </div>

        </div>

      </div>

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
              <th>Edit</th>
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

                <td>                     
                  <div
                    style={{
                      background: exposureColor(Number(d.RiskValue || 0)),
                      height: "25px",
                      width: "80px",
                      borderRadius: "4px",
                      margin: "auto"
                    }}
                  />
                </td>
                {/* <td>{d.RiskExposure}</td> */}
                <td>{d.RiskResponse}</td>
                <td>{d.RTPDetails}</td>

                <td>
                  <button
                    onClick={() => {
                      setSelectedRowIndex(i);
                      setShowModal(true);
                    }}
                  >
                    ✏️
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
                    <h3>Edit Risk</h3>
                    <div className="popupinnerbox">


                        {/* ================= CURRENT RISK ================= */}

                        <div className="popupSectionTitle">Current Risk</div>
                        <div className="row mb-10">
                            <div className="col-md-6 col-sm-12">
                                <div className="row">
                                    <div className="col-md-6">
                                        <label>Risk Description</label>
                                        <textarea className="form-control h-140"
                                            value={rows.details[selectedRowIndex].RiskDescription}
                                            onChange={(e) =>
                                                updateRow(selectedRowIndex, "RiskDescription", e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label>Existing Controls</label>
                                        <textarea className="form-control  h-140"
                                            value={rows.details[selectedRowIndex].ExistingControls}
                                            onChange={(e) =>
                                                updateRow(selectedRowIndex, "ExistingControls", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <div className="row">
                                    <div className="col-md-1 col-sm-1 w-14">
                                        <label>C</label>
                                        <input className="form-control"
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={rows.details[selectedRowIndex].Confidentiality}
                                            onChange={e => updateRow(selectedRowIndex, "Confidentiality", +e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-1 col-sm-1 w-14">
                                        <label>I</label>
                                        <input
                                            type="text" className="form-control"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={rows.details[selectedRowIndex].Integrity}
                                            onChange={(e) =>
                                                updateRow(selectedRowIndex, "Integrity", +e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="col-md-1 col-sm-1 w-14">
                                        <label>A</label>
                                        <input type="text" className="form-control"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={rows.details[selectedRowIndex].Availability}
                                            onChange={(e) =>
                                                updateRow(selectedRowIndex, "Availability", +e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="col-md-1 col-sm-1 w-14">
                                        <label>Probability</label>
                                        <input type="text" className="form-control"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={rows.details[selectedRowIndex].Probability}
                                            onChange={(e) =>
                                                updateRow(selectedRowIndex, "Probability", +e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="col-md-1 col-sm-1 w-14">
                                        <label>Impact</label>
                                        <input type="text" className="form-control"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            value={rows.details[selectedRowIndex].Impact}
                                            onChange={(e) =>
                                                updateRow(selectedRowIndex, "Impact", +e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="col-md-1 col-sm-1 w-14">
                                        <label>Risk Value</label>
                                        <div className="valueBox">
                                            {rows.details[selectedRowIndex].RiskValue}
                                        </div>
                                    </div>
                                    <div className="col-md-1 col-sm-1 w-14">
                                        <label>Risk Exposure</label>
                                        <div
                                            className="valueBox"
                                            style={{
                                                background: exposureColor(rows.details[selectedRowIndex].RiskValue)
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
                        <div className="row mt-3">

                            {/* Risk Owner */}
                            <div className="col-md-4 col-sm-12">
                                <label>Risk Owner</label>

                                <PeoplePicker
                                    key={rows.details[selectedRowIndex]?.riskOwnerEmail || "empty"}
                                    context={peoplePickerContext}
                                    personSelectionLimit={1}
                                    principalTypes={[PrincipalType.User]}
                                    ensureUser
                                    defaultSelectedUsers={
                                        rows.details[selectedRowIndex]?.riskOwnerEmail
                                            ? [rows.details[selectedRowIndex].riskOwnerEmail]
                                            : []
                                    }
                                    onChange={async (items) => {

                                        if (items.length === 0) return;

                                        //const user = await sp.web.ensureUser(items[0].secondaryText);

                                        updateRevised(selectedRowIndex, "riskOwnerId", items[0].id);
                                        updateRevised(selectedRowIndex, "riskOwnerName", items[0].text);
                                        updateRevised(selectedRowIndex, "riskOwnerEmail", items[0].secondaryText);

                                    }}
                                />
                            </div>

                            {/* Risk Treatment Plan */}
                            <div className="col-md-8 col-sm-12">
                                <label>Risk Treatment Plan</label>

                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={rows.details[selectedRowIndex].RTPDetails || ""}
                                    onChange={(e) =>
                                        updateRevised(
                                            selectedRowIndex,
                                            "RTPDetails",
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>


                        <div className="row mt-2">

                            <div className="col-md-4 col-sm-12">
                                <label>Responsibility</label>

                                <PeoplePicker
                                    key={rows.details[selectedRowIndex]?.responsibilityEmail || "empty"}
                                    context={peoplePickerContext}
                                    personSelectionLimit={1}
                                    principalTypes={[PrincipalType.User]}
                                    ensureUser
                                    defaultSelectedUsers={
                                        rows.details[selectedRowIndex]?.responsibilityEmail
                                            ? [rows.details[selectedRowIndex].responsibilityEmail]
                                            : []
                                    }
                                    onChange={async (items) => {

                                        if (items.length === 0) {
                                            updateRevised(selectedRowIndex, "responsibilityId", undefined);
                                            updateRevised(selectedRowIndex, "responsibilityName", "");
                                            updateRevised(selectedRowIndex, "responsibilityEmail", "");
                                            return;
                                        }

                                        //const user = await sp.web.ensureUser(items[0].secondaryText);

                                        updateRevised(selectedRowIndex, "responsibilityId", items[0].id);
                                        updateRevised(selectedRowIndex, "responsibilityName", items[0].text);
                                        updateRevised(selectedRowIndex, "responsibilityEmail", items[0].secondaryText);

                                    }}
                                />
                            </div>

                            <div className="col-md-4 col-sm-12">
                                <label>Timeline</label>

                                <input
                                    className="form-control"
                                    value={rows.details[selectedRowIndex].Timeline || ""}
                                    onChange={e =>
                                        updateRevised(selectedRowIndex, "Timeline", e.target.value)
                                    }
                                />
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
                                            <input className="form-control"
                                                value={rows.details[selectedRowIndex].revisedC || ""}
                                                onChange={e => updateRevised(selectedRowIndex, "revisedC", +e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input className="form-control"
                                                value={rows.details[selectedRowIndex].revisedI || ""}
                                                onChange={e => updateRevised(selectedRowIndex, "revisedI", +e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input type="text" className="form-control"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                value={rows.details[selectedRowIndex].revisedA || ""}
                                                onChange={(e) =>
                                                    updateRevised(selectedRowIndex, "revisedA", +e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input type="text" className="form-control"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                value={rows.details[selectedRowIndex].revisedProbability || ""}
                                                onChange={(e) =>
                                                    updateRevised(selectedRowIndex, "revisedProbability", +e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input type="text" className="form-control"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                value={rows.details[selectedRowIndex].revisedImpact || ""}
                                                onChange={(e) =>
                                                    updateRevised(selectedRowIndex, "revisedImpact", +e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <div className="valueBox">

                                                {rows.details[selectedRowIndex].residualRisk || 0}
                                            </div>
                                        </td>
                                        {/* <td>
                                            <input
                                                className="form-control"
                                                value={rows.details[selectedRowIndex].residualCategory || ""}
                                                onChange={e =>
                                                    updateRevised(selectedRowIndex, "residualCategory", e.target.value)
                                                }
                                            />
                                        </td> */}
                                        <td className="valueBox" style={{ background: exposureColor(rows.details[selectedRowIndex].residualRisk) }}></td>
                                        <td>
                                            {/* <input className="form-control"
                                                //value={rows[selectedRowIndex].ownerAcceptance || ""}
                                                onChange={e => updateRevised(selectedRowIndex, "ownerAcceptance", e.target.value)}
                                            /> */}


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



                                                <PeoplePicker
                                                    context={peoplePickerContext}
                                                    personSelectionLimit={1}
                                                    principalTypes={[PrincipalType.User]}
                                                    ensureUser
                                                    defaultSelectedUsers={
                                                        rows.details[selectedRowIndex]?.ownerAcceptanceEmail
                                                            ? [rows.details[selectedRowIndex].ownerAcceptanceEmail]
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
                                                        //console.log(items[0]);
                                                        //const user = await sp.web.ensureUser(items[0].secondaryText);
                                                        

                                                        updateRevised(selectedRowIndex, "ownerAcceptanceId", items[0].id);
                                                        updateRevised(selectedRowIndex, "ownerAcceptanceName", items[0].text);
                                                        updateRevised(selectedRowIndex, "ownerAcceptanceEmail", email);
                                                    }}
                                                />

                                            </div>



                                        </td>
                                        <td>
                                            <input
                                                className="form-control"
                                                value={rows.details[selectedRowIndex].dataRetention || ""}
                                                onChange={e =>
                                                    updateRevised(selectedRowIndex, "dataRetention", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input className="form-control"

                                                value={rows.details[selectedRowIndex].isoControls || ""}
                                                onChange={e => updateRevised(selectedRowIndex, "isoControls", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <button className={styles.addBtn} onClick={() => addToHistory(selectedRowIndex)}>
                                                ADD
                                            </button>

                                        </td>

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="">

                            <div className="historySection">
                                {/* <h4>Revised History</h4> */}
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
                                            {rows.details[selectedRowIndex].history?.map((h, idx) => (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{h.revisedC}</td>
                                                    <td>{h.revisedI}</td>
                                                    <td>{h.revisedA}</td>
                                                    <td>{h.revisedCIA}</td>
                                                    <td>{h.revisedProbability}</td>
                                                    <td>{h.revisedImpact}</td>
                                                    <td>{h.residualRisk}</td>
                                                    <td className="valueBox" style={{ background: exposureColor(h.residualRisk) }}></td>
                                                    <td>{h.ownerAcceptanceName}</td>
                                                    <td>{h.dataRetention}</td>
                                                    <td>{h.isoControls}</td>
                                                    <td>{h.date}</td>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>
                            </div>

                        </div>

                        <div className="popupButtons">


                            {/* <button onClick={() => setShowModal(false)} className="savebtn"> <i className=" fa fa-save " aria-hidden="true"></i> Save</button> */}

                            <button onClick={savePopupChanges} className="savebtn">
                                <i className="fa fa-check" style={{ paddingRight: '3px' }} aria-hidden="true"></i>Submit
                            </button>

                            <button className="exitbtn" onClick={() => setShowModal(false)} style={{ marginLeft: '10px' }}>
                                <i className="fa fa-times" style={{ paddingRight: '3px' }} aria-hidden="true"></i>Close
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        )}
    </div>


  );
};

export default RiskEditPage;