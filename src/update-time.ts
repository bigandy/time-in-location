const elementName = "time-in-location";

const allTimeInDestinations = document.querySelectorAll(elementName);

allTimeInDestinations.forEach((el) => {
  const [h, m, s] = el.getAttribute("time")?.split(":") || [];

  if (s) {
    setInterval(() => {
      const now = Temporal.Now.plainTimeISO();

      el.setAttribute("time", [h, m, now.second].join(":"));
    }, 1_000);
  }
});

let hour = "15";
let minute = "00";
let time = `${hour}:${minute}`;

const getAllTimeZones = document.getElementById("getAllTimeZones");

getAllTimeZones?.addEventListener("click", () => {
  const list = document.createElement("ul");
  list.classList.add("timezones");

  list.innerHTML = Intl.supportedValuesOf("timeZone")
    .map((tz) => {
      return `<li><${elementName}
	tz="${tz}"
	label="${tz.replaceAll("/", " / ")}"
	hide-seconds
	time="${time}"
></${elementName}></li>`;
    })
    .join("");

  document.body.append(list);
  // getAllTimeZones.remove();//
});
