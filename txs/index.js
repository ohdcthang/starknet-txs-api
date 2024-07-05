import { v4 as uuidv4 } from 'uuid';
import fetch from "node-fetch"

export const getTxsStarknet = async (params) => {
    const {address, page = 1, pageSize = 20, tokenAddress = '', tokenSymbol = 'ETH'} = params
    try {
        const request = await fetch(`https://voyager.online/api/txns?to=${address}&ps=${pageSize}&p=${page}`)
        const {items: transactions} = await request.json()

        const transactionDetails = await Promise.all(transactions?.map(async (item) => {
            const requestTx = await fetch(`https://voyager.online/api/txn/${item.hash}`)
            const data = await requestTx.json()
      
            return {
               ...item,
               ...data
            }
        }),[])

        if(!tokenAddress){
            const mainTokens = transactionDetails?.filter((tx) => {
                const transaction = tx?.receipt?.tokensTransferred?.find((item) => item.symbol === 'ETH')

                return transaction
            })

            const history = mainTokens?.map((tx) => {
                const from = tx?.sender_address || ''
                const token = tx?.receipt?.tokensTransferred?.find((item) => item.symbol === 'ETH')
                const to = token?.to
                let type = 'excuteContract'

                if(token?.function === 'transfer'){
                    if(from === to){
                        type = 'self'
                    }else if(from.toLowerCase() === address?.toLowerCase()){
                        type = 'send'
                    }else{
                        type = 'receive'
                    }
                }

                return {
                    hash: tx?.hash || '',
                    timestamp: tx?.timestamp || 0,
                    from,
                    to,
                    amount: token?.amount || '0',
                    type
                }
            })

            return history
        }

        const subTokens = transactionDetails?.filter((tx) => tx?.receipt?.tokensTransferred?.find((item) => item.symbol === tokenSymbol))
      
        const history = subTokens?.map((tx) => {
            const from = tx?.sender_address || ''
            const token = tx?.receipt?.tokensTransferred?.find((item) => item.symbol === tokenSymbol)
            const to = token?.to
            let type = 'excuteContract'

            if(token?.function === 'transfer'){
                if(from === to){
                    type = 'self'
                }else if(from.toLowerCase() === address?.toLowerCase()){
                    type = 'send'
                }else{
                    type = 'receive'
                }
            }

            return {
                hash: tx?.hash || '',
                timestamp: tx?.timestamp || 0,
                from,
                to,
                amount: token?.amount || '0',
                type
            }
        })

        return history
    } catch (error) {
        throw new Error(error)
    }
}