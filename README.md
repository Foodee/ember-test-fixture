# ember-test-fixture

Test Fixture class for Ember UI components, providing a UI interface for test cases.

## Compatibility

- Ember.js v3.28 or above
- Ember CLI v3.28 or above
- Node.js v14 or above

## Installation

```
ember install ember-test-fixture
```

## Usage

See this [guide slides](https://docs.google.com/presentation/d/1i426b1j9hOOvMJQN6gYiNU6WoPa20lL_BGT_5RjIuMI/edit?usp=sharing) for more details.

```
class FooFixture extends Fixture {
    constructor() {
        super('data-test-root');
    }

    @element emailField;
    @element commitButton;

    async enterEmail(email) {
        await this.emailField.fillIn(email);
        return this.commitButton.click();
    }
}
```

## Encapsulation and abstraction

Each fixture class represents a UI component and encapsulates all implementation details for interacting with the UI component.

## Separation of concerns

By offloading the UI interaction details to these classes, tests can focus on the behaviors being tested rather than the implementation specifics.

## Increased readibility

Ember test fixtures employ Chai's BDD (Behavior-Driven Development) style testing syntax. Developers can use these fixture classes to set up action methods representing the UI component's behaviors, making the tests read more like plain English.

## Extendibility and composability

As mentioned above, each fixture class represents a UI component. Since UI components can be extended to create new components or composed of other components, test fixtures can also be extended or composed of other fixtures.

## Ease of use

Test fixtures, by default, utilize [BEM](https://getbem.com/)-inspired data-test- data attributes for selectors. If the UI component the fixture represents follows the BEM-style data-test- attributes for its root and child elements, the fixture will automatically infer the selectors for its elements based on their names in the test fixture.

```
<!-- Foo component template -->
<div data-test-foo>
    <header data-test-foo__title></header>
    <button data-test-foo__submit-button></button>
</div>
```

```
class FooFixture extends Fixture {
    constructor() {
        super('data-test-foo');
    }

    @element title;
    @element submitButton;
}
```
