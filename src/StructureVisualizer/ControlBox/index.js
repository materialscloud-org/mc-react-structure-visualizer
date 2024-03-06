import React from "react";
import "./index.css";

import { Row, Col, Form, Button, FormGroup } from "react-bootstrap";

class ControlBox extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSupercellChange = (index, value) => {
    let newSupercell = this.props.viewerParams.supercell;
    newSupercell[index] = parseInt(value);
    this.props.onViewerParamChange("supercell", newSupercell);
  };

  handleOptionChange = (option) => {
    this.props.onViewerParamChange(option, !this.props.viewerParams[option]);
  };

  handleCameraEvent = (orientation) => {
    this.props.onViewerEvent("camera", orientation);
  };

  render() {
    return (
      <div className="control-box">
        <Row className="control-box-row">
          <Col>
            <Form.Label className="control-box-row-label">Supercell: </Form.Label>
            <Row>
              {[0, 1, 2].map((index) => (
                <Col xs={4} key={index}>
                  <Form.Control
                    type="number"
                    min="1"
                    value={this.props.viewerParams.supercell[index]}
                    onChange={(e) =>
                      this.handleSupercellChange(index, e.target.value)
                    }
                    className="supercell-input"
                  />
                </Col>
              ))}
            </Row>
          </Col>
          <Col>
            <Form.Label className="control-box-row-label">Camera: </Form.Label>
            <div className="camera-controls">
              <Button onClick={() => this.handleCameraEvent("x")} className="control-box-row button">
                X
              </Button>
              <Button onClick={() => this.handleCameraEvent("y")} className="control-box-row button">
                Y
              </Button>
              <Button onClick={() => this.handleCameraEvent("z")} className="control-box-row button">
                Z
              </Button>
            </div>
          </Col>
        </Row>
        <Row className="control-box-row">
          <Col>
            <Form.Label className="control-box-row-label">Options:</Form.Label>
            <FormGroup>
              <Form.Check
                type="checkbox"
                label="Bonds"
                checked={this.props.viewerParams.bonds}
                onChange={() => this.handleOptionChange("bonds")}
                className="control-box-row-checkbox"
              />
              <Form.Check
                type="checkbox"
                label="Atom labels"
                checked={this.props.viewerParams.atomLabels}
                onChange={() => this.handleOptionChange("atomLabels")}
                className="control-box-row-checkbox"
              />
              <Form.Check
                type="checkbox"
                label="Packed cell"
                checked={this.props.viewerParams.packedCell}
                disabled
                className="control-box-row-checkbox"
              />
              <Form.Check
                type="checkbox"
                label="vdW radius"
                checked={this.props.viewerParams.spaceFilling}
                onChange={() => this.handleOptionChange("vdwRadius")}
                className="control-box-row-checkbox"
              />
            </FormGroup>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ControlBox;
