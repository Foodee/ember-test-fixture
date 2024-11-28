import { expect } from 'chai';
import dasherize from 'ember-test-fixture/utils/dasherize';
import Fixture, { element, Element } from 'ember-test-fixture/fixtures/index';
import { click } from '@ember/test-helpers';

/*
 * Form
 */
export class Form extends Fixture {
  constructor(modelName = 'object') {
    super('data-test-form-for', modelName);
    this.modelName = modelName;
  }

  @element({ selector: 'data-test-form-button', value: 'submit' }) submitButton;
  @element({ selector: 'data-test-form-button', value: 'confirm' })
  confirmButon;
  @element({ selector: 'data-test-rd-ui-alert' }) alert;
  @element({ selector: 'data-tests-form-errors' }) errors;
  @element({ selector: 'data-tests-form-error' }) error;

  async submit() {
    return this.submitButton.click();
  }

  async confirm() {
    return this.confirmButon.click();
  }
}

/*
 * Field
 */
export class Field extends Fixture {
  static registry = {};
  static register(klass) {
    this.registry[klass.name] = klass;
  }

  constructor(_fieldName, { form, using, type = 'text' }, scope) {
    const allDotsReg = /\./g;
    const fieldName = _fieldName.replace(allDotsReg, '__');
    super(
      'data-test-field-for',
      `${form.modelName}_${dasherize(fieldName)}`,
      scope
    );
    this.form = form;
    this.type = type;
    this.fieldName = dasherize(fieldName);
    this.modelName = this.form.modelName;

    //Same logic as @element but need to be defined when an instance is created so doing so in this manual way
    this.errors = new Element('[data-test-form-errors]', null, this.selector);
    this.error = new Element('[data-test-form-error]', null, this.selector);
    this.control = this.constructor.registry[using].build(this);
  }

  async select(value) {
    await this.control.select(value);
  }

  async fill(value) {
    return this.control.fillIn(value);
  }

  async blur() {
    return this.control.blur();
  }

  async clear() {
    await this.fill('');
    this.blur();
  }

  async toggle() {
    return this.control.click();
  }

  async check() {
    await this.control.focus();
    return this.control.click();
  }

  shouldHaveTypeOf(type) {
    expect(this.control.self.type).to.equal(type);
  }
  shouldHaveValueOf(value) {
    expect(this.control.self.value).to.equal(value);
  }

  get shouldBeChecked() {
    return expect(this.control.self.value).to.equal('true');
  }

  get shouldBeNotBeChecked() {
    return expect(this.control.self.value).to.equal('false');
  }

  get shouldBeDisabled() {
    return this.control.shouldBeDisabled;
  }
}

export function field({ using, type, for: forKey }) {
  return function (_, fieldName, descriptor) {
    descriptor.initializer = function () {
      return new Field(
        forKey ?? fieldName,
        { form: this, type, using },
        this.selector
      );
    };
  };
}

export class Control extends Element {
  static build(field) {
    return new this(this.selector, null, field?.selector);
  }
}

class Input extends Control {
  static name = 'input';
  static selector = '[data-test-ff-control-input]';
}
Field.register(Input);

class Select extends Control {
  static name = 'select';
  static selector = '[data-test-ff-control-select]';
}
Field.register(Select);

class Checkbox extends Control {
  static name = 'checkbox';
  static selector = '[data-test-ff-control-checkbox]';
}
Field.register(Checkbox);

class CheckboxSelect extends Control {
  static name = 'checkbox-select';
  static selector = '[data-test-ff-control-checkbox-select]';
}
Field.register(CheckboxSelect);

class Radio extends Control {
  static name = 'radio';
  static selector = '[data-test-ff-control-radio]';

  selectOption(option) {
    return click(
      `${this.selector}[data-test-ff-control-radio-option=${option}]`
    );
  }
}
Field.register(Radio);

class Button extends Fixture {
  constructor(_, buttonType, { form }) {
    super('[data-test-form-button="${buttonType}"]');
    this.form = form;
    this.buttonType = dasherize(buttonType);
  }
}

export function button(buttonType = 'submit') {
  return function (_, fieldName, descriptor) {
    descriptor.initializer = function () {
      return new Button(fieldName, buttonType, { form: this });
    };
  };
}

class ButtonNamed extends Fixture {
  constructor(_, buttonType, { form }) {
    super('[data-test-rd-ui-button-named="${buttonType}"]');
    this.form = form;
    this.buttonType = dasherize(buttonType);
  }
}

export function buttonNamed(buttonType = 'object') {
  return function (_, fieldName, descriptor) {
    descriptor.initializer = function () {
      return new ButtonNamed(fieldName, buttonType, { form: this });
    };
  };
}
