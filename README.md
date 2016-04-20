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
  jspm install aurelia-date-observer --dev
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
