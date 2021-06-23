import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

const DialogButton = (props) => {
  const { isOpen, onClose, content, closeBtnTitle, title } = props;

  return (
    <>
      <Button data-test="dialog-button" />
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          data-test="dialog"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={onClose}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              data-test="dialog-transitions"
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>
            <span
              data-test="dialog-center-tag"
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              data-test="dialog-transitions"
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="
                inline-block w-full max-w-md
                p-6 my-8 overflow-hidden
                text-left align-middle
                transition-all transform bg-white
                shadow-xl rounded-2xl
              "
              >
                <Dialog.Title
                  data-test="dialog-title"
                  as="h3"
                >
                  {title}
                </Dialog.Title>
                <div data-test="dialog-content-container" className="mt-2 p-1">
                  {content}
                </div>
                <div className="mt-4">
                  <Button
                    onClick={onClose}
                    data-test="dialog-close-button"
                  >
                    {closeBtnTitle}
                  </Button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

DialogButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.func.isRequired,
  closeBtnTitle: PropTypes.string.isRequired,
};

export default DialogButton;
