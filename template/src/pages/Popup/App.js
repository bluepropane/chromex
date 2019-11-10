import { Component, h } from 'preact';
import chromexLogo from 'assets/icon.png';

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <div>
          <img src={chromexLogo} />
        </div>
        <h1 style={{ fontWeight: 200 }}>$(PROJECT_NAME)'s Popup Page</h1>
      </div>
    );
  }
}
