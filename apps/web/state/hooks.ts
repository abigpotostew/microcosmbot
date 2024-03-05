import { useCallback } from 'react'
import { useRecoilState } from 'recoil'
import { modalState as modalInitState } from 'state/Modal'

export const useCloseModal = () => {
  const [modalState, setModalState] = useRecoilState(modalInitState)
  const closeModal = useCallback(
    ({ resetChildren = false }: { resetChildren?: boolean } = {}) => {
      setModalState((prev) => {
        if (resetChildren)
          return {
            ...prev,
            isModalOpen: false,
            modalChildren: null,
          }
        return {
          ...prev,
          isModalOpen: false,
        }
      })
    },
    [setModalState]
  )

  const closeModalReset = useCallback(
    () => closeModal({ resetChildren: true }),
    [closeModal]
  )
  return { closeModal, closeModalReset }
}
