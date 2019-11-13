import './index.css';
import { render, h, Component } from 'preact';
import chromexLogo from 'assets/icon.png';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div>
          <img src={chromexLogo} />
        </div>
        <h1 style={{ fontWeight: 300 }}>$(PROJECT_NAME)'s New Tab Page</h1>
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));

console.log('hello world!');
