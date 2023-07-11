
//scss
import "./assets/scss/hope-ui.scss"
import "./assets/scss/customizer.scss"

// Redux Selector / Action
import { useDispatch } from 'react-redux';

// import state selectors
import { setSetting } from './store/setting/actions'

function App({children}) {
  const dispatch = useDispatch()
  dispatch(setSetting())
  return (
    <div className="App">
      {children}
    </div>
  );
}

export default App;
