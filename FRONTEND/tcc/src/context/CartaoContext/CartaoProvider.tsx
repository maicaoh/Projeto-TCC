import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'
import { Cartao, CartaoContext, CartaoList } from './CartaoContext'

interface CartaoProviderProps {
  children: React.ReactNode
}

export const CartaoProvider: React.FC<CartaoProviderProps> = ({ children }) => {
  const [cartoes, setCartoes] = useState<CartaoList[]>([])

  const listarCartoes = async (
    id: string,
  ): Promise<{ sucesso: boolean; data?: CartaoList[]; erro?: any }> => {
    try {
      const response = await api.get(`/cartao/partida/${id}`)
      const data = response?.data?.cartao || []

      // Adapta os dados recebidos para o formato que o front espera
      const cartoesAdaptados: CartaoList[] = data.map((item: any) => ({
        ...item,
      }))

      setCartoes(cartoesAdaptados)
      return { sucesso: true, data: cartoesAdaptados }
    } catch (error: any) {
      console.error('Erro ao listar cartoes:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const criarCartao = async (
    idPartida: string,
    cartao: Omit<Cartao, 'id' | 'createAt' | 'updateAt' | 'isDeleted'>,
  ): Promise<{ sucesso: boolean; data?: Cartao; erro?: any }> => {
    try {
      const response = await api.post(`/cartao/${idPartida}`, cartao)
      return { sucesso: true, data: response.data?.cartao }
    } catch (error: any) {
      console.error('Erro ao criar cartao:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const editarCartao = async (
    id: string,
    cartao: Omit<Cartao, 'createAt' | 'updateAt' | 'isDeleted'>,
  ): Promise<{ sucesso: boolean; data?: Cartao; erro?: any }> => {
    try {
      const response = await api.put(`/cartao/${id}`, cartao)
      return { sucesso: true, data: response.data?.cartao }
    } catch (error: any) {
      console.error('Erro ao editar cartao:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  const removerCartao = async (id: string): Promise<{ sucesso: boolean; data?: Cartao; erro?: any }> => {
    try {
      const response = await api.delete(`/cartao/${id}`)
      return { sucesso: true, data: response.data?.cartao }
    } catch (error: any) {
      console.error('Erro ao remover cartao:', error)
      return { sucesso: false, erro: error.response?.data || error.message }
    }
  }

  return (
    <CartaoContext.Provider
      value={{
        cartoes,
        listarCartoes,
        criarCartao,
        editarCartao,
        removerCartao,
      }}
    >
      {children}
    </CartaoContext.Provider>
  )
}
