// Slomux - реализация Flux, в которой, как следует из названия, что-то сломано.
// Нужно починить то, что сломано, и подготовить Slomux к использованию на больших проектах, где крайне важна производительность

// ВНИМАНИЕ! Замена slomux на готовое решение не является решением задачи

const createStore = (reducer, initialState) => {
    let currentState = initialState
    let listeners = []
    let _context = null
    const getState = () => currentState
    const dispatch = action => {
      currentState = reducer(currentState, action)
      listeners.forEach(listener => listener())
    }
  
    const subscribe = listener => listeners.push(listener)
    
    const setContext = (context) => {
       _context = context
    }
     
    const getContext = () => _context
   
    return { getState, dispatch, subscribe, setContext, getContext }
  }
  
  // reducers
  const defaultState = {
    counter: 1,
    stepSize: 1,
  }
  
  const reducer = (state = defaultState, action) => {
    
    switch(action.type) {
      case UPDATE_COUNTER:
        return {
          ...state,
          counter: state.counter + action.payload
        }
        
      case CHANGE_STEP_SIZE:
       return {
          ...state,
          stepSize: action.payload
        }
      default:
        return state
    }
  }
  
  const store = createStore(reducer, defaultState)
  
  const useSelector = selector => {
    const ctx = React.useContext(store.getContext())  
    
    if (!ctx) {
      return 0
    }
     
    return selector(ctx.store.getState()) 
  }
  
  const useDispatch = () => {
    const ctx = React.useContext(store.getContext())
    if (!ctx) {
      return () => {}
    }
    
    return ctx.store.dispatch
  }
  
  const Provider = ({ store, context, children }) => {
    const Context = context || React.createContext(null) 
    store.setContext(Context)
    return <Context.Provider value={{ store }}>{children}</Context.Provider> 
  }
  
  // APP
  
  // actions
  const UPDATE_COUNTER = 'UPDATE_COUNTER'
  const CHANGE_STEP_SIZE = 'CHANGE_STEP_SIZE'
  
  // action creators
  const updateCounter = value => ({
    type: UPDATE_COUNTER,
    payload: value,
  })
  
  const changeStepSize = value => ({
    type: CHANGE_STEP_SIZE,
    payload: value,
  })
  
  
  
  
  // ВНИМАНИЕ! Использование собственной реализации useSelector и dispatch обязательно
  const Counter = () => {
    const counter = useSelector(state => state.counter)
    const dispatch = useDispatch()
  
    return (
      <div>
        <button onClick={() => dispatch(updateCounter(-1))}>-</button>
        <span> {counter} </span>
        <button onClick={() => dispatch(updateCounter(1))}>+</button>
      </div>)
    
  }
   
  const Step = () => {
    const stepSize = useSelector(state => state.stepSize)
    const dispatch = useDispatch()
  
    return (
      <div>
        <div>Значение счётчика должно увеличиваться или уменьшаться на заданную величину шага</div>
        <div>Текущая величина шага: {stepSize}</div>
        <input
          type="range"
          min="1"
          max="5"
          value={stepSize}
          onChange={({ target }) => dispatch(changeStepSize(target.value))}
        />
      </div>
    )
  }
  
  let render = () => {
    ReactDOM.render(
    <Provider store={store}>
        <Step />
        <Counter />
    </Provider>,
    document.getElementById('app')
  )
  }
  
  render()
  
  store.subscribe(render)