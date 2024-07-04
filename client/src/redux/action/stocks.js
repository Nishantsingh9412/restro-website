import * as api from '../../api/index';

export const getAllStocksAction = (localStorageId) => async (dispatch) => {
    try{
        const {data} = await api.getAllStocks(localStorageId);
        dispatch({ type: 'GET_ALL_STOCKS', data:data.result});
        console.log("this is the data from getAllStocksAction: ", data.result)
        return { success: true, message: 'Stocks Fetched Successfully' };
    }catch(error){
        console.log("Error from getAllStocks Action: " + error.message, error.stack);
        return { success: false, message: 'something went wrong' };
    }
}


export const getLowStocksAction = (localStorageId) => async (dispatch) => {
    try{
        const {data} = await api.getLowStocks(localStorageId);
        dispatch({ type: 'GET_LOW_STOCKS', data:data.result});
        console.log("this is the data from getLowStocksAction: ", data.result)
        return {success: true, message: 'Low Stocks Fetched Successfully'}
    }catch(error){
        console.log("Error from getLowStocks Action: " + error.message, error.stack);
        return { success: false, message: 'something went wrong' };
    }
}