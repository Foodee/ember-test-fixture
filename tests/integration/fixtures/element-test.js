import Fixture, {
  element,
  elementWithValue,
} from 'ember-test-fixture/fixtures/index';

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupRenderingTest } from 'ember-mocha';

describe('Integration | fixtures | element', function () {
  setupRenderingTest();

  it('can build a fixture with various forms of selectors', function () {
    const fixture1 = new Fixture('[data-test-foo]');
    const fixture2 = new Fixture('data-test-foo');

    expect(fixture1.selector).to.equal('[data-test-foo]');
    expect(fixture2.selector).to.equal('[data-test-foo]');
  });

  describe('@element decorator', function () {
    it('can create an element property with various forms of selectors', function () {
      class TestFixture extends Fixture {
        @element({ selector: '[data-test-foo]' }) fullSelector;
        @element({ selector: 'data-test-foo' }) withoutBrackets;
      }
      const testFixture = new TestFixture();
      expect(testFixture.fullSelector.selector).to.equal('[data-test-foo]');
      expect(testFixture.withoutBrackets.selector).to.equal('[data-test-foo]');
    });

    it('can create an element property with a selector with a value', function () {
      class TestFixture extends Fixture {
        @element({ selector: 'data-test-foo', value: 'some-value' }) foo;
      }
      const testFixture = new TestFixture();
      expect(testFixture.foo.selector).to.equal('[data-test-foo="some-value"]');
    });

    it('can create an element property with a selector by dasherizing key when invoked without an arg', function () {
      class TestFixture extends Fixture {
        @element foo;
      }
      const testFixture = new TestFixture();
      expect(testFixture.foo.selector).to.equal('[data-test-foo]');
    });

    it('can create an element property with a selector in a scope using parent fixture selector', function () {
      class TestFixture extends Fixture {
        constructor() {
          super('data-test-root');
        }
        @element({ selector: 'data-test-foo' }) foo;
      }
      const testFixture = new TestFixture();
      expect(testFixture.foo.selector).to.equal(
        '[data-test-root] [data-test-foo]'
      );
    });

    it('can create an element property with a selector without a scope by specifically passing empty value', function () {
      class TestFixture extends Fixture {
        constructor() {
          super('data-test-root');
        }
        @element({ selector: 'data-test-foo', scope: null }) foo;
        @element({ scope: null }) boo;
      }
      const testFixture = new TestFixture();
      expect(testFixture.foo.selector).to.equal('[data-test-foo]');
      expect(testFixture.boo.selector).to.equal('[data-test-root__boo]');
    });

    it('can create an element property with a selector in bem style and a value', function () {
      class TestFixture extends Fixture {
        constructor() {
          super('data-test-root');
        }
        @element({ value: 'some-value' }) foo;
      }
      const testFixture = new TestFixture();
      expect(testFixture.selector).to.equal('[data-test-root]');
      expect(testFixture.foo.selector).to.equal(
        '[data-test-root] [data-test-root__foo="some-value"]'
      );
    });

    it('can create an element property with a selector by dasherizing key in bem style and in scope when invoked without an arg and parent component as a selector', function () {
      class TestFixture extends Fixture {
        constructor() {
          super('data-test-root');
        }
        @element foo;
      }
      const testFixture = new TestFixture();
      expect(testFixture.selector).to.equal('[data-test-root]');
      expect(testFixture.foo.selector).to.equal(
        '[data-test-root] [data-test-root__foo]'
      );
    });
  });

  describe('@elementWithValue decorator', function () {
    it('can create a method that can take a dynamic value and return an element with a selector with the value', function () {
      class TestFixture extends Fixture {
        @elementWithValue({ selector: 'data-test-foo' }) foo;
      }
      const testFixture = new TestFixture();
      expect(testFixture.foo('some-value').selector).to.equal(
        '[data-test-foo="some-value"]'
      );
    });

    it('can create a method that can take a dynamic value and return an element with a selector with the value and dasherized key when invoked without an arg', function () {
      class TestFixture extends Fixture {
        @elementWithValue foo;
      }
      const testFixture = new TestFixture();
      expect(testFixture.foo('some-value').selector).to.equal(
        '[data-test-foo="some-value"]'
      );
    });

    it('can create an element property with a selector with a value in a scope using parent fixture selector', function () {
      class TestFixture extends Fixture {
        constructor() {
          super('data-test-root');
        }
        @elementWithValue({ selector: 'data-test-foo' }) foo;
      }
      const testFixture = new TestFixture();
      expect(testFixture.foo('some-value').selector).to.equal(
        '[data-test-root] [data-test-foo="some-value"]'
      );
    });

    it('can create an element property with a selector with a value but without a scope by specifically passing empty value', function () {
      class TestFixture extends Fixture {
        constructor() {
          super('data-test-root');
        }
        @elementWithValue({ selector: 'data-test-foo', scope: null }) foo;
        @elementWithValue({ scope: null }) boo;
      }
      const testFixture = new TestFixture();
      expect(testFixture.foo('some-value').selector).to.equal(
        '[data-test-foo="some-value"]'
      );
      expect(testFixture.boo('some-value').selector).to.equal(
        '[data-test-root__boo="some-value"]'
      );
    });

    it('can create a method that can take a dynamic value and return an element with a selector with the value in a bem style when invoked without an arg and the parent component has a selector', function () {
      class TestFixture extends Fixture {
        constructor() {
          super('data-test-root');
        }
        @elementWithValue foo;
      }
      const testFixture = new TestFixture();
      expect(testFixture.foo('some-value').selector).to.equal(
        '[data-test-root] [data-test-root__foo="some-value"]'
      );
    });
  });
});
