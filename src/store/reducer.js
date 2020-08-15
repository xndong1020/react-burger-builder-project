import * as actionTypes from './action'

const initialState={
    ingredients: null,
    totalPrice: 4
}

const reducer=(state=initialState, action)=>{
    switch(action.type){
        default:
            return state;
    }
}

export default reducer;