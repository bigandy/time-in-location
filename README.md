# `<time-in-location>` web component

provided with a time and timezone, this component spits out that time in the users timezone.

e.g. `<time-in-location tz="europe/rome" time="12:10"></time-in-location>` will output what 12:10 Rome time is in your current timezone. i.e. in Paris (same timezone) it will be 12:10, whereas in New York it will be 06:10.

## Attributes

### tz

provide a country code e.g. `tz="europe/paris"` and the component will show the time of that city's timezone. To get the full list you can get it with: `Intl.supportedValuesOf("timeZone");`. If no tz attribute is supplied, the time will be that of the computer.

### twelve-hours

if you want the time to use a twelve hours clock then use the `twelve-hours` attribute.

### hide-seconds

hate showing the seconds? use the `hide-seconds` attribute.

### label

want to provide a label to show what time the component corresponds to? Use the `label` attribute.

## Parts

Current exposed parts are:

- `label` if you provide a label with the `label` attribute.
- `time` - the whole numeric time part of the html. Not the label or the time-difference.
- `number` - the hours, minutes, seconds used in the clock.
- `seperator` this is the two dots between the hour/minute/second.
- `suffix` - the am/pm if using `twelve-hours` prop.
