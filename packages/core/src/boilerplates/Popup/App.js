import { Component, h } from 'preact';
import chromexLogo from 'assets/icon.png';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <div>
          <img src={chromexLogo} />
        </div>
        <h2>$(PROJECT_NAME)'s Popup Page</h2>
      </div>
    );
  }
}
