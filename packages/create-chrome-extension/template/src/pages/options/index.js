import { render, h, Component } from 'preact';

/**
 * Options page with example template taken from https://developer.chrome.com/extensions/options. NON-FUNCTIONAL!
 */
class OptionsApp extends Component {
  render() {
    return (
      <div className="App">
        Favorite color:
        <select id="color">
          <option value="red">red</option>
          <option value="green">green</option>
          <option value="blue">blue</option>
          <option value="yellow">yellow</option>
        </select>
        <label>
          <input type="checkbox" id="like" />I like colors.
        </label>
        <div id="status"></div>
        <button onClick={this.saveOptions}>Save</button>
      </div>
    );
  }
}

render(<OptionsApp />, document.getElementById('root'));
