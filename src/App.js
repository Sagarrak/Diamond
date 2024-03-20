// ** Router Import
import Router from './router/Router'
import withSession from './ui/components/Session/withSession';
// import CartState from './context/CartState';
const App = () =>
    //<CartState>
    <Router />
// </CartState>

// export default App;
export default withSession(App);
