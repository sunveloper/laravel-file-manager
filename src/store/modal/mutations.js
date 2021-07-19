export default {
  /**
   * Modal window state
   * @param state
   * @param show
   * @param modalName
   */
  setModalState(state, { show, modalName }) {
    state.showModal = show;
    state.modalName = modalName;
    document.querySelector('body').classList.add('modal-open');
  },

  /**
   * Clear modal
   * @param state
   */
  clearModal(state) {
    state.showModal = false;
    state.modalName = null;
    document.querySelector('body').classList.remove('modal-open');
  },

  /**
   * Main modal block - set height
   * @param state
   * @param height
   */
  setModalBlockHeight(state, height) {
    state.modalBlockHeight = height;
  },
};
