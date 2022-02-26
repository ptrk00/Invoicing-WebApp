import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loginFailure, loginStart, loginSuccess} from "../redux/userRedux";
import {unauthenticatedReq} from "../api-requests";

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const {isFetching, error} = useSelector((state) => state);

    const login = async (dispatch,user) => {
        dispatch(loginStart());
        try {
            const res = await unauthenticatedReq.post('/auth/login',user);
            dispatch(loginSuccess(res.data));
        } catch (err) {
            dispatch(loginFailure());
        }
    }

    const clickHandler = (e) => {
        e.preventDefault();
        login(dispatch, {username, password});
    }


    return (
        <form>
            <input placeholder="username" onChange={(e) => setUsername(e.target.value)}/>
            <input placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={clickHandler} disabled={isFetching}>login</button>
        </form>
    );

}

export default Login;