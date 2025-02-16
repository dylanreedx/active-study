import api from "./api";

export const getUserData = async () => {
    const response = await api.get('/user');
    return response;
}

// export const updatePassword = async (password: string, confirm_password: string) => {
//     const response = await api.put('/user/password', { password, confirm_password });
//     return response;
// }

// export const updateName = async (name: string) => {
//     const response = await api.put('/user/name', { name });
//     return response;
// }