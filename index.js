AFRAME.registerComponent("hole", {
  schema: {
    scale: { default: "0.2 0.1 0.2" },
  },
  init() {
    const holeEntity = document.createElement("a-sphere");
    holeEntity.setAttribute("radius", 0.5);
    holeEntity.setAttribute("color", "#333333");
    this.el.appendChild(holeEntity);
  },
});

AFRAME.registerComponent("electron", {
  schema: {
    scale: { default: "0.2 0.1 0.2" },
  },
  init() {
    const electronEntity = document.createElement("a-sphere");
    electronEntity.setAttribute("radius", 0.5);
    electronEntity.setAttribute("color", "yellow");

    const textEntity = document.createElement("a-text");
    textEntity.setAttribute("value", "e-");
    textEntity.setAttribute("align", "center");
    textEntity.setAttribute("width", "10");
    textEntity.setAttribute("color", "black");
    textEntity.setAttribute("position", "0 0 0.6");
    textEntity.setAttribute("rotation", "0 0 -90");

    electronEntity.appendChild(textEntity);

    this.el.appendChild(electronEntity);
  },
});

AFRAME.registerComponent("arrow", {
  schema: {
    direction: { default: "right" },
    length: { default: 1 },
    color: { default: "#FF0000" },
  },
  init() {
    const direction = this.data.direction.toLowerCase();
    const length = this.data.length;

    const cone = document.createElement("a-cone");
    cone.setAttribute("height", 0.4);
    cone.setAttribute("radius-bottom", 0.2);
    cone.setAttribute("radius-top", 0);
    cone.setAttribute("color", this.data.color);
    cone.setAttribute("rotation", direction === "left" ? "0 0 -90" : "0 0 90");

    this.el.appendChild(cone);

    const box = document.createElement("a-box");
    box.setAttribute("width", length);
    box.setAttribute("height", 0.05);
    box.setAttribute("depth", 0.05);
    box.setAttribute("color", this.data.color);

    this.el.appendChild(box);
  },
});

AFRAME.registerComponent("counter", {
  init() {
    this.counterValue = 0;
    this.isBurned = false;

    this.counterText = document.querySelector("#counterText");
    this.updateCounterText();

    const decreaseButton = document.querySelector("#decreaseButton");
    const increaseButton = document.querySelector("#increaseButton");

    decreaseButton.addEventListener("click", () => {
      this.updateCounter(-0.1);
    });

    increaseButton.addEventListener("click", () => {
      this.updateCounter(0.1);
    });
  },
  updateCounter(step) {
    const correctCircuitButton = document.getElementById(
      "correct-circuit-button"
    );
    const incorrectCircuitButton = document.getElementById(
      "incorrect-circuit-button"
    );
    const sparks = document.getElementById("sparks");

    let isCorrectBattery =
      this.el.sceneEl.childNodes[35].components.visible.attrValue;

    this.counterValue += step;

    if (this.counterValue > 1.5) {
      this.counterValue = 1.5;
    } else if (this.counterValue >= 1) {
      this.handleCounterGreaterThanEqualTo1(sparks);
    } else if (this.counterValue >= 0.7) {
      this.handleCounterBetween07And1(isCorrectBattery);
    } else if (this.counterValue > 0) {
      this.handleCounterBetween0And07(isCorrectBattery);
    } else if (this.counterValue <= 0) {
      this.handleCounterLessThanOrEqualTo0();
    }

    this.updateCounterText();
  },
  handleCounterGreaterThanEqualTo1(sparks) {
    this.isBurned = true;
    sparks.setAttribute("visible", true);
    this.setElectricFields(true, true, true, true);
    this.turnOnLight();
  },
  handleCounterBetween07And1(isCorrectBattery) {
    if (isCorrectBattery) {
      this.setElectricFields(true, true, false, false);
      this.turnOnLight();
    } else {
      this.setElectricFields(false, false, true, true);
      this.turnOffLight();
    }
    if (this.isBurned) {
      this.setElectricFields(true, true, true, true);
      this.turnOnLight();
    }
  },
  handleCounterBetween0And07(isCorrectBattery) {
    if (isCorrectBattery) {
      this.setElectricFields(false, true, true, false);
    } else {
      this.setElectricFields(false, false, true, true);
    }
    this.turnOffLight();
    if (this.isBurned) {
      this.setElectricFields(true, false, true, false);
      this.turnOnLight();
    }
  },
  handleCounterLessThanOrEqualTo0() {
    this.setElectricFields(false, false, true, false);
    this.turnOffLight();
    this.counterValue = 0;
  },
  updateCounterText() {
    this.counterText.setAttribute(
      "text",
      "value",
      this.counterValue.toFixed(1)
    );
  },
  turnOnLight() {
    const light = document.getElementById("resistor");
    light.setAttribute(
      "light",
      "color: #ff0000; intensity: 2; target: a-plane"
    );
  },
  turnOffLight() {
    const light = document.getElementById("resistor");
    light.setAttribute(
      "light",
      "color: #ff0000; intensity: 0; target: a-plane"
    );
  },
  setElectricFields(rightVal, rightExtraVal, leftVal, leftExtraVal) {
    const rightElectricField = document.getElementById("right-electric-field");
    const extraRightElectricField = document.getElementById(
      "right-electric-field-extra"
    );

    const leftElectricField = document.getElementById("left-electric-field");
    const extraLeftElectricField = document.getElementById(
      "left-electric-field-extra"
    );

    rightElectricField.setAttribute("visible", rightVal);
    extraRightElectricField.setAttribute("visible", rightExtraVal);
    leftElectricField.setAttribute("visible", leftVal);
    extraLeftElectricField.setAttribute("visible", leftExtraVal);
  },
});

