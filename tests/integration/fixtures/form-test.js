import { Form, field } from 'ember-test-fixture/fixtures/form';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupRenderingTest } from 'ember-mocha';

describe('Integration | fixtures | form', function () {
  setupRenderingTest();

  it('renders with fields', function () {
    class FormFixture extends Form {
      constructor() {
        super('test-model');
      }
      @field({ using: 'input' }) email;
      @field({ using: 'checkbox' }) rememberMe;
      @field({ using: 'select' }) location;
    }
    const fixture = new FormFixture();

    expect(fixture.selector).to.equal('[data-test-form-for="test-model"]');
    expect(fixture.submitButton.selector).to.equal(
      '[data-test-form-for="test-model"] [data-test-form-button="submit"]'
    );
    expect(fixture.confirmButon.selector).to.equal(
      '[data-test-form-for="test-model"] [data-test-form-button="confirm"]'
    );
    expect(fixture.alert.selector).to.equal(
      '[data-test-form-for="test-model"] [data-test-rd-ui-alert]'
    );
    expect(fixture.errors.selector).to.equal(
      '[data-test-form-for="test-model"] [data-tests-form-errors]'
    );

    expect(fixture.email.selector).to.equal(
      '[data-test-form-for="test-model"] [data-test-field-for="test-model_email"]'
    );
    expect(fixture.email.control.selector).to.equal(
      '[data-test-form-for="test-model"] [data-test-field-for="test-model_email"] [data-test-ff-control-input]'
    );
    expect(fixture.email.errors.selector).to.equal(
      '[data-test-form-for="test-model"] [data-test-field-for="test-model_email"] [data-test-form-errors]'
    );

    expect(fixture.rememberMe.selector).to.equal(
      '[data-test-form-for="test-model"] [data-test-field-for="test-model_remember-me"]'
    );
    expect(fixture.rememberMe.control.selector).to.equal(
      '[data-test-form-for="test-model"] [data-test-field-for="test-model_remember-me"] [data-test-ff-control-checkbox]'
    );
    expect(fixture.rememberMe.errors.selector).to.equal(
      '[data-test-form-for="test-model"] [data-test-field-for="test-model_remember-me"] [data-test-form-errors]'
    );

    expect(fixture.location.selector).to.equal(
      '[data-test-form-for="test-model"] [data-test-field-for="test-model_location"]'
    );
    expect(fixture.location.control.selector).to.equal(
      '[data-test-form-for="test-model"] [data-test-field-for="test-model_location"] [data-test-ff-control-select]'
    );
    expect(fixture.location.errors.selector).to.equal(
      '[data-test-form-for="test-model"] [data-test-field-for="test-model_location"] [data-test-form-errors]'
    );
  });
});
