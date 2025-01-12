import { requestWithJwt, requestWithoutJwt } from './request'

export const signIn = async (payload) => {
    return await requestWithoutJwt.post('/users/signIn', { data: payload }, { withCredentials: true })
}
export const findUserById = async (id) => {
    console.log(id, 'id');
    return await requestWithJwt.get(`/users/${id}`)
  }
  