import './App.css';
import { TextEditor } from './TextEditor';
import { getWordbook } from './workbook';

function App() {
  return (
    <div className="App">
      <TextEditor workbook={getWordbook()} />
    </div>
  );
}

export default App;
