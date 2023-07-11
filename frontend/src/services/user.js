import axios from "axios";
import { errorAlert, success } from "./alerts";

export const submitUser = async (data, operationMode) => {
    let json = {
        fullname: data.fullname,
        email: data.email,
        password: data.password,
        gender: data.gender,
        phone: data.phone,
        address: data.address
    }
    try {
        const response = operationMode === 'create'
            ? await axios.post(`http://localhost:3030/api/users/create`, json)
            : await axios.put(`http://localhost:3030/api/users/update/${data._id}`, {
                fullname: data.fullname,
                gender: data.gender,
                phone: data.phone,
                address: data.address
            })
        success(response.data.message)
    } catch (error) {
        errorAlert(error.response.data.message)
    }
}
export const resetpwd = (e) => {
    axios.post(global.config.BACKEND_URL + '/api/resetpwd/send', {
        email: e.target.email.value
    })
        .then(response => success("We've sent an email, please open your inbox."))
        .catch(err => errorAlert(err.response.data.message))
}
export const changepwd = async (e, token) => {
    const response = await axios.post(global.config.BACKEND_URL + '/api/resetpwd', {
        newPassword: e.target.password.value,
        token: token
    })
    return response.data
}