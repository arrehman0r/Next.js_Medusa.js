import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Modal from 'react-modal';
import OwlCarousel from '../owl-carousel';
import { Magnifier } from 'react-image-magnifiers';

const customStyles = {
  content: { position: "relative" },
  overlay: {
    background: 'rgba(0,0,0,.4)',
    overflowX: 'hidden',
    display: 'flex',
    overflowY: 'auto',
    opacity: 0
  }
};

Modal.setAppElement('#__next');

function ImageModal(props) {
  const router = useRouter();
  const { isOpen, closeModal, images } = props;

  useEffect(() => {
    closeModal();
    router.events.on('routeChangeStart', closeModal);
    return () => {
      router.events.off('routeChangeStart', closeModal);
    };
  }, []);

  useEffect(() => {
    if (isOpen)
      setTimeout(() => {
        document.querySelector(".ReactModal__Overlay").classList.add('opened');
      }, 100);
  }, [isOpen]);

  const closeImageModal = () => {
    document.querySelector(".ReactModal__Overlay").classList.add('removed');
    document.querySelector(".ReactModal__Overlay").classList.remove('opened');
    document.querySelector(".video-modal.ReactModal__Content").classList.remove("ReactModal__Content--after-open");
    document.querySelector(".video-modal-overlay.ReactModal__Overlay").classList.remove("ReactModal__Overlay--after-open");

    setTimeout(() => {
      closeModal();
    }, 330);
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="ImageModal"
      onRequestClose={closeImageModal}
      shouldFocusAfterRender={false}
      style={customStyles}
      overlayClassName="video-modal-overlay"
      className="row video-modal" id="video-modal"
    >
      <OwlCarousel adClass="product-single-carousel owl-theme owl-nav-inner">
        {images && images.map((item, index) => (
          <Magnifier
            key={'quickview-image-' + index}
            imageSrc={item.url}
            imageAlt="magnifier"
            largeImageSrc={item.url}
            dragToMove={false}
            mouseActivation="hover"
            cursorStyleActive="crosshair"
            className="product-image large-image"
          />
        ))}
      </OwlCarousel>
      <button title="Close (Esc)" type="button" className="mfp-close" onClick={closeModal}>
        <span>×</span>
      </button>
    </Modal>
  );
}

export default ImageModal;
