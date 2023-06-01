import React from "react";
import { ReactSVG } from "react-svg";
import "./Infrastructure.scss";
import office from "./assets/icons/office.svg";
import database from "./assets/icons/database-server.svg";
import tower from "./assets/icons/electric-tower.svg";
import oil from "./assets/icons/oil-exploratation.svg";
import tank from "./assets/icons/tank-cistern.svg";
import security from "./assets/icons/security-key.svg";
import { createElement } from "react";
import warning from "./assets/sounds/wrong-answer.mp3";
import { UrlState } from "bi-internal/core";

function CreateBluePath(coordinates) {
  return createElement(
    "svg",
    {
      className: "path",
      viewBox: `0 0 ${
        document.querySelector(".infrastructure.infrastructure-wrapper")
          .offsetWidth
      } ${
        document.querySelector(".infrastructure.infrastructure-wrapper")
          .offsetHeight
      }`,
    },
    createElement("path", {
      fill: "none",
      stroke: "lightblue",
      strokeWidth: "5",
      d: coordinates,
    })
  );
}

export default class Infrastructure extends React.Component {
  constructor(props) {
    super(props);
    this.state = { path: null };
  }

  api = new UrlState.getInstance();

  containerCoordinates = (id) => {
    const container = document.getElementById(id);
    if (!container) {
      console.error("No such Container!", id);
      return;
    }
    const x =
      container.offsetWidth > container.offsetLeft
        ? container.offsetWidth + container.offsetLeft - 20
        : container.offsetLeft;
    const y = container.offsetTop + container.offsetHeight * 0.6;
    return { x, y };
  };

  createBezierCoords = (start, end) => {
    return `M${start.x},${start.y} C${end.x},${start.y} ${start.x},${end.y} ${end.x},${end.y}`;
  };

  getCoordinates = (event) => {
    console.log("event ", event);
  };

  componentDidMount() {
    const path = CreateBluePath(
      this.createBezierCoords(
        this.containerCoordinates("tank"),
        this.containerCoordinates("security")
      )
    );
    this.setState({
      path,
    });

    setTimeout(() => {
      this.audio.play();
    }, 5000);
  }
  audio = new Audio(warning);

  render() {
    return (
      <main
        className="infrastructure infrastructure-wrapper"
        onClick={this.getCoordinates()}
      >
        {this.state.path}
        <section className="column">
          <article className="container">
            <ReactSVG className="svg-wrapper" src={oil} />
          </article>
          <article id="tank" className="container">
            <ReactSVG className="svg-wrapper" src={tank} />
          </article>
        </section>
        <section className="column">
          <article id="security" className="container">
            <ReactSVG className="svg-wrapper" src={security} />
          </article>
        </section>
      </main>
    );
  }
}
