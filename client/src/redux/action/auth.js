import * as api from '../../api/index.js';

export const SignUpAction = (newUser) => async (dispatch) => {
    try {
        const { data } = await api.signUpAPI(newUser);
        // localStorage.setItem('ProfileData', JSON.stringify(data));
        dispatch({ type: 'AUTH', data });
        return { success: true, message: "Sign up successfull" };
    } catch (err) {
        console.log("Error from SignUp Action: " + err.message, err.stack);
        return { success: false, message: err.response.data.message };
    }
}

export const LoginAction = (user) => async (dispatch) => {
    try {
        const { data } = await api.loginAPI(user);
        // localStorage.setItem('ProfileData', JSON.stringify(data));
        dispatch({ type: 'AUTH', data });
        return { success: true, message: "Login Successfull" };
    } catch (err) {
        console.log("Error from Login Action: " + err.message, err.stack);
        return { success: false, message: err.response.data.message };
    }
}

export const LoginDelivBoyAction = (user) => async (dispatch) => {
    try {
        const { data } = await api.loginDelivBoyAPI(user);
        dispatch({ type: 'AUTH', data });
        return { success: true, message: "Login Successfull" };
    } catch (err) {
        console.log("Error from LoginDelivBoy Action: " + err.message, err.stack);
        return { success: false, message: err.response.data.message };
    }
}
