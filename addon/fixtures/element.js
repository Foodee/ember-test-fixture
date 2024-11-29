import { expect } from 'chai';
import {
  click,
  find,
  findAll,
  blur,
  select,
  fillIn,
  focus,
  triggerKeyEvent,
  typeIn,
  waitFor,
} from '@ember/test-helpers';
import { dasherize } from '@ember/string';

/**
 * Since we have some logic around setting the selector, child classes should not be defining selector property in its definition
 * but instead use super('data-test-foo') or _selector = '[data-test-foo]'
 */
export class ChaiElement {
  constructor(selector = '', value, scope) {
    this.scope = scope;
    this.value = value;
    this.selector = selector;
  }

  get selector() {
    return this.scope ? `${this.scope} ${this._selector}` : this._selector;
  }

  // returns a selector without scope and []
  get bareSelector() {
    if (!this.isDataTestSelector(this._selector)) {
      return this._selector;
    }
    return this.stripBracketsAndValue(this._selector);
  }

  // append value or wrap with [] as needed while setting a selector
  set selector(selector) {
    if (!this.isDataTestSelector(selector)) {
      this._selector = selector;
      return;
    }
    const bareSelector = this.stripBracketsAndValue(selector);
    this._selector = this.value
      ? `[${bareSelector}="${this.value}"]`
      : `[${bareSelector}]`;
  }

  stripBracketsAndValue(selector) {
    return selector.replace(/\[|\]/g, '').split('=')[0];
  }

  // rules out cases where a selector is not data-test or has a scope in it
  isDataTestSelector(selector) {
    return (
      selector && selector.includes('data-test') && !selector.includes(' ')
    );
  }

  get self() {
    return find(this.selector);
  }

  get all() {
    return findAll(this.selector);
  }

  get expect() {
    return expect(
      this.selector,
      // added custom error message since long selectors get cut off
      `Error from "${this._selector}"`
    );
  }

  get should() {
    return this.expect.to;
  }

  get classList() {
    return Array.from(this.self.classList);
  }

  shouldHaveClass(klass) {
    return expect(this.classList).to.include(klass);
  }

  shouldHaveClasses(classes) {
    return expect(this.classList).to.include.members(classes);
  }

  get shouldBeDisabled() {
    return this.expect.to.have.attribute('disabled', '');
  }

  get shouldNotBeDisabled() {
    return this.expect.to.not.have.attribute('disabled', '');
  }

  get shouldBeReadonly() {
    return this.expect.to.have.attribute('readonly', '');
  }

  get shouldNotBeReadonly() {
    return this.expect.to.not.have.attribute('readonly', '');
  }

  blur() {
    return blur(this.selector);
  }

  click() {
    return click(this.selector);
  }

  focus() {
    return focus(this.selector);
  }

  fillIn(value) {
    return fillIn(this.selector, value);
  }

  select(value) {
    return select(this.selector, value);
  }

  triggerKeyEvent(eventType, key) {
    return triggerKeyEvent(this.selector, eventType, key);
  }

  typeIn(value) {
    return typeIn(this.selector, value);
  }

  waitToBeRendered() {
    return waitFor(this.selector);
  }

  shouldHaveParentWithClass(className) {
    return expect(this.self.closest(`.${className}`)).to.not.be.undefined;
  }
}

export class CyElement {
  // TODO add cy methods here
}

export function getElementConstructor() {
  if (window.cy) {
    return CyElement;
  } else {
    return ChaiElement;
  }
}

export class Element extends getElementConstructor() {}

const _buildBEMSelectorWithKey = (bareSelector, key) => {
  return bareSelector
    ? `${bareSelector}__${dasherize(key)}`
    : `data-test-${dasherize(key)}`;
};

export function getElementDecoratorFor(klass, customSelector) {
  return function () {
    const withCustomValues = !(arguments[0] instanceof Element);
    // invoked with custom values @element(selector, value, scope) to build selector

    if (withCustomValues) {
      let { selector, value, scope } = arguments[0];
      return function (_target, key, descriptor) {
        descriptor.initializer = function () {
          selector =
            selector || _buildBEMSelectorWithKey(this.bareSelector, key);
          return new klass(
            customSelector ?? selector,
            value,
            scope === undefined ? this.selector : scope
          );
        };
      };
    } else {
      // invoked by @element without custom values, build selectors using key name and parent selector
      const [_, key, descriptor] = arguments;
      descriptor.initializer = function () {
        const selector = _buildBEMSelectorWithKey(this.bareSelector, key);
        return new klass(customSelector ?? selector, undefined, this.selector);
      };
    }
  };
}

export function getElementWithValueDecoratorFor(klass, customSelector) {
  return function () {
    const withCustomValues = !(arguments[0] instanceof Element);
    // invoked with custom values @elementWithValue(selector, scope) to build selector

    if (withCustomValues) {
      let { selector, scope } = arguments[0];
      return function (_target, key, descriptor) {
        descriptor.initializer = function () {
          selector =
            selector || _buildBEMSelectorWithKey(this.bareSelector, key);
          return function (value) {
            return new klass(
              customSelector ?? selector,
              value,
              scope === undefined ? this.selector : scope
            );
          };
        };
      };
    } else {
      // invoked by @elementWithValue without custom values, build selectors using key name and parent selector
      const [_, key, descriptor] = arguments;
      descriptor.initializer = function () {
        return function (value) {
          const selector = _buildBEMSelectorWithKey(this.bareSelector, key);
          return new klass(customSelector ?? selector, value, this.selector);
        };
      };
    }
  };
}

export const element = getElementDecoratorFor(Element);
export const elementWithValue = getElementWithValueDecoratorFor(Element);
