import { v4 as uuidv4 } from 'uuid';
import fetch from "node-fetch"

export const getTxsStarknet = async (params) => {
    const {address, page = 1, pageSize = 20} = params
    try {
        const request = await fetch(`https://voyager.online/api/txns?to=${address}&ps=${pageSize}&p=${page}`)
        const {items: transactions} = await request.json()

        return transactions
    } catch (error) {
        throw new Error(error)
    }
}