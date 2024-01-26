import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import * as statusCode from '../../data/constants/status';
import LoadingModal from '../loading/LoadingModal';

// TODO: Make data presentable
// TODO: Modal Design for dark mode and light mode

const Modal = (props) => {
  const {
    title,
    children,
    visible,
    onClose = undefined,
    AdminGame,
    isEntrySummary,
    isUpdateWarning,
    isMarketplaceModalOpen,
  } = props;

  // TODO: Make the modal more presentable
  return (
    <>
      <Transition appear show={visible} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => onClose || console.log()}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-indigo-gray bg-opacity-60" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className={`bg-indigo-white inline-block p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl ${
                  AdminGame === true
                    ? 'w-full'
                    : isEntrySummary
                    ? 'w-3/5'
                    : isUpdateWarning
                    ? 'md:w-2/5 w-full'
                    : isMarketplaceModalOpen
                    ? 'md:h-40 w-1/5' // Adjust the width and height as needed
                    : 'w-full max-w-md'
                }`}
              >
                {console.log(isEntrySummary, 'test')}
                <Dialog.Title
                  as="h3"
                  className={`text-lg font-medium leading-6 text-gray-900 pb-4 font-monument uppercase ${
                    isMarketplaceModalOpen === true ? 'mb-2' : 'mb-0'
                  }`}
                >
                  {title}
                  <div className="underlineBig" />
                </Dialog.Title>
                {children}
                {/* <button
                  type="button"
                  className="mt-10 inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 w-full"
                  onClick={() => onClose()}
                >
                  Close
                </button> */}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
