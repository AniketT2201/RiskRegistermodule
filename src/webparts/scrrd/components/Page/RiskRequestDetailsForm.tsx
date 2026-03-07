// ===== YOUR ORIGINAL IMPORTS =====
import * as React from "react";
import { useEffect, useState } from "react";
import { Web } from "@pnp/sp/presets/all";
import "@pnp/sp/profiles";
// import { sp } from "@pnp/sp/presets/all";
import { useHistory } from "react-router-dom";
import styles from "../Scrrd.module.scss";
import { SPComponentLoader } from '@microsoft/sp-loader';
import { PeoplePicker, PrincipalType, IPeoplePickerContext }
    from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { sp } from "@pnp/sp";

// import { IPeoplePickerContext } from "@pnp/spfx-controls-react/lib/PeoplePicker";


// import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
// import { sp } from "@pnp/sp";



SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css');
interface Props {
    currentSPContext: any;
}
//this is old one
// interface RiskRow {
//     vulnerability: string;
//     riskDescription: string;
//     existingControls: string;

//     c: number;
//     i: number;
//     a: number;

//     cia: number;
//     probability: number;
//     impact: number;
//     riskValue: number;
//     response: string;
// }

//------------------------new create by me---------------------------------------


interface RiskRow {


    sharePointItemId?: number;
    vulnerability: string;
    riskDescription: string;
    existingControls: string;

    c: number;
    i: number;
    a: number;

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

    response: string;

    // history?: any[];


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



    // ✅ ADD THESE
    // riskOwner?: string;
    // riskTreatmentPlan?: string;
    // responsibility?: string;
    // timeline?: string;


    residualCategory?: string;
    dataRetention?: string;
    isoControls?: string;


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




}
//====================end my code========================


