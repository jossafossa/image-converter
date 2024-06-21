import { Component } from "react";

export type ProgressBarProps = {
  total: string;
  value: string;
  name: string;
  status: string;
};

export default class ProgressBar extends Component {
  props: ProgressBarProps;
  constructor(props: ProgressBarProps) {
    super(props);

    this.props = props;
  }

  render() {
    return (
      <div>
        <input
          readOnly
          disabled
          type="range"
          min="0"
          max={this.props.total}
          value={this.props.value}
        />
        <span>{this.props.status}</span>
        <span>{this.props.name}</span>
      </div>
    );
  }
}
