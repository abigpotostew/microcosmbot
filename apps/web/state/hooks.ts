import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { modalState as modalInitState } from 'state/Modal'

export const useCloseModal = () => {
  const [modalState, setModalState] = useRecoilState(modalInitState)
  const closeModal = useCallback(() => {
    setModalState((prev) => {
      return {
        ...prev,
        isModalOpen: false,
      }
    })
  }, [setModalState])
  return { closeModal }
}
