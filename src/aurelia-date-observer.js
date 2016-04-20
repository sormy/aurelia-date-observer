import {ObserverLocator, SetterObserver} from 'aurelia-framework';

export class AureliaDateObserverPlugin {
  observerLocator;

  observeMode = 'setter'; // setter | property

  constructor(frameworkConfiguration, pluginConfiguration) {
    this.observerLocator = frameworkConfiguration.container.get(ObserverLocator);
    if (pluginConfiguration.observeMode) {
      this.observeMode = pluginConfiguration.observeMode;
    }
    this.patchDate();
    this.patchObserverLocator();
  }

  patchDate() {
    if (Date.prototype.__au_value) {
      return;
    }

    switch (this.observeMode) {
      case 'property':
        this.patchDateForPropertyObserver();
        break;
      case 'setter':
        this.patchDateForSetterObserver();
        break;
      default:
        throw `AureliaDateObserverPlugin: wrong observation mode ${this.observeMode}`;
    }
  }

  patchDateForPropertyObserver() {
    Object.defineProperty(Date.prototype, '__au_value', {
      get: function() {
        return this.valueOf();
      }
    });
  }

  patchDateForSetterObserver() {
    Object.defineProperty(Date.prototype, '__au_value', {
      get: function() {
        if (this.__au_value_cache === undefined) {
          this.__au_value_cache = this.valueOf();
        }
        return this.__au_value_cache;
      },
      set: function(value) {
        this.__au_value_cache = value;
      }
    });

    var setters = Object.getOwnPropertyNames(Date.prototype).filter(name => name.startsWith('set', 0));

    setters.forEach(function(methodName) {
      var oldMethod = Date.prototype[methodName];
      if (oldMethod) {
        Date.prototype[methodName] = function() {
          var result = oldMethod.apply(this, arguments);
          this.__au_value = this.valueOf();
          return result;
        };
      }
    });
  }

  patchObserverLocator() {
    var useSetterObserver = this.observeMode == 'setter';

    var oldCreatePropertyObserver = this.observerLocator.createPropertyObserver;

    this.observerLocator.createPropertyObserver = function(obj, propertyName) {
      if (obj[propertyName] instanceof Date) {
        if (useSetterObserver) {
          return new SetterObserver(this.taskQueue, obj[propertyName], '__au_value');
        } else {
          return oldCreatePropertyObserver.call(this, obj[propertyName], '__au_value');
        }
      }
      return oldCreatePropertyObserver.call(this, obj, propertyName);
    }
  }
}

export function configure(frameworkConfiguration, pluginConfiguration) {
  new AureliaDateObserverPlugin(frameworkConfiguration, pluginConfiguration);
}
