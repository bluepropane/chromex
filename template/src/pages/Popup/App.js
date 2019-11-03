import { Component, h } from 'preact';
import cceLogo from 'assets/icon.png';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <div>
          <img src={cceLogo} />
        </div>
        <h2>My First Extsension</h2>
      </div>
    );
  }
}
