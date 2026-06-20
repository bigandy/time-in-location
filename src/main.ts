class TimeInLocation extends HTMLElement {
  #shadow: ShadowRoot;

  // Props
  #tz?: string;
  #hideSeconds?: boolean;
  #isTwelveHours?: boolean;
  #label?: string;
  // end props.

  static get observedAttributes() {
    return ["time"];
  }

  get time() {
    return this.getAttribute("time")?.split(":") ?? [];
  }

  constructor() {
    super();

    this.#shadow = this.attachShadow({ mode: "open" });
  }

  #padStartNumber(number: number) {
    return `0${number}`.slice(-2);
  }

  async #getTemporal() {
    const { Temporal } = await import("temporal-polyfill-lite");

    window.Temporal = Temporal;
  }

  #theTime() {
    // this.#now = Temporal.Now.plainTimeISO();
    const computerTime = Temporal.Now.zonedDateTimeISO();
    const { year, month, day, timeZoneId } = computerTime;

    const [inputHour, inputMinute, inputSecond] = this.time;

    if (!inputSecond) {
      this.#hideSeconds = true;
    }

    const localTime = Temporal.PlainDateTime.from(
      `${year}-${this.#padStartNumber(month)}-${day}T${inputHour}:${inputMinute}:${inputSecond ? this.#padStartNumber(+inputSecond) : "00"}`,
    );
    // targetTime is the desired time in the destination timezone. e.g. 15:00
    const targetTime = localTime.toZonedDateTime(this.#tz!);
    // converting the targetTime to the localTime i.e. 15:00 in america/los_angeles is 00:00 in europe/paris.
    const { hour, minute, second } = targetTime.withTimeZone(timeZoneId);

    const hours = this.#isTwelveHours ? hour % 12 : this.#padStartNumber(hour);

    return {
      hours,
      minutes: this.#padStartNumber(minute),
      seconds: inputSecond ? this.#padStartNumber(second) : undefined,
    };
  }

  #printTime() {
    const { hours, minutes, seconds } = this.#theTime();

    let suffix = "";

    // AHTODO. How to internationalise this, or pass in props for the am/pm??
    if (this.#isTwelveHours) {
      suffix = +hours > 12 ? "pm" : "am";
    }

    this.#shadow.innerHTML = `
            ${this.#label && this.#label !== "" ? `<p part="label">${this.#label}</p>` : ""}
			<time part="time"><span part="number">${hours}</span><span part="seperator">:</span><span part="number">${minutes}</span>${!this.#hideSeconds ? `<span part="seperator">:</span><span part="number">${seconds}</span>` : ""}</time>${suffix !== "" ? `<span part="suffix">${suffix}</span>` : ""}
		`;
  }

  async connectedCallback() {
    if (!window.Temporal) {
      await this.#getTemporal();
    }

    this.#tz = this.getAttribute("tz") || undefined;
    this.#isTwelveHours = this.hasAttribute("twelve-hours");
    this.#hideSeconds = this.hasAttribute("hide-seconds");
    this.#label = this.getAttribute("label") || undefined;

    this.#printTime();
  }

  attributeChangedCallback(attributeName: string, oldValue: string, newValue: string) {
    if (attributeName === "time" && oldValue) {
      //   this.#printTime();
      const [oldHour, oldMinute] = oldValue;
      const [newHour, newMinute] = newValue;

      if (this.#hideSeconds) {
        if (oldHour !== newHour || oldMinute !== newMinute) {
          this.#printTime();
        }
      } else if (oldValue !== newValue) {
        this.#printTime();
      }
    }
  }
}

customElements.define("time-in-location", TimeInLocation);

export default TimeInLocation;
