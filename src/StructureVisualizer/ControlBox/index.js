import React from "react";
import { Form, Button } from "react-bootstrap";
import "./index.css";

class ControlBox extends React.Component {
	// constructor(props) {
	// 	super(props);
	// }

	handleSupercellChange = (index, value) => {
		let newSupercell = this.props.viewerParams.supercell;
		newSupercell[index] = parseInt(value);
		this.props.onViewerParamChange("supercell", newSupercell);
	};

	handleOptionChange = (option) => {
		this.props.onViewerParamChange(
			option,
			!this.props.viewerParams[option]
		);
	};

	handleCameraEvent = (orientation) => {
		this.props.onViewerEvent("camera", orientation);
	};

	render() {
		return (
			<div className="control-box">
				<div className="control-box-row">
					<div
						className="supercell-container"
					>
						<Form.Label>Supercell: </Form.Label>
						<div style={{ display: "flex" }}>
							{[0, 1, 2].map((index) => (
								<Form.Control
									key={index}
									className="supercell-input"
									type="number"
									min="1"
                  max="99"
									value={this.props.viewerParams.supercell[index]}
									onChange={(e) =>
										this.handleSupercellChange(index, e.target.value)
									}
								/>
							))}
						</div>
					</div>

					<div className="camera-controls" >
						<Form.Label>Camera: </Form.Label>
						<Button className="camera-button" onClick={() => this.handleCameraEvent("x")}>
							x
						</Button>
						<Button className="camera-button" onClick={() => this.handleCameraEvent("y")}>
							y
						</Button>
						<Button className="camera-button" onClick={() => this.handleCameraEvent("z")}>
							z
						</Button>
					</div>
				</div>
				<div className="control-box-row" style={{ display: "flex" }}>
					<Form.Check
						className="option-checkbox"
						type="checkbox"
						checked={this.props.viewerParams.bonds}
						onChange={() => this.handleOptionChange("bonds")}
						label="Bonds"
					/>
					<Form.Check
						className="option-checkbox"
						type="checkbox"
						checked={this.props.viewerParams.atomLabels}
						onChange={() => this.handleOptionChange("atomLabels")}
						label="Atom labels"
					/>
					<Form.Check
						className="option-checkbox"
						type="checkbox"
						checked={this.props.viewerParams.packedCell}
						onChange={() => this.handleOptionChange("packedCell")}
						disabled={true}
						label="Packed cell"
					/>
					<Form.Check
						className="option-checkbox"
						type="checkbox"
						checked={this.props.viewerParams.spaceFilling}
						onChange={() => this.handleOptionChange("vdwRadius")}
						label="vdW radius"
					/>
				</div>
			</div>
		);
	}
}

export default ControlBox;