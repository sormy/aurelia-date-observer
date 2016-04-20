# aurelia-date-observer #

Fast and efficient Date objects observer plugin for Aurelia Framework.

By default Aurelia can't bind to Date objects and can't efficiently track
Date object changes via methods like `setFullYear()`.

This plugin allow to make framework properly bind to Date objects and efficiently track changes.

There are two modes for observe mode:

1. Property Mode

  Will dirty check for `valueOf()` on Date objects. Fast but not so much as next mode.

2. Setter Mode

  Will bind to pseudo property on Date object which is monitored via setter observer. Blazing fast.

## Get Started ##

1. Install aurelia-date-observer:

  ```bash
  jspm install aurelia-date-observer
  ```
  
2. Use the plugin in your app's main.js:

  ```javascript
  export function configure(aurelia) {
    aurelia.use
      .standardConfiguration()
      .developmentLogging();
   
    aurelia.use.plugin('aurelia-date-observer');
    // or
    //aurelia.use.plugin('aurelia-date-observer', options);

    aurelia.start().then(() => aurelia.setRoot());
  }
  ```

## Example ##

This example will show how Date object binding could be used.

Example below with `aurelia-date-observer` plugin will work and use **0** resources 
in background to track model changes.

Without `aurelia-date-observer` plugin and with `@computedFrom('timestamp')` annotation 
Aurelia will not be able to track timestamp changes.

Without both `aurelia-date-observer` plugin and `@computedFrom('timestamp')` annotation 
Aurelia will fall back to dirty checking and will eat resources in background. For example, 
if it's a huge schedule application with a lot of events on schedule.

The difference could be easily tracked with `aurelia-stats` plugin.

```javascript
import {inlineView} from 'aurelia-framework';
import * as moment from 'moment';

@inlineView(`
  <template>
    <div class="event" css.bind="{ top: top + 'px', height: height + 'px' }">
      ${time}
    </div>
  </template>
`)
export class Event {
  timestamp;  // Event start date/time, Date
  duration;   // Event duration in minutes, Number
  
  topOffset = 0;
  hourHeight = 48;

  @computedFrom('timestamp')
  get time() {
    return moment(this.timestamp).format('h:mm A');
  }
  
  @computedFrom('offset', 'topOffset', 'hourHeight')
  get top() {
    return this.topOffset + this.offset * this.hourHeight / 60;
  }

  @computedFrom('duration', 'hourHeight')
  get height() {
    return this.duration * this.hourHeight / 60;
  }
  
  @computedFrom('timestamp')
  get offset() {
    return this.timestamp.getMinutes() + this.timestamp.getHours() * 60;
  }
  
  set offset(value) {
    var hours = Math.floor(value / 60);
    var minutes = Math.round(value % 60);
    // Here setter is internally triggered so Aurelia notified about object value change.
    // Without plugin that will not work and Aurelia will not be able to identify object change.
    this.timestamp.setHours(hours);
    this.timestamp.setMinutes(minutes);
  }
}
```

## Configuration ##

Plugin options could be passsed like below:

  ```javascript
  aurelia.use.plugin('aurelia-date-observer', {
    observeMode: 'property' // setter (default) | property
  });
  ```

Available options are:

- **observeMode**: Observe mode: "property" or "setter" (default)

## Building The Code ##

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.

2. From the project folder, execute the following command:

  ```shell
  npm install
  ```
  
3. Ensure that [Gulp](http://gulpjs.com/) is installed. If you need to install it, use the following command:

  ```shell
  npm install -g gulp
  ```
  
4. To build the code, you can now run:

  ```shell
  gulp build
  ```
  
5. You will find the compiled code in the `dist` folder, available in module formats: AMD, CommonJS, ES2015, SystemJS.
