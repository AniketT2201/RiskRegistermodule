import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Web } from "@pnp/sp/presets/all";
import styles from "../Scrrd.module.scss";

interface Props {
  currentSPContext: any;
}

const RiskEditForm: React.FC<Props> = ({ currentSPContext }) => {

  const history = useHistory();
  const location = useLocation<any>();
  const riskId = location.state?.id;

  const web = Web(currentSPContext.pageContext.web.absoluteUrl);

  const [row, setRow] = useState<any>({
    Vulnerability: "",
    RiskDescription: "",
    ExistingControls: "",
    Confidentiality: 0,
    Integrity: 0,
    Availability: 0,
    CIAMultipliedValue: 0,
    Probability: 0,
    Impact: 0,
    RiskValue: 0,
    RiskResponse: ""
  });

  useEffect(() => {
    loadRisk();
  }, []);

  // ===== LOAD SINGLE RISK =====
  const loadRisk = async () => {
    try {

      const item = await web.lists
        .getByTitle("RiskDetails")
        .items
        .getById(riskId)
        .get();

      setRow({
        ...item,
        Confidentiality: Number(item.Confidentiality),
        Integrity: Number(item.Integrity),
        Availability: Number(item.Availability),
        Probability: Number(item.Probability),
        Impact: Number(item.Impact),
        CIAMultipliedValue: Number(item.CIAMultipliedValue),
        RiskValue: Number(item.RiskValue)
      });

    } catch (err) {
      console.error("Load error:", err);
    }
  };

  // ===== AUTO CALC =====
  const updateValue = (field: string, value: any) => {

    const updated = { ...row, [field]: Number(value) || value };

    const cia =
      (updated.Confidentiality || 0) *
      (updated.Integrity || 0) *
      (updated.Availability || 0);

    const riskVal =
      cia * (updated.Probability || 0) * (updated.Impact || 0);

    updated.CIAMultipliedValue = cia;
    updated.RiskValue = riskVal;

    setRow(updated);
  };

  // ===== UPDATE =====
  const updateRisk = async () => {
    try {

      await web.lists
        .getByTitle("RiskDetails")
        .items
        .getById(riskId)
        .update({

          Vulnerability: row.Vulnerability,
          RiskDescription: row.RiskDescription,
          ExistingControls: row.ExistingControls,

          Confidentiality: row.Confidentiality,
          Integrity: row.Integrity,
          Availability: row.Availability,

          CIAMultipliedValue: row.CIAMultipliedValue,

          Probability: row.Probability,
          Impact: row.Impact,

          RiskValue: row.RiskValue,

          RiskResponse: row.RiskResponse
        });

      alert("Risk updated successfully");
      history.push("/RiskRegisterDepartmentDashboard");

    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  return (
    <div className={styles.scrrd}>

      <h2>Edit Risk</h2>

      <div className={styles.appCard}>

        <label>Vulnerability</label>
        <textarea
          className={styles.appTextarea}
          value={row.Vulnerability}
          onChange={e => setRow({ ...row, Vulnerability: e.target.value })}
        />

        <label>Risk Description</label>
        <textarea
          className={styles.appTextarea}
          value={row.RiskDescription}
          onChange={e => setRow({ ...row, RiskDescription: e.target.value })}
        />

        <label>Existing Controls</label>
        <textarea
          className={styles.appTextarea}
          value={row.ExistingControls}
          onChange={e => setRow({ ...row, ExistingControls: e.target.value })}
        />

        <div className="d-flex gap-2 mt-2">

          <input className={styles.appInput}
            placeholder="C"
            value={row.Confidentiality}
            onChange={e => updateValue("Confidentiality", e.target.value)}
          />

          <input className={styles.appInput}
            placeholder="I"
            value={row.Integrity}
            onChange={e => updateValue("Integrity", e.target.value)}
          />

          <input className={styles.appInput}
            placeholder="A"
            value={row.Availability}
            onChange={e => updateValue("Availability", e.target.value)}
          />

        </div>

        <div className="d-flex gap-2 mt-2">
          <input className={styles.appInput}
            placeholder="Probability"
            value={row.Probability}
            onChange={e => updateValue("Probability", e.target.value)}
          />

          <input className={styles.appInput}
            placeholder="Impact"
            value={row.Impact}
            onChange={e => updateValue("Impact", e.target.value)}
          />

        </div>

        <div className="mt-2">
          <b>CIA:</b> {row.CIAMultipliedValue} &nbsp; | &nbsp;
          <b>Risk Value:</b> {row.RiskValue}
        </div>

        <label className="mt-2">Risk Response</label>
        <input
          className={styles.appInput}
          value={row.RiskResponse}
          onChange={e => setRow({ ...row, RiskResponse: e.target.value })}
        />

        <div className="mt-3">

          <button className={styles.appBtnPrimary} onClick={updateRisk}>
            Update Risk
          </button>

          <button
            className="ms-2"
            onClick={() => history.push("/RiskRegisterDepartmentDashboard")}
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
};

export default RiskEditForm;
