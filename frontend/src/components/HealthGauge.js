import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function HealthGauge({ score }) {
  return (
    <div style={{ width: "80px", margin: "auto" }}>
      <CircularProgressbar
  value={score}
  maxValue={100}
  text={`${score}/100`}
  circleRatio={0.5}
  styles={buildStyles({
    rotation: 0.75,
    pathColor: "#4ade80",
    trailColor: "#1e293b",
    textColor: "#ffffff",
    textSize: "18px"
  })}
/>
    </div>
  );
}

export default HealthGauge;