AFRAME.registerComponent("battery", {
  schema: {
    length: { default: 1 },
    width: { default: 0.5 },
    height: { default: 0.2 },
    color: { default: "#000000" },
    leftTerminal: { default: "+" },
  },
  init() {
    const length = this.data.length;
    const width = this.data.width;
    const height = this.data.height;
    const color = this.data.color;

    const positive = document.createElement("a-cylinder");
    positive.setAttribute("radius", height / 2);
    positive.setAttribute("height", height * 2 + 0.5);
    positive.setAttribute("color", color);
    positive.setAttribute(
      "position",
      `${this.data.leftTerminal === "+" ? -length / 4 : length / 4} 0 0`
    );
    this.el.appendChild(positive);

    const positiveText = document.createElement("a-text");
    positiveText.setAttribute("color", color);
    positiveText.setAttribute("width", 10);
    positiveText.setAttribute("value", "+");
    positiveText.setAttribute("align", "center");
    positiveText.setAttribute(
      "position",
      `${
        this.data.leftTerminal === "+"
          ? -(length / 4) - 0.25
          : length / 4 + 0.25
      } 0.25 0`
    );
    this.el.appendChild(positiveText);

    const negative = document.createElement("a-cylinder");
    negative.setAttribute("radius", height / 2);
    negative.setAttribute("height", height * 2);
    negative.setAttribute("color", color);
    negative.setAttribute(
      "position",
      `${this.data.leftTerminal === "+" ? length / 4 : -length / 4} 0 0`
    );
    this.el.appendChild(negative);

    const negativeText = document.createElement("a-text");
    negativeText.setAttribute("color", color);
    negativeText.setAttribute("width", 10);
    negativeText.setAttribute("value", "-");
    negativeText.setAttribute("align", "center");
    negativeText.setAttribute(
      "position",
      `${
        this.data.leftTerminal === "+"
          ? length / 4 + 0.25
          : -(length / 4) - 0.25
      } 0.25 0`
    );
    this.el.appendChild(negativeText);
  },
  multiple: true,
});