const RiskRequestDetailsForm: React.FC<Props> = ({ currentSPContext }) => {

    const history = useHistory();
    const web = Web(currentSPContext.pageContext.web.absoluteUrl);

    // ===== YOUR ORIGINAL STATES =====
    const [ownerName, setOwnerName] = useState("");
    const [asset, setAsset] = useState("");

    const [classification, setClassification] = useState("");
    const [sharing, setSharing] = useState("");
    const [infoType, setInfoType] = useState("");

    const [vulnerability, setVulnerability] = useState("");
    const [riskDesc, setRiskDesc] = useState("");

    const [rows, setRows] = useState<RiskRow[]>([]);
    const [responses, setResponses] = useState<string[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);



    const [assetOwnerId, setAssetOwnerId] = useState<number | null>(null);
    const [assetOwnerEmail, setAssetOwnerEmail] = useState("");

    // const [ownerAcceptanceId, setOwnerAcceptanceId] = useState<number | null>(null);
    // const [ownerAcceptanceName, setOwnerAcceptanceName] = useState("");
    // const [ownerAcceptanceEmail, setOwnerAcceptanceEmail] = useState("");



    const [editIndex, setEditIndex] = useState<number | null>(null);

    const [department, setDepartment] = useState<string>("");


    const [existingControlInput, setExistingControlInput] = useState("");

    const peoplePickerContext: IPeoplePickerContext = {
        absoluteUrl: currentSPContext.pageContext.web.absoluteUrl,
        spHttpClient: currentSPContext.spHttpClient as any,
        msGraphClientFactory: currentSPContext.msGraphClientFactory as any
    };




    const [choices, setChoices] = useState({
        classification: [] as string[],
        sharing: [] as string[],
        infoType: [] as string[]
    });

    useEffect(() => {
        void loadUserInfo();
        void loadChoices();
        void loadRiskResponses();
    }, []);



    // now code for people picker 


    useEffect(() => {
        sp.setup({ spfxContext: currentSPContext as any });
    }, []);

    //add by today==================


    // const addToHistory = (i: number) => {
    //     const copy = [...rows];
    //     const r: any = copy[i];

    //     if (!r.history) r.history = [];

    //     r.history.push({
    //         revisedC: r.revisedC || 0,
    //         revisedI: r.revisedI || 0,
    //         revisedA: r.revisedA || 0,
    //         revisedCIA: r.revisedCIA || 0,
    //         revisedProbability: r.revisedProbability || 0,
    //         revisedImpact: r.revisedImpact || 0,
    //         residualRisk: r.residualRisk || 0,
    //         residualCategory: r.residualCategory || "",
    //         ownerAcceptance: r.ownerAcceptance || "",
    //         dataRetention: r.dataRetention || "",
    //         isoControls: r.isoControls || "",
    //         date: new Date().toLocaleDateString()
    //     });

    //     setRows(copy);
    // };

    // const addToHistory = (i: number) => {
    //     const copy = [...rows];
    //     const r: any = copy[i];

    //     if (!r.history) r.history = [];

    //     // ✅ Push to history
    //     r.history.push({
    //         revisedC: r.revisedC || 0,
    //         revisedI: r.revisedI || 0,
    //         revisedA: r.revisedA || 0,
    //         revisedCIA: r.revisedCIA || 0,
    //         revisedProbability: r.revisedProbability || 0,
    //         revisedImpact: r.revisedImpact || 0,
    //         residualRisk: r.residualRisk || 0,
    //         residualCategory: r.residualCategory || "",
    //         ownerAcceptance: r.ownerAcceptance || "",
    //         dataRetention: r.dataRetention || "",
    //         isoControls: r.isoControls || "",
    //         date: new Date().toLocaleDateString()
    //     });

    //     // // 🔥 RESET REVISED RISK FORM ONLY
    //     // r.revisedC = "";
    //     // r.revisedI = "";
    //     // r.revisedA = "";
    //     // r.revisedProbability = "";
    //     // r.revisedImpact = "";
    //     // r.revisedCIA = 0;
    //     // r.residualRisk = 0;

    //     // r.residualCategory = "";
    //     // r.ownerAcceptance = "";
    //     // r.dataRetention = "";
    //     // r.isoControls = "";

    //     setRows(copy);
    // };



    // const addToHistory = (i: number) => {
    //     const copy = [...rows];
    //     const r: any = copy[i];

    //     if (!r.history) r.history = [];

    //     // ✔ Add to history
    //     r.history.push({
    //         revisedC: r.revisedC || 0,
    //         revisedI: r.revisedI || 0,
    //         revisedA: r.revisedA || 0,
    //         revisedProbability: r.revisedProbability || 0,
    //         revisedImpact: r.revisedImpact || 0,
    //         residualRisk: r.residualRisk || 0,
    //         residualCategory: r.residualCategory || "",
    //         ownerAcceptance: r.ownerAcceptanceName || "",
    //         dataRetention: r.dataRetention || "",
    //         isoControls: r.isoControls || "",
    //         date: new Date().toLocaleString()
    //     });

    //     // 🔥 CLEAR ONLY REVISED RISK SECTION
    //     copy[i] = {
    //         ...r,
    //         revisedC: "",
    //         revisedI: "",
    //         revisedA: "",
    //         revisedProbability: "",
    //         revisedImpact: "",
    //         residualRisk: 0,
    //         residualCategory: "",
    //         ownerAcceptance: "",
    //         dataRetention: "",
    //         isoControls: ""
    //     };

    //     setRows(copy);
    // };



    const addToHistory = (i: number) => {

        const copy = [...rows];
        const r: any = copy[i];

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
            date: new Date().toLocaleString()
        });

        // 🔥 RESET SECTION PROPERLY
        copy[i] = {
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



    /* ========== LOAD USER (LOGGED-IN USER + DEPARTMENT) ========= */

    const loadUserInfo = async () => {
        try {
            let user;
            let profile;
            sp.setup({
                sp: {
                    baseUrl: currentSPContext.pageContext.web.absoluteUrl
                }
            });



            user = await sp.web.ensureUser(currentSPContext.pageContext.user.email);
            setOwnerName(user.data.Title); // ✅ ADD THIS
            profile = await sp.profiles.getPropertiesFor(user.data.LoginName)

            const deptObj = profile.UserProfileProperties.find(
                (p: any) => p.Key === "Department"
            );

            const deptValue = deptObj ? deptObj.Value : "";

            console.log("Department:", deptValue);

            setDepartment(deptValue);

        } catch (err) {
            console.error("User profile error:", err);
        }
    };




    // ===== LOAD DROPDOWNS =====
    const loadChoices = async () => {
        const fields: any[] = await web.lists.getByTitle("RiskRequest").fields.get();

        const get = (n: string) =>
            fields.find(f => f.InternalName === n)?.Choices || [];

        setChoices({
            classification: get("Classification"),
            sharing: get("Sharing"),
            infoType: get("InformationType")
        });
    };

    const loadRiskResponses = async () => {
        const fields: any[] = await web.lists.getByTitle("RiskDetails").fields.get();
        setResponses(
            fields.find(f => f.InternalName === "RiskResponse")?.Choices || []
        );
    };



    // this use for save the data for the inside popup



    //     const savePopupChanges = async () => {

    //         if (selectedRowIndex === null) return;

    //         const r = rows[selectedRowIndex];
    //         if (r.history.length > 0) {
    //             for (var j = 0; j < r.history.length; j++) {

    //         const data = {

    //             Title: "RTP_" + Date.now(),

    //             //   RiskRequestID: requestId?.toString() || "",

    //             Vulnerability: r.vulnerability || "",
    //             ExistingControls: r.existingControls || "",

    //             RevisedC: r.history[j].c != null ? String(r.c) : null,
    //             RevisedI: r.history[j].i != null ? String(r.i) : null,
    //             RevisedA: r.history[j].a != null ? String(r.a) : null,
    //             RevisedCIAScore: r.history[j].revisedCIA != null ? String(r.history[j].revisedCIA) : null,
    //             RevisedProbability: r.history[j].probability != null ? String(r.history[j].probability) : null,
    //             RevisedImpact: r.history[j].impact != null ? String(r.impact) : null,
    //             ResidualRisk: r.history[j].residualRisk != null ? String(r.history[j].residualRisk) : null,

    //             ResidualRiskCategory: r.history[j].residualCategory || null,

    //             //RiskOwnerAcceptanceId: r.history[j].ownerAcceptanceId ?? null,

    //             DataRetention: r.history[j].dataRetention || null,
    //             ISOApplicableControls: r.history[j].isoControls || null

    //         }
    //         try {

    //             await web.lists
    //                 .getByTitle("RTPDetails")
    //                 .items.add(data

    //                 );

    //             alert("RTP Saved Successfully");
    //             setShowModal(false);

    //         } catch (error) {
    //             console.log(error);
    //             alert("Error Saving RTP");
    //         }
    //     }
    // }
    //     };


    const savePopupChanges = async () => {

        if (selectedRowIndex === null) return;

        const r = rows[selectedRowIndex];

        if (!r.history || r.history.length === 0) {
            alert("No revised history to save");
            return;
        }

        try {

            // 🔥 LOOP THROUGH ALL HISTORY ROWS
            for (const h of r.history) {

                await web.lists
                    .getByTitle("RTPDetails")
                    .items.add({

                        Title: "RTP_" + Date.now(),
                        Vulnerability: r.vulnerability || null,
                        ExistingControls: r.existingControls || null,


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

                        // 🔥 Person column save
                        RiskOwnerAcceptanceId: r.riskOwnerId ? r.riskOwnerId : null
                    });
            }

            alert("All Revised History Saved Successfully");
            setShowModal(false);

        } catch (error) {
            console.error(error);
            alert("Error Saving RTP");
        }
    };
    //..........................end/.................................

    // ===== ADD ROW =====
    const addRow = () => {

        if (!riskDesc.trim()) return;

        if (editIndex !== null) {
            // 🔁 UPDATE EXISTING ROW
            const copy = [...rows];

            copy[editIndex].riskDescription = riskDesc;
            copy[editIndex].existingControls = existingControlInput;

            setRows(copy);
            setEditIndex(null);

        } else {
            // ➕ ADD NEW ROW
            setRows(prev => [
                ...prev,
                {
                    vulnerability: vulnerability,
                    riskDescription: riskDesc,
                    existingControls: existingControlInput,

                    c: 0,
                    i: 0,
                    a: 0,
                    cia: 0,
                    probability: 0,
                    impact: 0,
                    riskValue: 0,
                    response: ""
                }
            ]);
        }

        setRiskDesc("");
        setExistingControlInput("");
        setVulnerability("");
    };



    // ===== UPDATE & AUTO CALC =====
    const updateRow = (i: number, field: string, value: any) => {
        const copy = [...rows];
        (copy[i] as any)[field] = value;

        const c = copy[i].c || 0;
        const ii = copy[i].i || 0;
        const a = copy[i].a || 0;
        const p = copy[i].probability || 0;
        const im = copy[i].impact || 0;

        copy[i].cia = c * ii * a;
        copy[i].riskValue = copy[i].cia * p * im;

        setRows(copy);
    };

    // add today=====================
    const updateRevised = (i: number, field: string, value: any) => {
        const copy = [...rows];
        (copy[i] as any)[field] = value;

        const rc = Number(copy[i].revisedC || 0);
        const ri = Number(copy[i].revisedI || 0);
        const ra = Number(copy[i].revisedA || 0);
        const rp = Number(copy[i].revisedProbability || 0);
        const rim = Number(copy[i].revisedImpact || 0);

        copy[i].revisedCIA = rc * ri * ra;
        copy[i].residualRisk = copy[i].revisedCIA * rp * rim;

        setRows(copy);
    };



    ////////end

    const exposureColor = (v: number) => {
        if (v >= 163) return "#ff0000";   // High Risk - Red
        if (v >= 82) return "#ffc000";    // Medium Risk - Yellow
        if (v >= 1) return "#00b050";     // Low Risk - Green
        return "transparent";
    };

    const removeRow = (i: number) => {
        const copy = [...rows];
        copy.splice(i, 1);
        setRows(copy);
    };


    const editRow = (index: number) => {

        const row = rows[index];

        setRiskDesc(row.riskDescription);
        setExistingControlInput(row.existingControls);

        setEditIndex(index);   // mark which row is being edited
    };




    // ✅ PASTE HERE
    const submitRiskRequest = async () => {


        if (!department || !asset || !assetOwnerId) {
            alert("Please fill all mandatory fields");
            return;
        }
        try {

            // ===== SAVE MASTER =====
            const masterItem = await web.lists
                .getByTitle("RiskRequest")
                .items.add({

                    Department: department,
                    InformationAsset: asset,
                    AssetOwnerId: assetOwnerId,
                    Classification: classification,
                    Sharing: sharing,
                    InformationType: infoType,
                    Vulnerability: vulnerability
                });

            const requestId = masterItem.data.Id;






            // ===========================RiskID format====================
            await web.lists.getByTitle("RiskRequest").items
                .getById(requestId)
                .update({
                    Title: "R_" + ("00000" + requestId).slice(-5)
                });



            // ===== SAVE DETAIL ROWS =====
            for (const r of rows) {

                const result = await web.lists.getByTitle("RiskDetails").items.add({


                    RiskRequestID: requestId.toString(),

                    RiskDescription: r.riskDescription,
                    ExistingControls: r.existingControls,

                    Confidentiality: r.c.toString(),   // ✅ C → Confidentiality
                    Integrity: r.i.toString(),         // ✅ I → Integrity
                    Availability: r.a.toString(),      // ✅ A → Availability

                    CIAMultipliedValue: r.cia.toString(),

                    Probability: r.probability.toString(),
                    Impact: r.impact.toString(),

                    RiskValue: r.riskValue.toString(),

                    RiskResponse: r.response,
                    Vulnerability: vulnerability,

                    // ✅ PEOPLE PICKER SAVE
                    RiskOwnerId: r.riskOwnerId || null,
                    ResponsibilityId: r.responsibilityId || null,

                    // ✅ Other fields
                    RTPDetails: r.riskTreatmentPlan || "",
                    Timeline: r.timeline || "",

                    // AssetOwnerId: r.assetOwnerId || null,


                });

                r.sharePointItemId = result.data.Id;
            }




            alert("Saved successfully!");
            history.push("/");

        } catch (err) {
            console.error("Save failed:", err);
            alert("Save failed");
        }
    };



    // ===== UI =====
    return (
        <div className={`${styles.scrrd} requestdetailsection`}>

            {/* ===== YOUR ORIGINAL FORM ===== */}

            <h2 className="requestdetailstitle">Risk Request Details</h2>
            <div className="plr-10">
                <div className="row pb-10">
                    <div className="col-md-4 col-sm-12">
                        <label>
                            Department / Process <span style={{ color: "red" }}>*</span>
                        </label>
                        <input className="form-control" value={department} onChange={e => setDepartment(e.target.value)} />
                    </div>
                    <div className="col-md-4 col-sm-12">
                        <label>
                            Information Asset / Activity <span style={{ color: "red" }}>*</span>
                        </label>
                        <textarea className="form-control" value={asset} onChange={e => setAsset(e.target.value)} />
                    </div>
                    {/* <div className="col-md-4 col-sm-12">
                        <label>Information Asset Owner</label>
                        <input className="form-control" value={ownerName} disabled />
                    </div> */}


                    <div className="col-md-4 col-sm-12">
                        <label>
                            Information Asset Owner <span style={{ color: "red" }}>*</span>
                        </label>

                        <PeoplePicker
                            context={peoplePickerContext}
                            personSelectionLimit={1}
                            principalTypes={[PrincipalType.User]}
                            ensureUser
                            defaultSelectedUsers={assetOwnerEmail ? [assetOwnerEmail] : []}
                            onChange={async (items) => {
                                if (!items.length) {
                                    setAssetOwnerId(null);
                                    setAssetOwnerEmail("");
                                    return;
                                }

                                const email = items[0].secondaryText;
                                const user = await sp.web.ensureUser(email);

                                setAssetOwnerId(user.data.Id);
                                setAssetOwnerEmail(email);
                            }}
                        />

                    </div>
                </div>
                <div className="row pb-10">
                    <div className="col-md-4 col-sm-12">
                        <label>Information Classification</label>
                        <select className="form-control" value={classification} onChange={e => setClassification(e.target.value)}>
                            <option value="">Select</option>
                            {choices.classification.map(c => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4 col-sm-12">
                        <label>Sharing</label>
                        <select value={sharing} className="form-control" onChange={e => setSharing(e.target.value)}>
                            <option value="">Select</option>
                            {choices.sharing.map(c => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-4 col-sm-12">
                        <label>Information Type</label>
                        <select value={infoType} className="form-control" onChange={e => setInfoType(e.target.value)}>
                            <option value="">Select</option>
                            {choices.infoType.map(c => (
                                <option key={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row pb-10">
                    <div className="col-md-4 col-sm-12">
                        <label>Add Vulnerability</label>
                        <textarea className="form-control h-171"
                            placeholder="Add Vulnerability"
                            value={vulnerability}
                            onChange={e => setVulnerability(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 col-sm-12">
                        <label>Risk Discription</label>
                        <textarea className="form-control h-171"
                            placeholder="Risk Description"
                            value={riskDesc}
                            onChange={e => setRiskDesc(e.target.value)}
                        />
                    </div>
                    <div className="col-md-4 col-sm-12">
                        <label>Existing Control</label>
                        <textarea className="form-control h-171"
                            placeholder="Existing Controls"
                            value={existingControlInput}
                            onChange={e => setExistingControlInput(e.target.value)}
                        />
                    </div>
                </div>
                <div className="row pb-10">
                    <div className="col-md-12 addbtnsection text-right">
                        <button type='button' className={styles.addBtn} onClick={addRow}> <i className="fa fa-plus" aria-hidden="true"></i> Add</button>
                    </div>

                </div>



                {/* ===== NEW EXCEL STYLE GRID ===== */}
                <div className="table-responsive">
                    <table className={`${styles.table} pb-10`}>
                        <thead>
                            <tr>

                                <th>Vulnerability</th>
                                <th>Risk Description</th>
                                <th>Existing Controls</th>
                                <th>C</th>
                                <th>I</th>
                                <th>A</th>
                                <th>CIA</th>
                                <th>Probability(P)</th>
                                <th>Impact(IP)</th>
                                <th>Risk Value (CIxIP)</th>
                                <th>Risk Exposure</th>
                                <th>Risk Response</th>
                                <th>RTP</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rows.map((r, i) => (
                                <tr key={i}>

                                    {/* ✅ ONLY RISK DESCRIPTION */}
                                    {/* <td>{r.riskDescription}</td> */}


                                    <td>
                                        <textarea
                                            className="form-control exitcontrolbox"
                                            value={r.vulnerability}
                                            onChange={e => updateRow(i, "vulnerability", e.target.value)}
                                        />
                                    </td>

                                    {/* ✅ BLANK CONTROLS (editable) */}
                                    <td>
                                        <textarea className="form-control exitcontrolbox"
                                            value={r.riskDescription}
                                            onChange={e => updateRow(i, "existingControls", e.target.value)}
                                        />

                                    </td>
                                    <td>
                                        <textarea className="form-control exitcontrolbox"
                                            value={r.existingControls}
                                            onChange={e => updateRow(i, "existingControls", e.target.value)}
                                        />

                                    </td>

                                    {/* ✅ MANUAL TYPE FIELDS (NO DROPDOWN LOOK) */}
                                    <td><input className="form-control w-60" type="text" inputMode="numeric" onChange={e => updateRow(i, "c", +e.target.value)} /></td>
                                    <td><input className="form-control w-60" type="text" inputMode="numeric" onChange={e => updateRow(i, "i", +e.target.value)} /></td>
                                    <td><input className="form-control w-60" type="text" inputMode="numeric" onChange={e => updateRow(i, "a", +e.target.value)} /></td>

                                    <td>{r.cia}</td>

                                    <td><input className="form-control" type="text" inputMode="numeric" onChange={e => updateRow(i, "probability", +e.target.value)} /></td>
                                    <td><input className="form-control" type="text" inputMode="numeric" onChange={e => updateRow(i, "impact", +e.target.value)} /></td>

                                    <td>{r.riskValue}</td>

                                    <td style={{ background: exposureColor(r.riskValue) }} />

                                    <td>
                                        <select className="form-control" onChange={e => updateRow(i, "response", e.target.value)}>
                                            <option value="">Select</option>
                                            {responses.map(rp => <option key={rp}>{rp}</option>)}
                                        </select>
                                    </td>

                                    <button
                                        className="editbtn"
                                        onClick={() => {
                                            setSelectedRowIndex(i);
                                            setShowModal(true);
                                        }}
                                    >
                                        <i className="fa fa-pencil" /> Edit
                                    </button>






                                </tr>
                            ))}

                            {/* addd my me today */}









                        </tbody>
                    </table>
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
                                                        value={rows[selectedRowIndex].riskDescription}
                                                        onChange={(e) =>
                                                            updateRow(selectedRowIndex, "riskDescription", e.target.value)
                                                        }
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label>Existing Controls</label>
                                                    <textarea className="form-control  h-140"
                                                        value={rows[selectedRowIndex].existingControls}
                                                        onChange={(e) =>
                                                            updateRow(selectedRowIndex, "existingControls", e.target.value)
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
                                                        value={rows[selectedRowIndex].c}
                                                        onChange={e => updateRow(selectedRowIndex, "c", +e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-1 col-sm-1 w-14">
                                                    <label>I</label>
                                                    <input
                                                        type="text" className="form-control"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        value={rows[selectedRowIndex].i}
                                                        onChange={(e) =>
                                                            updateRow(selectedRowIndex, "i", +e.target.value)
                                                        }
                                                    />
                                                </div>
                                                <div className="col-md-1 col-sm-1 w-14">
                                                    <label>A</label>
                                                    <input type="text" className="form-control"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        value={rows[selectedRowIndex].a}
                                                        onChange={(e) =>
                                                            updateRow(selectedRowIndex, "a", +e.target.value)
                                                        }
                                                    />
                                                </div>
                                                <div className="col-md-1 col-sm-1 w-14">
                                                    <label>Probability</label>
                                                    <input type="text" className="form-control"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        value={rows[selectedRowIndex].probability}
                                                        onChange={(e) =>
                                                            updateRow(selectedRowIndex, "probability", +e.target.value)
                                                        }
                                                    />
                                                </div>
                                                <div className="col-md-1 col-sm-1 w-14">
                                                    <label>Impact</label>
                                                    <input type="text" className="form-control"
                                                        inputMode="numeric"
                                                        pattern="[0-9]*"
                                                        value={rows[selectedRowIndex].impact}
                                                        onChange={(e) =>
                                                            updateRow(selectedRowIndex, "impact", +e.target.value)
                                                        }
                                                    />
                                                </div>
                                                <div className="col-md-1 col-sm-1 w-14">
                                                    <label>Risk Value</label>
                                                    <div className="valueBox">
                                                        {rows[selectedRowIndex].riskValue}
                                                    </div>
                                                </div>
                                                <div className="col-md-1 col-sm-1 w-14">
                                                    <label>Risk Exposure</label>
                                                    <div
                                                        className="valueBox"
                                                        style={{
                                                            background: exposureColor(rows[selectedRowIndex].riskValue)
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
                                                context={peoplePickerContext}
                                                personSelectionLimit={1}
                                                principalTypes={[PrincipalType.User]}
                                                ensureUser
                                                defaultSelectedUsers={
                                                    rows[selectedRowIndex]?.riskOwnerEmail
                                                        ? [rows[selectedRowIndex].riskOwnerEmail]
                                                        : []
                                                }
                                                onChange={async (items) => {

                                                    if (items.length === 0) return;

                                                    const user = await sp.web.ensureUser(items[0].secondaryText);

                                                    updateRevised(selectedRowIndex, "riskOwnerId", user.data.Id);
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
                                                value={rows[selectedRowIndex].riskTreatmentPlan || ""}
                                                onChange={(e) =>
                                                    updateRevised(
                                                        selectedRowIndex,
                                                        "riskTreatmentPlan",
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
                                        </div>

                                        <div className="col-md-4 col-sm-12">
                                            <label>Timeline</label>

                                            <input
                                                className="form-control"
                                                value={rows[selectedRowIndex].timeline || ""}
                                                onChange={e =>
                                                    updateRevised(selectedRowIndex, "timeline", e.target.value)
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
                                                            value={rows[selectedRowIndex].revisedC || ""}
                                                            onChange={e => updateRevised(selectedRowIndex, "revisedC", +e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input className="form-control"
                                                            value={rows[selectedRowIndex].revisedI || ""}
                                                            onChange={e => updateRevised(selectedRowIndex, "revisedI", +e.target.value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control"
                                                            inputMode="numeric"
                                                            pattern="[0-9]*"
                                                            value={rows[selectedRowIndex].revisedA || ""}
                                                            onChange={(e) =>
                                                                updateRevised(selectedRowIndex, "revisedA", +e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control"
                                                            inputMode="numeric"
                                                            pattern="[0-9]*"
                                                            value={rows[selectedRowIndex].revisedProbability || ""}
                                                            onChange={(e) =>
                                                                updateRevised(selectedRowIndex, "revisedProbability", +e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control"
                                                            inputMode="numeric"
                                                            pattern="[0-9]*"
                                                            value={rows[selectedRowIndex].revisedImpact || ""}
                                                            onChange={(e) =>
                                                                updateRevised(selectedRowIndex, "revisedImpact", +e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="valueBox">

                                                            {rows[selectedRowIndex].residualRisk || 0}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            value={rows[selectedRowIndex].residualCategory || ""}
                                                            onChange={e =>
                                                                updateRevised(selectedRowIndex, "residualCategory", e.target.value)
                                                            }
                                                        />
                                                    </td>
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

                                                                    updateRevised(selectedRowIndex, "ownerAcceptanceId", user.data.Id);
                                                                    updateRevised(selectedRowIndex, "ownerAcceptanceName", items[0].text);
                                                                    updateRevised(selectedRowIndex, "ownerAcceptanceEmail", email);
                                                                }}
                                                            />

                                                        </div>



                                                    </td>
                                                    <td>
                                                        <input
                                                            className="form-control"
                                                            value={rows[selectedRowIndex].dataRetention || ""}
                                                            onChange={e =>
                                                                updateRevised(selectedRowIndex, "dataRetention", e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <input className="form-control"
                                                            value={rows[selectedRowIndex].isoControls || ""}
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
                                                        {rows[selectedRowIndex].history?.map((h, idx) => (
                                                            <tr key={idx}>
                                                                <td>{idx + 1}</td>
                                                                <td>{h.revisedC}</td>
                                                                <td>{h.revisedI}</td>
                                                                <td>{h.revisedA}</td>
                                                                <td>{h.revisedCIA}</td>
                                                                <td>{h.revisedProbability}</td>
                                                                <td>{h.revisedImpact}</td>
                                                                <td>{h.residualRisk}</td>
                                                                <td>{h.residualCategory}</td>
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
                <div className="row pl-13">
                    <div style={{ marginTop: 20 }} className="row">
                        <button onClick={submitRiskRequest} className="savebtn"> <i className=" fa fa-save " aria-hidden="true"></i> Submit</button>

                        <button
                            style={{ marginLeft: 10 }} className="exitbtn"
                            onClick={() => history.push("/")}
                        >
                            <i className=" fa fa-times" aria-hidden="true"></i>  Exit
                        </button>
                    </div>
                </div>
            </div>
        </div>



    );
};

export default RiskRequestDetailsForm;
