import {Switch, Route, Redirect} from 'react-router-dom'

import Login from './Login'

import Home from './Home'

import Jobs from './Jobs'

import JobDetailData from './jobDetailData'

import NotFound from './notFound'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <Route exact path="/" component={Home} />
    <Route exact path="/jobs" component={Jobs} />
    <Route exact path="/jobs/:id" component={JobDetailData} />
    <Route path="/not-found" component={NotFound} />
    <Redirect component={NotFound} />
  </Switch>
)

export default App
